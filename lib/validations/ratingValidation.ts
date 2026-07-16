import { z } from "zod";

// ── Rating Submission Schema ──
export const RatingSubmitSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש חסר"),
  movieId: z.string().min(1, "מזהה סרט חסר"),
  rating: z
    .number()
    .int("הדירוג חייב להיות מספר שלם")
    .min(1, "דירוג מינימלי הוא 1")
    .max(5, "דירוג מקסימלי הוא 5"),
  mood: z
    .string()
    .max(50, "מצב רוח לא יכול לחרוג מ-50 תווים")
    .optional(),
});

export type RatingSubmitInput = z.infer<typeof RatingSubmitSchema>;

// ── Rating Query Schema ──
export const RatingQuerySchema = z.object({
  userId: z.string().min(1, "מזהה משתמש חסר"),
  movieId: z.string().min(1, "מזהה סרט חסר"),
});

export type RatingQueryInput = z.infer<typeof RatingQuerySchema>;

// ── Rating Response Schema ──
export const RatingResponseSchema = z.object({
  rating: z.number().min(1).max(5),
  mood: z.string().optional(),
  pointsAwarded: z.number(),
  createdAt: z.string().optional(),
});

export type RatingResponse = z.infer<typeof RatingResponseSchema>;
