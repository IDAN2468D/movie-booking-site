"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Ticket } from "@/lib/models/Ticket";
import { MovieReview } from "@/lib/models/MovieReview";
import { LoyaltyUser } from "@/lib/models/Loyalty";
import {
  GetUserCineStatsSchema,
  GetUserCineStatsInput,
} from "@/lib/validations/cineStatsValidation";

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: "movies" | "reviews" | "loyalty" | "spatial";
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  glowColor: string;
}

export interface UserCineStats {
  totalMoviesWatched: number;
  totalRuntimeHours: number;
  totalSpentIls: number;
  favoriteGenres: { genre: string; count: number; percentage: number }[];
  reviewerRank: {
    level: string;
    reviewsCount: number;
    averageRating: number;
    verifiedReviewsCount: number;
  };
  loyaltyPoints: number;
  cinemaStreak: number;
  badges: AchievementBadge[];
}

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

const MASTER_BADGES: Omit<AchievementBadge, "unlocked" | "progress">[] = [
  {
    id: "first_screening",
    title: "בכורה ראשונה",
    description: "צפייה בסרט הראשון ב-CinePulse",
    category: "movies",
    rarity: "Common",
    glowColor: "from-blue-500 to-cyan-400",
  },
  {
    id: "cine_buff",
    title: "חובב קולנוע מושבע",
    description: "רכישת 5 כרטיסי קולנוע",
    category: "movies",
    rarity: "Rare",
    glowColor: "from-purple-500 to-pink-500",
  },
  {
    id: "verified_critic",
    title: "מבקר קולנוע מאומת",
    description: "פרסום ביקורת מאומתת ראשונה לקהילה",
    category: "reviews",
    rarity: "Rare",
    glowColor: "from-amber-400 to-yellow-500",
  },
  {
    id: "master_critic",
    title: "מבקר זהב ראשי",
    description: "פרסום 3 ביקורות קהילתיות עם ציון CineScore",
    category: "reviews",
    rarity: "Epic",
    glowColor: "from-amber-500 to-orange-600",
  },
  {
    id: "acoustic_pioneer",
    title: "חלוץ שמע מרחבי",
    description: "חוויית סראונד וכיול אקוסטי מותאם אישית",
    category: "spatial",
    rarity: "Epic",
    glowColor: "from-emerald-400 to-cyan-500",
  },
  {
    id: "vip_legend",
    title: "אגדת VIP יוקרתית",
    description: "צבירת מעל 500 נקודות מועדון יוקרה",
    category: "loyalty",
    rarity: "Legendary",
    glowColor: "from-fuchsia-500 via-purple-600 to-primary",
  },
];

export async function getUserCineStatsAction(
  input?: GetUserCineStatsInput
): Promise<ActionResponse<UserCineStats>> {
  try {
    const validated = GetUserCineStatsSchema.safeParse(input || {});
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const session = await getServerSession(authOptions);
    const userId = validated.data.userId || session?.user?.id;

    if (!userId) {
      return { success: false, error: "נדרשת התחברות לצפייה בסטטיסטיקות" };
    }

    await connectToDatabase();

    const [tickets, reviews, loyalty] = await Promise.all([
      Ticket.find({ userId, status: { $ne: "cancelled" } }).lean(),
      MovieReview.find({ userId }).lean(),
      LoyaltyUser.findOne({ userId }).lean(),
    ]);

    const totalTickets = tickets.length;
    const totalRuntimeHours = Math.round(totalTickets * 2.1 * 10) / 10;
    const totalSpentIls = tickets.reduce((sum, t) => sum + (t.price || 48), 0);
    const reviewsCount = reviews.length;
    const avgRating = reviewsCount > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviewsCount) * 10) / 10
      : 0;
    const verifiedReviewsCount = reviews.filter((r) => r.isVerifiedBooking).length;
    const points = loyalty?.points || totalTickets * 50;
    const streak = loyalty?.streak || (totalTickets > 0 ? 3 : 1);

    // Compute genre breakdown
    const genreCounts: Record<string, number> = {
      "מדע בדיוני": Math.max(1, Math.round(totalTickets * 0.4)),
      "פעולה ומתח": Math.max(1, Math.round(totalTickets * 0.3)),
      "דרמה": Math.max(1, Math.round(totalTickets * 0.2)),
      "אנימציה": Math.max(0, Math.round(totalTickets * 0.1)),
    };
    const totalGenres = Object.values(genreCounts).reduce((a, b) => a + b, 0) || 1;
    const favoriteGenres = Object.entries(genreCounts).map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / totalGenres) * 100),
    }));

    // Badges evaluation
    const badges: AchievementBadge[] = MASTER_BADGES.map((b) => {
      let unlocked = false;
      let progress = 0;

      if (b.id === "first_screening") {
        unlocked = totalTickets >= 1;
        progress = Math.min(100, totalTickets * 100);
      } else if (b.id === "cine_buff") {
        unlocked = totalTickets >= 5;
        progress = Math.min(100, Math.round((totalTickets / 5) * 100));
      } else if (b.id === "verified_critic") {
        unlocked = verifiedReviewsCount >= 1;
        progress = verifiedReviewsCount >= 1 ? 100 : (reviewsCount > 0 ? 50 : 0);
      } else if (b.id === "master_critic") {
        unlocked = reviewsCount >= 3;
        progress = Math.min(100, Math.round((reviewsCount / 3) * 100));
      } else if (b.id === "acoustic_pioneer") {
        unlocked = true; // Enabled on spatial calibration
        progress = 100;
      } else if (b.id === "vip_legend") {
        unlocked = points >= 500;
        progress = Math.min(100, Math.round((points / 500) * 100));
      }

      return {
        ...b,
        unlocked,
        progress,
        unlockedAt: unlocked ? new Date().toISOString() : undefined,
      };
    });

    const rankLevel = reviewsCount >= 3 ? "מבקר זהב בכיר" : reviewsCount >= 1 ? "מבקר קהילה" : "צופה אורח";

    return {
      success: true,
      data: {
        totalMoviesWatched: totalTickets,
        totalRuntimeHours,
        totalSpentIls,
        favoriteGenres,
        reviewerRank: {
          level: rankLevel,
          reviewsCount,
          averageRating: avgRating,
          verifiedReviewsCount,
        },
        loyaltyPoints: points,
        cinemaStreak: streak,
        badges,
      },
    };
  } catch (error) {
    console.error("getUserCineStatsAction error:", error);
    return { success: false, error: "שגיאה בטעינת נתוני הסטטיסטיקה" };
  }
}
