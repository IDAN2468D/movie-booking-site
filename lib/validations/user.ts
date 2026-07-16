import { z } from 'zod';

export const pendingScratchRewardSchema = z.object({
  rewardId: z.string(),
  type: z.enum(['discount_percentage', 'fixed_discount', 'free_ticket']),
  value: z.number(),
  applied: z.boolean().default(false),
  expiresAt: z.date(),
  title: z.string().optional(),
  explanation: z.string().optional(),
  voucherCode: z.string().optional()
});

export const userSchema = z.object({
  name: z.string().min(2, "השם חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(6).optional(),
  image: z.string().url().optional(),
  createdAt: z.date().default(() => new Date()),
  pendingScratchReward: pendingScratchRewardSchema.optional()
});

export type PendingScratchReward = z.infer<typeof pendingScratchRewardSchema>;
export type User = z.infer<typeof userSchema>;
