import { z } from "zod";

export const updateExternalSyncSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש חובה"),
  platform: z.enum(["trakt", "letterboxd"]),
  connected: z.boolean(),
  username: z.string().optional(),
  autoScrobbleOnTicketScan: z.boolean().optional(),
  syncRatings: z.boolean().optional(),
  letterboxdExportEnabled: z.boolean().optional(),
});

export const scrobbleTicketScanSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש חובה"),
  movieId: z.string().min(1, "מזהה סרט חובה"),
  movieTitle: z.string().min(1, "שם הסרט חובה"),
  bookingReference: z.string().optional(),
});

export const importWatchlistSchema = z.object({
  userId: z.string().min(1, "מזהה משתמש חובה"),
  platform: z.enum(["trakt", "letterboxd"]),
});

export type UpdateExternalSyncInput = z.infer<typeof updateExternalSyncSchema>;
export type ScrobbleTicketScanInput = z.infer<typeof scrobbleTicketScanSchema>;
