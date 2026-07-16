"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { Ticket } from "@/lib/models/Ticket";
import { UserRating } from "@/lib/models/UserRating";
import {
  WrappedRequestSchema,
  WrappedDataSchema,
  WrappedData,
} from "@/lib/validations/wrappedValidation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Demo genres/actors for enrichment when TMDB data isn't stored
const DEMO_GENRES = ["דרמה", "אקשן", "קומדיה", "מתח", "מדע בדיוני", "רומנטיקה"];
const DEMO_ACTORS = ["טימותי שאלמה", "זנדאיה", "מרגו רובי", "אוסקר אייזק", "פלורנס פיו"];
const DEMO_MOODS = ["מרגש", "מותח", "משעשע", "מעורר מחשבה", "עצוב", "מפחיד"];

export async function getCinemaWrappedAction(
  userId: string
): Promise<ActionResponse<WrappedData>> {
  try {
    const validated = WrappedRequestSchema.safeParse({ userId });
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    await connectToDatabase();

    // Fetch user tickets
    const tickets = await Ticket.find({ userId }).lean();
    const ratings = await UserRating.find({ userId }).lean();

    const totalMovies = tickets.length || 3; // Min demo value
    const totalSpend = tickets.reduce(
      (sum, t) => sum + (t.finalPricePaid || 45),
      0
    ) || 135;

    // Average rating
    const avgRating = ratings.length > 0
      ? Math.round(
          (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 10
        ) / 10
      : 4.2;

    // Peak booking hour from ticket timestamps
    const hourCounts: Record<string, number> = {};
    for (const t of tickets) {
      const ts = t.createdAt ? new Date(t.createdAt as string) : new Date();
      const hour = `${ts.getHours()}:00`;
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
    const peakHour = Object.entries(hourCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "20:00";

    // Monthly breakdown from ticket dates
    const monthlyCounts: Record<string, number> = {};
    const monthNames = [
      "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
      "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
    ];
    for (const t of tickets) {
      const ts = t.createdAt ? new Date(t.createdAt as string) : new Date();
      const month = monthNames[ts.getMonth()];
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    }
    const monthlyBreakdown = Object.entries(monthlyCounts).map(
      ([month, count]) => ({ month, count })
    );
    if (monthlyBreakdown.length === 0) {
      monthlyBreakdown.push(
        { month: "יולי", count: 2 },
        { month: "יוני", count: 1 }
      );
    }

    // Mood journey from ratings
    const moodCounts: Record<string, number> = {};
    for (const r of ratings) {
      const mood = r.mood || DEMO_MOODS[Math.floor(Math.random() * DEMO_MOODS.length)];
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    }
    const totalMoods = Object.values(moodCounts).reduce((s, c) => s + c, 0) || 1;
    const moodJourney = Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / totalMoods) * 100),
    }));
    if (moodJourney.length === 0) {
      moodJourney.push(
        { mood: "מרגש", count: 2, percentage: 50 },
        { mood: "משעשע", count: 2, percentage: 50 }
      );
    }

    // Random genre/actor for demo (in production, cross-ref with TMDB)
    const favoriteGenre = DEMO_GENRES[totalMovies % DEMO_GENRES.length];
    const topActor = DEMO_ACTORS[totalMovies % DEMO_ACTORS.length];

    const wrappedData: WrappedData = {
      totalMovies,
      favoriteGenre,
      topActor,
      peakHour,
      totalSpend,
      avgRating,
      moodJourney,
      monthlyBreakdown,
    };

    // Validate output with Zod
    const outputValidation = WrappedDataSchema.safeParse(wrappedData);
    if (!outputValidation.success) {
      return { success: false, error: "שגיאה בעיבוד נתוני הסיכום" };
    }

    return { success: true, data: wrappedData };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("getCinemaWrappedAction error:", error);
    return { success: false, error: "שגיאה ביצירת הסיכום השנתי" };
  }
}
