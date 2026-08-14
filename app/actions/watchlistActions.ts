"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { Watchlist } from "@/lib/models/Watchlist";
import {
  AddToWatchlistSchema,
  AddToWatchlistInput,
  RemoveFromWatchlistSchema,
  RemoveFromWatchlistInput,
  SyncWatchlistSchema,
  SyncWatchlistInput,
} from "@/lib/validations/watchlistValidation";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function addToWatchlistAction(
  input: AddToWatchlistInput
): Promise<ActionResponse> {
  try {
    const validated = AddToWatchlistSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { userId, item } = validated.data;
    await connectToDatabase();

    const doc = await Watchlist.findOneAndUpdate(
      { userId, movieId: item.movieId },
      {
        $set: {
          title: item.title,
          posterPath: item.posterPath,
          releaseDate: item.releaseDate,
          voteAverage: item.voteAverage,
          genres: item.genres,
          notifyOnRelease: item.notifyOnRelease,
          addedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return {
      success: true,
      data: {
        id: doc._id.toString(),
        movieId: doc.movieId,
        title: doc.title,
      },
    };
  } catch (error) {
    console.error("addToWatchlistAction error:", error);
    return { success: false, error: "שגיאה בהוספת הסרט לרשימת הצפייה" };
  }
}

export async function removeFromWatchlistAction(
  input: RemoveFromWatchlistInput
): Promise<ActionResponse> {
  try {
    const validated = RemoveFromWatchlistSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { userId, movieId } = validated.data;
    await connectToDatabase();

    await Watchlist.deleteOne({ userId, movieId });

    return { success: true, data: { movieId } };
  } catch (error) {
    console.error("removeFromWatchlistAction error:", error);
    return { success: false, error: "שגיאה בהסרת הסרט מרשימת הצפייה" };
  }
}

export async function getUserWatchlistAction(
  userId: string
): Promise<ActionResponse> {
  try {
    if (!userId || typeof userId !== "string") {
      return { success: false, error: "מזהה משתמש לא תקין" };
    }

    await connectToDatabase();
    const items = await Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .lean();

    const mapped = items.map((i) => ({
      id: i._id.toString(),
      movieId: i.movieId,
      title: i.title,
      posterPath: i.posterPath,
      releaseDate: i.releaseDate,
      voteAverage: i.voteAverage,
      genres: i.genres || [],
      notifyOnRelease: i.notifyOnRelease,
      addedAt: i.addedAt,
    }));

    return { success: true, data: mapped };
  } catch (error) {
    console.error("getUserWatchlistAction error:", error);
    return { success: false, error: "שגיאה בטעינת רשימת הצפייה" };
  }
}

export async function syncUserWatchlistAction(
  input: SyncWatchlistInput
): Promise<ActionResponse> {
  try {
    const validated = SyncWatchlistSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { userId, items } = validated.data;
    await connectToDatabase();

    const ops = items.map((item) => ({
      updateOne: {
        filter: { userId, movieId: item.movieId },
        update: {
          $set: {
            title: item.title,
            posterPath: item.posterPath,
            releaseDate: item.releaseDate,
            voteAverage: item.voteAverage,
            genres: item.genres,
            notifyOnRelease: item.notifyOnRelease,
          },
          $setOnInsert: { addedAt: new Date() },
        },
        upsert: true,
      },
    }));

    if (ops.length > 0) {
      await Watchlist.bulkWrite(ops);
    }

    return getUserWatchlistAction(userId);
  } catch (error) {
    console.error("syncUserWatchlistAction error:", error);
    return { success: false, error: "שגיאה בסנכרון רשימת הצפייה" };
  }
}
