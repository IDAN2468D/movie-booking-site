"use server";

import { VipAnalyticsSchema, VipAnalyticsInput } from "@/lib/validations/vipAnalytics";

export async function getVipAnalyticsAction(input: VipAnalyticsInput) {
  try {
    const validated = VipAnalyticsSchema.parse(input);
    const { userId, timeframe } = validated;

    // Simulated Native MongoDB Aggregation Pipeline output
    const genreAffinity = [
      { genre: 'Sci-Fi', score: 88, color: '#00D1FF' },
      { genre: 'Action', score: 74, color: '#8A5CFF' },
      { genre: 'Drama', score: 52, color: '#00FFA3' },
      { genre: 'Thriller', score: 45, color: '#FF2E5B' },
    ];

    const monthlyActivity = [
      { month: 'ינואר', tickets: 4, pointsEarned: 400 },
      { month: 'פברואר', tickets: 6, pointsEarned: 650 },
      { month: 'מרץ', tickets: 3, pointsEarned: 300 },
      { month: 'אפריל', tickets: 8, pointsEarned: 950 },
    ];

    return {
      success: true,
      data: {
        userId,
        timeframe,
        vipTier: 'Vanguard Platinum 💎',
        totalMoviesWatched: 21,
        totalPulsePoints: 2300,
        genreAffinity,
        monthlyActivity,
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.issues?.[0]?.message || error.message };
    }
    return { success: false, error: "שגיאה בטעינת הנתונים האנליטיים" };
  }
}
