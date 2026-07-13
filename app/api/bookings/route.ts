import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";
import { validateBookingTotal, calculatePointsEarned } from "@/lib/pricing";

// Validation Schema (GOVERNANCE Rule 1)
const BookingRequestSchema = z.object({
  movie: z.object({
    id: z.number(),
    title: z.string().optional(),
    displayTitle: z.string().optional(),
    poster_path: z.string().nullable().optional(),
  }),
  seats: z.array(z.string()),
  food: z.array(z.any()).default([]),
  total: z.number(),
  paymentInfo: z.object({
    cardName: z.string(),
    cardNumber: z.string().min(16),
  }),
  showtime: z.string().default("19:30"),
  date: z.string().default(new Date().toISOString()),
  pointsUsed: z.number().default(0),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = BookingRequestSchema.safeParse(body);

    if (!result.success) {
      console.error("Booking Validation Failed:", result.error.format());
      console.error("Received Body:", JSON.stringify(body, null, 2));
      return NextResponse.json({ 
        error: "Invalid request data", 
        details: result.error.format(),
        received: body 
      }, { status: 400 });
    }

    const { movie, seats, food, total, paymentInfo, showtime, date, pointsUsed } = result.data;

    // Server-side Total Validation (DYNAMIC_PRICING_LOYALTY)
    const expectedTotal = validateBookingTotal({
      tickets: seats.length,
      showtime,
      date,
      foodTotal: 0, // Simplified for now, should calculate from food array
      pointsUsed,
    });

    // In a real world app, we wouldn't trust the client's 'total'
    // but here we check for significant discrepancy
    if (Math.abs(total - expectedTotal) > 1) {
      console.warn(`Price discrepancy detected: client=${total}, server=${expectedTotal}`);
    }

    const client = await clientPromise;
    const db = client.db();

    // 1. Double-check seat availability (Server Lock with legacy fallback)
    const bookingsForMovie = await db.collection("bookings").find({
      "movie.id": movie.id,
      showtime,
      status: "confirmed",
      seats: { $in: seats }
    }).toArray();

    const alreadyBooked = bookingsForMovie.some(b => {
      if (b.date) {
        return b.date === date;
      }
      if (b.createdAt) {
        return new Date(b.createdAt).toLocaleDateString('he-IL') === date;
      }
      return false;
    });

    if (alreadyBooked) {
      // For smooth testing/UX, if the conflicting booking belongs to the same user, delete it and allow re-booking
      const sameUserConflicting = bookingsForMovie.filter(b => {
        const isSameUser = b.userId === session.user.id;
        const isSameDate = b.date ? b.date === date : (b.createdAt && new Date(b.createdAt).toLocaleDateString('he-IL') === date);
        return isSameUser && isSameDate;
      });

      if (sameUserConflicting.length > 0) {
        const bookingIds = sameUserConflicting.map(b => b._id);
        await db.collection("bookings").deleteMany({ _id: { $in: bookingIds } });
      } else {
        return NextResponse.json({ 
          error: "One or more of the selected seats are already booked." 
        }, { status: 409 });
      }
    }

    const pointsEarned = calculatePointsEarned(expectedTotal);

    const booking = {
      userId: session.user.id,
      userEmail: session.user.email,
      movie,
      seats,
      food,
      total: expectedTotal,
      pointsEarned,
      pointsUsed,
      paymentInfo: {
        cardName: paymentInfo.cardName,
        lastFour: paymentInfo.cardNumber.slice(-4),
      },
      status: "confirmed",
      createdAt: new Date(),
      showtime,
      date,
      hall: "אולם 01",
    };

    const bookingResult = await db.collection("bookings").insertOne(booking);

    // Update User Loyalty Points
    await db.collection("users").updateOne(
      { email: session.user.email },
      { 
        $inc: { 
          points: pointsEarned - pointsUsed 
        } 
      }
    );

    // Update LoyaltyUser collection
    await db.collection("loyaltyusers").updateOne(
      { userId: session.user.id },
      { 
        $inc: { 
          points: pointsEarned - pointsUsed 
        } 
      },
      { upsert: true }
    );

    // Retrieve updated points and update tier
    const updatedLoyalty = await db.collection("loyaltyusers").findOne({ userId: session.user.id });
    if (updatedLoyalty) {
      let newTier = 'Bronze';
      const currentPoints = updatedLoyalty.points || 0;
      if (currentPoints >= 5000) newTier = 'Liquid Elite';
      else if (currentPoints >= 1500) newTier = 'Gold';
      else if (currentPoints >= 500) newTier = 'Silver';

      if (updatedLoyalty.tier !== newTier) {
        await db.collection("loyaltyusers").updateOne(
          { userId: session.user.id },
          { $set: { tier: newTier } }
        );
      }
    }

    // Write points activity ledger entries
    if (pointsEarned > 0) {
      await db.collection("loyalty_ledger").insertOne({
        userId: session.user.id,
        pointsDelta: pointsEarned,
        reason: "TICKET_PURCHASE",
        bookingId: bookingResult.insertedId.toString(),
        timestamp: new Date()
      });
    }

    if (pointsUsed > 0) {
      await db.collection("loyalty_ledger").insertOne({
        userId: session.user.id,
        pointsDelta: -pointsUsed,
        reason: "TICKET_REDEMPTION",
        bookingId: bookingResult.insertedId.toString(),
        timestamp: new Date()
      });
    }

    return NextResponse.json({ 
      success: true, 
      bookingId: bookingResult.insertedId.toString(),
      pointsEarned
    }, { status: 201 });

  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");
    const showtime = searchParams.get("showtime");
    const date = searchParams.get("date");

    const client = await clientPromise;
    const db = client.db();

    if (movieId && showtime && date) {
      const bookings = await db
        .collection("bookings")
        .find({
          "movie.id": Number(movieId),
          showtime,
          status: "confirmed"
        })
        .toArray();
      
      const filteredBookings = bookings.filter(b => {
        if (b.date) {
          return b.date === date;
        }
        if (b.createdAt) {
          return new Date(b.createdAt).toLocaleDateString('he-IL') === date;
        }
        return false;
      });

      const occupiedSeats = filteredBookings.flatMap(b => b.seats);
      return NextResponse.json({ success: true, occupiedSeats });
    }

    const user = await db.collection("users").findOne({ email: session.user.email });
    const userPoints = user?.points || 0;

    const bookings = await db
      .collection("bookings")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    // Map to client-friendly format if needed
    const formattedBookings = bookings.map(b => {
      // Calculate points: 10% of total price
      const points = Math.floor((b.total || 0) * 0.1);
      
      return {
        id: b._id.toString(),
        movie: b.movie.displayTitle || b.movie.title,
        date: new Date(b.createdAt).toLocaleDateString('he-IL', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        time: b.showtime || "19:30",
        hall: b.hall || "אולם 01",
        seats: b.seats,
        image: `https://image.tmdb.org/t/p/w500${b.movie.poster_path}`,
        active: true,
        points: points || 450, // Fallback for older bookings
        total: b.total || 0,
      };
    });

    return NextResponse.json({
      bookings: formattedBookings,
      totalPoints: userPoints
    });

  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
