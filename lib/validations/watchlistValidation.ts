import { z } from "zod";

export const WatchlistItemSchema = z.object({
  movieId: z.string().min(1, "מזהה סרט נדרש"),
  title: z.string().min(1, "שם הסרט נדרש"),
  posterPath: z.string().min(1, "נתיב פוסטר נדרש"),
  releaseDate: z.string().optional().default(""),
  voteAverage: z.number().min(0).max(10).optional().default(0),
  genres: z.array(z.string()).optional().default([]),
  notifyOnRelease: z.boolean().optional().default(false),
});

export const AddToWatchlistSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש נדרש"),
  item: WatchlistItemSchema,
});

export const RemoveFromWatchlistSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש נדרש"),
  movieId: z.string().min(1, "מזהה סרט נדרש"),
});

export const SyncWatchlistSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש נדרש"),
  items: z.array(WatchlistItemSchema),
});

export type WatchlistItemInput = z.infer<typeof WatchlistItemSchema>;
export type AddToWatchlistInput = z.infer<typeof AddToWatchlistSchema>;
export type RemoveFromWatchlistInput = z.infer<typeof RemoveFromWatchlistSchema>;
export type SyncWatchlistInput = z.infer<typeof SyncWatchlistSchema>;
