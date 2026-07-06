"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { MovieHub } from "@/lib/models/MovieHub";
import { movieActionSchema } from "@/lib/validations/landing";

export async function toggleBookmarkAction(userId: string, movieId: string) {
  try {
    const validated = movieActionSchema.safeParse({ userId, movieId });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    await connectToDatabase();

    const hub = await MovieHub.findOne({ userId });
    
    if (hub && hub.bookmarkedMovies.includes(movieId)) {
      await MovieHub.findOneAndUpdate(
        { userId },
        { $pull: { bookmarkedMovies: movieId } }
      );
      return { success: true, isBookmarked: false };
    } else {
      await MovieHub.findOneAndUpdate(
        { userId },
        { $addToSet: { bookmarkedMovies: movieId } },
        { upsert: true, new: true }
      );
      return { success: true, isBookmarked: true };
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("toggleBookmarkAction error:", error);
    return { success: false, error: "שגיאה בשרת, אנא נסה שנית" };
  }
}

export async function logMovieViewAction(userId: string, movieId: string) {
  try {
    const validated = movieActionSchema.safeParse({ userId, movieId });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    await connectToDatabase();

    await MovieHub.findOneAndUpdate(
      { userId },
      { $addToSet: { watchHistory: movieId } },
      { upsert: true, new: true }
    );

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("logMovieViewAction error:", error);
    return { success: false, error: "שגיאה בשרת, אנא נסה שנית" };
  }
}

export async function getHubDataAction(userId: string) {
  try {
    if (!userId) return { success: false, error: "אנא התחבר" };

    await connectToDatabase();
    
    // We parse and stringify to ensure the object is plain for Server Actions boundaries
    const hub = await MovieHub.findOne({ userId }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(hub)) };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return { success: false, error: "שגיאה בשליפת נתונים" };
  }
}
