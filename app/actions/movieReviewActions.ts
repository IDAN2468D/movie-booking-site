"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { MovieReview } from "@/lib/models/MovieReview";
import { Ticket } from "@/lib/models/Ticket";
import {
  CreateMovieReviewSchema,
  CreateMovieReviewInput,
  ToggleReviewLikeSchema,
  ToggleReviewLikeInput,
  GetMovieReviewsSchema,
  GetMovieReviewsInput,
} from "@/lib/validations/movieReviewValidation";

export interface MappedReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  tags?: string[];
  hasSpoilers: boolean;
  isVerifiedBooking: boolean;
  likesCount: number;
  likedBy: string[];
  createdAt: Date;
}

export interface CineScoreData {
  score: number;
  percentage: number;
  totalReviews: number;
  verifiedReviewsCount: number;
  distribution: { [key: number]: number };
}

export interface GetMovieReviewsResult {
  reviews: MappedReview[];
  cineScore: CineScoreData;
}

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function submitMovieReviewAction(
  input: CreateMovieReviewInput
): Promise<ActionResponse<{ id: string; rating: number; content: string; isVerifiedBooking: boolean }>> {
  try {
    const validated = CreateMovieReviewSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { movieId, rating, content, hasSpoilers, tags, authorName, guestId } = validated.data;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || guestId || `guest_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const userName = session?.user?.name || authorName?.trim() || "חובב קולנוע CinePulse";
    const userAvatar = session?.user?.image || "";

    await connectToDatabase();

    let isVerifiedBooking = false;
    if (session?.user?.id) {
      const hasTicket = await Ticket.exists({
        userId: session.user.id,
        status: { $ne: "cancelled" },
      });
      isVerifiedBooking = Boolean(hasTicket);
    }

    const doc = await MovieReview.findOneAndUpdate(
      { movieId, userId },
      {
        $set: {
          userName,
          userAvatar,
          rating,
          content,
          tags: tags || [],
          hasSpoilers: Boolean(hasSpoilers),
          isVerifiedBooking,
        },
      },
      { upsert: true, new: true }
    );

    return {
      success: true,
      data: {
        id: doc._id.toString(),
        rating: doc.rating,
        content: doc.content,
        isVerifiedBooking: doc.isVerifiedBooking,
      },
    };
  } catch (error) {
    console.error("submitMovieReviewAction error:", error);
    return { success: false, error: "שגיאה בפרסום הביקורת" };
  }
}

export async function getMovieReviewsAction(
  input: GetMovieReviewsInput
): Promise<ActionResponse<GetMovieReviewsResult>> {
  try {
    const validated = GetMovieReviewsSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { movieId, sortBy } = validated.data;
    await connectToDatabase();

    let sortQuery: Record<string, 1 | -1> = { likesCount: -1, createdAt: -1 };
    if (sortBy === "latest") sortQuery = { createdAt: -1 };
    else if (sortBy === "highest") sortQuery = { rating: -1, createdAt: -1 };
    else if (sortBy === "verified") sortQuery = { isVerifiedBooking: -1, likesCount: -1 };

    const reviews = await MovieReview.find({ movieId }).sort(sortQuery).lean();

    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };
    let positiveCount = 0;

    const mapped: MappedReview[] = reviews.map((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      if (r.rating >= 7) positiveCount++;

      return {
        id: r._id.toString(),
        userId: r.userId,
        userName: r.userName,
        userAvatar: r.userAvatar,
        rating: r.rating,
        content: r.content,
        tags: r.tags || [],
        hasSpoilers: r.hasSpoilers,
        isVerifiedBooking: r.isVerifiedBooking,
        likesCount: r.likesCount,
        likedBy: r.likedBy || [],
        createdAt: r.createdAt,
      };
    });

    const total = mapped.length;
    const avgRating = total > 0 ? mapped.reduce((acc, r) => acc + r.rating, 0) / total : 0;
    const percentage = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
    const verifiedCount = mapped.filter((r) => r.isVerifiedBooking).length;

    return {
      success: true,
      data: {
        reviews: mapped,
        cineScore: {
          score: Number(avgRating.toFixed(1)),
          percentage,
          totalReviews: total,
          verifiedReviewsCount: verifiedCount,
          distribution,
        },
      },
    };
  } catch (error) {
    console.error("getMovieReviewsAction error:", error);
    return { success: false, error: "שגיאה בטעינת הביקורות" };
  }
}

export async function toggleReviewLikeAction(
  input: ToggleReviewLikeInput
): Promise<ActionResponse<{ reviewId: string; likesCount: number; isLiked: boolean }>> {
  try {
    const validated = ToggleReviewLikeSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { reviewId, guestId } = validated.data;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || guestId || "guest_voter";

    await connectToDatabase();
    const review = await MovieReview.findById(reviewId);
    if (!review) return { success: false, error: "ביקורת לא נמצאה" };

    const userIdx = review.likedBy.indexOf(userId);
    let isLiked = false;

    if (userIdx > -1) {
      review.likedBy.splice(userIdx, 1);
      review.likesCount = Math.max(0, review.likesCount - 1);
      isLiked = false;
    } else {
      review.likedBy.push(userId);
      review.likesCount += 1;
      isLiked = true;
    }

    await review.save();

    return {
      success: true,
      data: { reviewId, likesCount: review.likesCount, isLiked },
    };
  } catch (error) {
    console.error("toggleReviewLikeAction error:", error);
    return { success: false, error: "שגיאה בעדכון ההצבעה" };
  }
}
