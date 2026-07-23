import { z } from 'zod';

export const CoopSessionSchema = z.object({
  sessionId: z.string().min(1),
  player1: z.string().min(1),
  player2: z.string().min(1),
  status: z.enum(['waiting', 'active', 'matched', 'completed']).default('active'),
  matchedMovieId: z.string().optional(),
});

export type CoopSession = z.infer<typeof CoopSessionSchema>;

export const CoopVoteSchema = z.object({
  sessionId: z.string().min(1),
  playerId: z.string().min(1),
  movieId: z.string().min(1),
  movieTitle: z.string().min(1),
  posterPath: z.string().optional(),
  vote: z.enum(['like', 'dislike']),
});

export type CoopVote = z.infer<typeof CoopVoteSchema>;

export const CoopMatchResultSchema = z.object({
  isMatch: z.boolean(),
  matchedMovieId: z.string().optional(),
  matchedMovieTitle: z.string().optional(),
  matchedPosterPath: z.string().optional(),
});

export type CoopMatchResult = z.infer<typeof CoopMatchResultSchema>;
