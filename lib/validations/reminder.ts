import { z } from 'zod';

export const MovieReminderSchema = z.object({
  movieId: z.number(),
  movieTitle: z.string().min(1),
  email: z.string().email('כתובת אימייל לא תקינה'),
  releaseDate: z.string().optional(),
});

export type MovieReminderInput = z.infer<typeof MovieReminderSchema>;

export const ActiveReminderSchema = z.object({
  movieId: z.number(),
  movieTitle: z.string(),
  email: z.string(),
  createdAt: z.string(),
});

export type ActiveReminder = z.infer<typeof ActiveReminderSchema>;
