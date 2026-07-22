import { z } from "zod";

export const SquadMemberSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  avatar: z.string().optional(),
  selectedSeat: z.string().optional(),
  votedMovieId: z.number().optional(),
  isHost: z.boolean().default(false),
  paidStatus: z.boolean().default(false),
});

export const SquadPodSessionSchema = z.object({
  podId: z.string().min(1),
  title: z.string().min(1),
  movieId: z.number(),
  showtime: z.string(),
  members: z.array(SquadMemberSchema),
  totalSeats: z.number().positive(),
  status: z.enum(["voting", "selecting_seats", "checkout_ready", "completed"]),
});

export type SquadMember = z.infer<typeof SquadMemberSchema>;
export type SquadPodSession = z.infer<typeof SquadPodSessionSchema>;
