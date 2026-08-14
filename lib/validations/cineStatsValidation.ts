import { z } from "zod";

export const GetUserCineStatsSchema = z.object({
  userId: z.string().optional(),
});

export const ClaimAchievementBadgeSchema = z.object({
  badgeId: z.string().min(1, "מזהה תג נדרש"),
});

export type GetUserCineStatsInput = z.infer<typeof GetUserCineStatsSchema>;
export type ClaimAchievementBadgeInput = z.infer<typeof ClaimAchievementBadgeSchema>;
