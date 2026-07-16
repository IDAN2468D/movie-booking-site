import { z } from "zod";

// ── Monthly Breakdown Item ──
const MonthlyStatSchema = z.object({
  month: z.string(),
  count: z.number(),
});

// ── Mood Journey Item ──
const MoodEntrySchema = z.object({
  mood: z.string(),
  count: z.number(),
  percentage: z.number(),
});

// ── Cinema Wrapped Response Schema ──
export const WrappedDataSchema = z.object({
  totalMovies: z.number(),
  favoriteGenre: z.string(),
  topActor: z.string(),
  peakHour: z.string(),
  totalSpend: z.number(),
  avgRating: z.number(),
  moodJourney: z.array(MoodEntrySchema),
  monthlyBreakdown: z.array(MonthlyStatSchema),
});

export type WrappedData = z.infer<typeof WrappedDataSchema>;

// ── Wrapped Request Schema ──
export const WrappedRequestSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש חסר"),
});

export type WrappedRequest = z.infer<typeof WrappedRequestSchema>;
