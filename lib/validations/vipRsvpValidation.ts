import { z } from "zod";

export const CreateVipRsvpSchema = z.object({
  movieTitle: z.string().min(1, "שם הסרט נדרש").max(100),
  guestName: z.string().min(2, "שם מלא חייב להכיל לפחות 2 תווים").max(100),
  phoneNumber: z.string().min(9, "מספר טלפון לא תקין").max(20),
  seatsCount: z.number().int().min(1, "לפחות מושב 1").max(10).default(1),
  seatsList: z.array(z.string()).optional().default([]),
  notes: z.string().max(300).optional(),
});

export type CreateVipRsvpInput = z.infer<typeof CreateVipRsvpSchema>;
