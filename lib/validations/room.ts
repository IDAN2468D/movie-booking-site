import { z } from 'zod';

export const RoomSchema = z.object({
  roomCode: z.string().length(6, "Room code must be exactly 6 characters"),
  participants: z.array(z.string()).default([]),
  likedMovies: z.array(
    z.object({
      movieId: z.string(),
      userId: z.string(),
    })
  ).default([]),
  status: z.enum(['active', 'matched', 'closed']).default('active'),
  matchedMovieId: z.string().optional(),
  createdAt: z.date().optional(),
});

export const JoinRoomSchema = z.object({
  roomCode: z.string().length(6, "Room code must be exactly 6 characters"),
  userId: z.string().min(1, "User ID is required"),
});

export const SwipeSchema = z.object({
  roomCode: z.string().length(6, "Room code must be exactly 6 characters"),
  userId: z.string().min(1, "User ID is required"),
  movieId: z.string().min(1, "Movie ID is required"),
  action: z.enum(['like', 'pass']),
});
