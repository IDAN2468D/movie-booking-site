import { z } from "zod";

export const SquadPaymentStatusEnum = z.enum([
  "pending",
  "authorized",
  "completed",
  "failed",
]);

export const SquadRoomStatusEnum = z.enum([
  "lobby",
  "seats_selected",
  "payment_pending",
  "confirmed",
]);

export const SquadMemberSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  avatarUrl: z.string().optional(),
  selectedSeat: z.string().nullable(),
  isHost: z.boolean().default(false),
  paymentStatus: SquadPaymentStatusEnum,
  ticketAmount: z.number().nonnegative(),
  concessionAmount: z.number().nonnegative().default(0),
  shareAmount: z.number().nonnegative(),
});

export const SquadRoomSchema = z.object({
  roomId: z.string(),
  hostUserId: z.string(),
  movieId: z.string(),
  movieTitle: z.string(),
  showtimeId: z.string(),
  showtimeLabel: z.string(),
  hallName: z.string(),
  ticketUnitPrice: z.number().positive().default(45),
  members: z.array(SquadMemberSchema),
  splitMode: z.enum(["equal", "custom", "itemized"]).default("equal"),
  expiresAt: z.string(),
  status: SquadRoomStatusEnum,
});

export const CreateSquadRoomInputSchema = z.object({
  hostUserId: z.string(),
  hostName: z.string(),
  movieId: z.string(),
  movieTitle: z.string(),
  showtimeId: z.string(),
  showtimeLabel: z.string(),
  hallName: z.string().default("אולם אקוסטי VIP 1"),
});

export const JoinSquadRoomInputSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional(),
});

export const ClaimSquadSeatInputSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  seatId: z.string().nullable(),
});

export type SquadPaymentStatus = z.infer<typeof SquadPaymentStatusEnum>;
export type SquadRoomStatus = z.infer<typeof SquadRoomStatusEnum>;
export type SquadMember = z.infer<typeof SquadMemberSchema>;
export type SquadRoom = z.infer<typeof SquadRoomSchema>;
