import { z } from "zod";

export const ScratchCardGenerationInputSchema = z.object({
  userId: z.string({
    message: "מזהה משתמש אינו תקין",
  }).min(1, { message: "מזהה משתמש אינו תקין" }),
  selectedMovieId: z.string().optional(),
  userMood: z.string().optional(),
});

export const GenerativePrizeSchema = z.object({
  rewardId: z.string(),
  title: z.string().min(1, "כותרת ההטבה חסרה"),
  explanation: z.string().min(1, "הסבר ההטבה חסר"),
  type: z.enum(['discount_percentage', 'fixed_discount', 'free_ticket']),
  value: z.number().nonnegative(),
  voucherCode: z.string().min(1, "קוד קופון חסר"),
});

export type ScratchCardGenerationInput = z.infer<typeof ScratchCardGenerationInputSchema>;
export type GenerativePrize = z.infer<typeof GenerativePrizeSchema>;
