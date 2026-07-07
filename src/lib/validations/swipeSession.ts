import { z } from 'zod';
import { Types } from 'mongoose';

// Helper to validate MongoDB ObjectId
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const swipeSchema = z.object({
  userId: objectIdSchema,
  movieId: objectIdSchema,
  direction: z.enum(['like', 'dislike']),
  timestamp: z.date().default(() => new Date()),
});

export const catalogFiltersSchema = z.object({
  genres: z.array(z.string()).optional(),
  date: z.date().optional(),
});

export const swipeSessionSchema = z.object({
  sessionId: z.string().length(6).regex(/^[a-zA-Z0-9]{6}$/, 'Session ID must be 6 alphanumeric characters'),
  hostUserId: objectIdSchema,
  participants: z.array(objectIdSchema),
  sessionStatus: z.enum(['active', 'matched', 'expired']).default('active'),
  catalogFilters: catalogFiltersSchema.optional(),
  swipes: z.array(swipeSchema).default([]),
  matchedMovieId: objectIdSchema.nullable().optional(),
});

export type SwipeSessionType = z.infer<typeof swipeSessionSchema>;
export type SwipeType = z.infer<typeof swipeSchema>;
