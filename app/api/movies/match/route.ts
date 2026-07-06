import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";

// Zod Schema for validation as per Data Boundary Validation rule
const MatchRequestSchema = z.object({
  userId: z.string(),
  likedMovieIds: z.array(z.number())
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = MatchRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request data" 
      }, { status: 400 });
    }

    const { likedMovieIds } = result.data;
    if (likedMovieIds.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "No liked movies provided" 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const todayISO = new Date().toISOString().split('T')[0];
    const todayHeIL = new Date().toLocaleDateString('he-IL');
    const TOTAL_SEATS = 50; 
    const SHOWTIMES = ["19:30", "21:30", "23:00"];
    
    // Check for showtimes and available seats
    for (const movieId of likedMovieIds) {
      for (const showtime of SHOWTIMES) {
        const bookings = await db.collection("bookings").find({
          "movie.id": movieId,
          showtime,
          status: "confirmed"
        }).toArray();

        // Legacy Date Fallbacks (Rule 3)
        const todaysBookings = bookings.filter(b => {
          if (b.date) {
            return b.date.startsWith(todayISO) || b.date === todayHeIL;
          }
          if (b.createdAt) {
            return new Date(b.createdAt).toLocaleDateString('he-IL') === todayHeIL;
          }
          return false;
        });

        const occupiedSeatsCount = todaysBookings.reduce((acc, curr) => acc + (curr.seats?.length || 0), 0);
        const availableSeats = TOTAL_SEATS - occupiedSeatsCount;

        if (availableSeats > 0) {
          // Match Found
          return NextResponse.json({
            success: true,
            data: {
              movieId,
              showtime,
              hall: "אולם 5",
              availableSeats,
              message: `Match Found! Showing in 1 hour in Hall 5, ${availableSeats} seats left!`
            }
          }, { status: 200 });
        }
      }
    }

    // Fallback: gracefully handle sold out or passed showtimes
    return NextResponse.json({
      success: true,
      data: null,
      message: "We couldn't find an immediate showtime for your liked movies today. How about exploring the Action genre or checking tomorrow's schedule?"
    }, { status: 200 });

  } catch (error) {
    console.error("Match Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process match" 
    }, { status: 500 });
  }
}
