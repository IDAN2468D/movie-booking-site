import { z } from 'zod';

export const VipAnalyticsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  timeframe: z.enum(['30d', '90d', '1y', 'all']).default('90d'),
});

export type VipAnalyticsInput = z.infer<typeof VipAnalyticsSchema>;
