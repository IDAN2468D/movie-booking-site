"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { UserRating } from "@/lib/models/UserRating";
import { LoyaltyUser } from "@/lib/models/Loyalty";
import {
  RatingSubmitSchema,
  RatingSubmitInput,
  RatingQuerySchema,
} from "@/lib/validations/ratingValidation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

const POINTS_PER_RATING = 25;
const BONUS_FIVE_STAR = 50;

export async function submitRatingAction(
  input: RatingSubmitInput
): Promise<ActionResponse> {
  try {
    const validated = RatingSubmitSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { userId, movieId, rating, mood } = validated.data;
    await connectToDatabase();

    const pointsAwarded =
      POINTS_PER_RATING + (rating === 5 ? BONUS_FIVE_STAR : 0);

    // Atomic upsert — one rating per user per movie
    await UserRating.findOneAndUpdate(
      { userId, movieId },
      { $set: { rating, mood, pointsAwarded } },
      { upsert: true, new: true }
    );

    // Award loyalty points atomically
    await LoyaltyUser.findOneAndUpdate(
      { userId },
      { $inc: { points: pointsAwarded } },
      { upsert: true }
    );

    return {
      success: true,
      data: { rating, pointsAwarded },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("submitRatingAction error:", error);
    return { success: false, error: "שגיאה בשמירת הדירוג" };
  }
}

export async function getUserRatingAction(
  userId: string,
  movieId: string
): Promise<ActionResponse> {
  try {
    const validated = RatingQuerySchema.safeParse({ userId, movieId });
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    await connectToDatabase();
    const existing = await UserRating.findOne({ userId, movieId }).lean();

    if (!existing) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        rating: existing.rating,
        mood: existing.mood,
        pointsAwarded: existing.pointsAwarded,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("getUserRatingAction error:", error);
    return { success: false, error: "שגיאה בטעינת הדירוג" };
  }
}
