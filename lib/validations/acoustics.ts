import { z } from 'zod';

export const SeatAcousticProfileSchema = z.object({
  seatId: z.string().min(1, "מזהה המושב אינו תקין"),
  x: z.number().min(-1, "קואורדינטת X אינה תקינה").max(1),
  y: z.number().min(-1, "קואורדינטת Y אינה תקינה").max(1)
});

export type SeatAcousticProfileInput = z.infer<typeof SeatAcousticProfileSchema>;
