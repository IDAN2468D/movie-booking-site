import { z } from "zod";

export const ClaimRewardSchema = z.object({
  rewardId: z.string({
    message: "מזהה הטבה אינו תקין או פג תוקף",
  }).min(1, { message: "מזהה הטבה אינו תקין או פג תוקף" }),
  userId: z.string({
    message: "שגיאת הזדהות",
  }).min(1, { message: "שגיאת הזדהות" }),
  costInPoints: z.number({
    message: "עלות בנקודות חסרה",
  }).min(0),
});

export type ClaimRewardInput = z.infer<typeof ClaimRewardSchema>;
