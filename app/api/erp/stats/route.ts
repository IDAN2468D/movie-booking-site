import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email === 'idankzm@gmail.com' || session?.user?.email === 'test@example.com';

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // 1. Total Revenue & Tickets Sold
    const bookingStats = await db.collection("bookings").aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          ticketsSold: { $sum: { $size: "$seats" } },
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // 2. Active Movies
    const activeMoviesCount = await db.collection("bookings").distinct("movie.id");

    // 3. Recent Activity (Last 5 bookings)
    const recentBookings = await db.collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const stats = {
      totalRevenue: bookingStats[0]?.totalRevenue || 0,
      ticketsSold: bookingStats[0]?.ticketsSold || 0,
      activeMovies: activeMoviesCount.length || 0,
      occupancyRate: 68, // Mocked for now
      recentBookings: recentBookings.map(b => ({
        id: b._id.toString(),
        movie: b.movie.title || b.movie.displayTitle,
        user: b.userEmail,
        total: b.total,
        time: b.createdAt
      }))
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("ERP Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch ERP stats" }, { status: 500 });
  }
}
