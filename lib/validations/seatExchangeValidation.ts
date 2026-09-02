import { z } from "zod";

export const createSeatExchangeSchema = z.object({
  showtimeId: z.string().min(1, "מזהה הקרנה חובה"),
  movieId: z.string().min(1, "מזהה סרט חובה"),
  movieTitle: z.string().min(1, "שם הסרט חובה"),
  ticketId: z.string().min(1, "מזהה כרטיס חובה"),
  requesterUserId: z.string().min(1, "מזהה משתמש חובה"),
  requesterName: z.string().min(1, "שם משתמש חובה"),
  requesterAvatar: z.string().optional(),
  currentSeatId: z.string().min(1, "יש לציין את המושב הנוכחי"),
  desiredTiers: z.array(z.string()).min(1, "יש לבחור לפחות דרגת מושב אחת"),
  desiredRow: z.string().optional(),
  bidDiffPrice: z.number().min(0, "הפרש מחיר לא יכול להיות שלילי").default(0),
});

export const acceptSeatExchangeSchema = z.object({
  requestId: z.string().min(1, "מזהה בקשה חובה"),
  acceptorUserId: z.string().min(1, "מזהה משתמש מקבל חובה"),
  acceptorName: z.string().min(1, "שם משתמש מקבל חובה"),
  acceptorTicketId: z.string().min(1, "מזהה כרטיס מקבל חובה"),
  acceptorSeatId: z.string().min(1, "מזהה מושב מקבל חובה"),
});

export const cancelSeatExchangeSchema = z.object({
  requestId: z.string().min(1, "מזהה בקשה חובה"),
  userId: z.string().min(1, "מזהה משתמש חובה"),
});

export type CreateSeatExchangeInput = z.infer<typeof createSeatExchangeSchema>;
export type AcceptSeatExchangeInput = z.infer<typeof acceptSeatExchangeSchema>;
