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
    displayTitle: z.string(),
    poster_path: z.string().nullable(),
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
      return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 });
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

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
        movie: b.movie.title,
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
