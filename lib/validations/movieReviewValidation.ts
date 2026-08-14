import { z } from "zod";

export const CreateMovieReviewSchema = z.object({
  movieId: z.string().min(1, "מזהה סרט נדרש"),
  rating: z.number().int().min(1, "דירוג מינימלי הוא 1").max(10, "דירוג מקסימלי הוא 10"),
  content: z.string().min(5, "ביקורת חייבת להכיל לפחות 5 תווים").max(2000, "ביקורת ארוכה מדי"),
  authorName: z.string().max(50, "שם ארוך מדי").optional(),
  guestId: z.string().max(100).optional(),
  tags: z.array(z.string()).optional().default([]),
  hasSpoilers: z.boolean().optional().default(false),
});

export const ToggleReviewLikeSchema = z.object({
  reviewId: z.string().min(1, "מזהה ביקורת נדרש"),
  guestId: z.string().max(100).optional(),
});

export const GetMovieReviewsSchema = z.object({
  movieId: z.string().min(1, "מזהה סרט נדרש"),
  sortBy: z.enum(["helpful", "latest", "highest", "verified"]).optional().default("helpful"),
});

export type CreateMovieReviewInput = z.infer<typeof CreateMovieReviewSchema>;
export type ToggleReviewLikeInput = z.infer<typeof ToggleReviewLikeSchema>;
export type GetMovieReviewsInput = z.infer<typeof GetMovieReviewsSchema>;
