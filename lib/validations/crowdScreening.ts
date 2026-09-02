import { z } from "zod";

export const createCrowdCampaignSchema = z.object({
  movieId: z.string().min(1, "יש לבחור סרט"),
  movieTitle: z.string().min(1, "כותרת הסרט חובה"),
  moviePoster: z.string().min(1, "כרזת הסרט חובה"),
  movieBackdrop: z.string().optional(),
  genre: z.string().default("קולנוע"),
  durationMinutes: z.number().int().positive().default(120),
  branchId: z.string().min(1, "יש לבחור סניף קולנוע"),
  branchName: z.string().min(1, "שם הסניף חובה"),
  targetDate: z.string().or(z.date()),
  minThreshold: z.number().int().min(10, "סף מינימום חייב להיות לפחות 10 משתתפים").max(500).default(50),
  ticketPrice: z.number().positive("מחיר כרטיס חייב להיות חיובי").default(45),
  creatorUserId: z.string().min(1, "מזהה יוצר חובה"),
  creatorName: z.string().min(1, "שם יוצר חובה"),
});

export const pledgeCrowdCampaignSchema = z.object({
  campaignId: z.string().min(1, "מזהה קמפיין חובה"),
  userId: z.string().min(1, "מזהה משתמש חובה"),
  userName: z.string().min(1, "שם משתמש חובה"),
  userAvatar: z.string().optional(),
  seatsCount: z.number().int().min(1, "יש לבחור לפחות מושב 1").max(10, "מקסימום 10 מושבים לתומך"),
  paymentIntentId: z.string().default("hold_auth_mock"),
});

export const checkCampaignThresholdSchema = z.object({
  campaignId: z.string().min(1, "מזהה קמפיין חובה"),
});

export type CreateCrowdCampaignInput = z.infer<typeof createCrowdCampaignSchema>;
export type PledgeCrowdCampaignInput = z.infer<typeof pledgeCrowdCampaignSchema>;
