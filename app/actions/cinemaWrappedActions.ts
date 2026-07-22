"use server";

export interface CinemaWrappedData {
  year: number;
  totalMoviesWatched: number;
  totalCinemaHours: number;
  topGenre: string;
  favoriteVibe: string;
  vipLevel: string;
  badgeUnlocked: string;
}

export async function getCinemaWrappedAction(): Promise<{ success: boolean; data?: CinemaWrappedData; error?: string }> {
  try {
    const mockWrapped: CinemaWrappedData = {
      year: 2026,
      totalMoviesWatched: 18,
      totalCinemaHours: 37,
      topGenre: "סייברפאנק ומד\"ב קולנועי",
      favoriteVibe: "אדרנלין ועומק ויזואלי",
      vipLevel: "Vanguard Titan VIP",
      badgeUnlocked: "👑 מאסטר האולמות 2026",
    };

    return { success: true, data: mockWrapped };
  } catch (error: any) {
    console.error("getCinemaWrappedAction error:", error);
    return { success: false, error: "שגיאה בטעינת סיכום השנה הקולנועי" };
  }
}
