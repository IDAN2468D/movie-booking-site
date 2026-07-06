import { z } from 'zod';

export const SeatLockSchema = z.object({
  showtimeId: z.string().min(1, "Showtime ID is required"),
  seatId: z.string().min(1, "Seat ID is required"),
  userId: z.string().min(1, "User ID is required"),
});
