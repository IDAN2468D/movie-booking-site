import { z } from "zod";

export const SwipePayloadSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  direction: z.enum(["left", "right"]),
  timestamp: z.number().int().positive(),
  sessionId: z.string().optional(),
});

export type SwipePayload = z.infer<typeof SwipePayloadSchema>;

export const MatchSessionRoomSchema = z.object({
  hostId: z.string().min(1, "Host ID is required"),
  participants: z.array(z.string()),
  activeMatches: z.array(z.string()).default([]),
  status: z.enum(["waiting", "active", "resolved"]).default("waiting"),
  resolvedMovieId: z.string().optional(),
});

export type MatchSessionRoom = z.infer<typeof MatchSessionRoomSchema>;
