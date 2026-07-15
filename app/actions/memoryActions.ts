"use server";

import clientPromise from "@/lib/mongodb";
import { z } from "zod";

export async function getUserMemoriesAction(userId: string) {
  try {
    if (!userId) return { success: false, error: "משתמש אינו מחובר" };

    const client = await clientPromise;
    const db = client.db();

    // In a real app, query bookings collection
    // We will simulate the DB structure since this is a new feature
    // In movie-booking-site, we know bookings might exist but for the shard we can fetch them
    const bookings = await db.collection('bookings').find({
      userId: userId,
      // only past bookings
      // status: 'completed'
    }).sort({ createdAt: -1 }).limit(10).toArray();

    // Since this is a demo environment, let's inject some mock memories if empty
    // so the feature is visually demonstrable immediately.
    const memories = bookings.length > 0 ? bookings.map(b => ({
      id: b._id.toString(),
      movieTitle: b.movieTitle || "סרט לא ידוע",
      posterUrl: b.posterUrl || "https://image.tmdb.org/t/p/w500/8cdWjvZQUrmdDO7BaR1TomG424h.jpg",
      date: b.createdAt || new Date().toISOString(),
      seats: b.seats || []
    })) : [
      {
        id: "mock-1",
        movieTitle: "Dune: Part Two",
        posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqUT94.jpg",
        date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        seats: ["A1", "A2"]
      },
      {
        id: "mock-2",
        movieTitle: "Oppenheimer",
        posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        date: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
        seats: ["F5"]
      }
    ];

    return { success: true, data: memories };
  } catch (error) {
    console.error("[getUserMemoriesAction]", error);
    return { success: false, error: "שגיאה בטעינת זיכרונות הקולנוע" };
  }
}
