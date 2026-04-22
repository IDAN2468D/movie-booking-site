import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { movie, seats, food, total, paymentInfo } = body;

    const client = await clientPromise;
    const db = client.db();

    const booking = {
      userId: session.user.id,
      userEmail: session.user.email,
      movie: {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
      },
      seats,
      food,
      total,
      paymentInfo: {
        cardName: paymentInfo.cardName,
        lastFour: paymentInfo.cardNumber.slice(-4),
      },
      status: "confirmed",
      createdAt: new Date(),
      showtime: "19:30", // In a real app, this would come from selection
      hall: "אולם 01", // Hardcoded for now
    };

    const result = await db.collection("bookings").insertOne(booking);

    return NextResponse.json({ 
      success: true, 
      bookingId: result.insertedId.toString() 
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

    return NextResponse.json(formattedBookings);

  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
