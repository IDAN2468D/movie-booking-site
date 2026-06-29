import { z } from 'zod';

export const seatActionSchema = z.object({
  showtimeId: z.string().min(1, "מזהה המושב או קואורדינטת השורה אינם תקינים"),
  seatId: z.string().min(1, "מזהה המושב או קואורדינטת השורה אינם תקינים"),
  userId: z.string().min(1, "מזהה המשתמש אינו תקין")
});

export type SeatActionInput = z.infer<typeof seatActionSchema>;

// Note: the concurrency clash error "מושב זה נתפס על ידי משתמש אחר, אנא בחר מושב חלופי"
// will be returned by the server action if the atomic update fails to lock the seat.
