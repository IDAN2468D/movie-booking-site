import { z } from 'zod';

export const lockRouletteSeatSchema = z.object({
  showtimeId: z.string().min(1, "מזהה ההקרנה אינו תקין"),
  seatId: z.string().min(1, "מזהה המושב אינו תקין"),
  userId: z.string().min(1, "מזהה המשתמש אינו תקין"),
});

export const lockRouletteSeatOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  lockId: z.string().optional(),
  error: z.string().optional(),
});

export type LockRouletteSeatInput = z.infer<typeof lockRouletteSeatSchema>;
export type LockRouletteSeatOutput = z.infer<typeof lockRouletteSeatOutputSchema>;
