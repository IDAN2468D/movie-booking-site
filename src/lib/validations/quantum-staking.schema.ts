import { z } from 'zod';

export const StakeRequestSchema = z.object({
  amount: z.number().positive(),
  stakingDurationDays: z.number().min(7).max(365),
});

export const StakingVaultDataSchema = z.object({
  stakedBalance: z.number(),
  yieldApyPercent: z.number(),
  claimablePulsePoints: z.number(),
  nftPassSignature: z.string(),
  isBiometricsUnlocked: z.boolean(),
});

export type StakeRequest = z.infer<typeof StakeRequestSchema>;
export type StakingVaultData = z.infer<typeof StakingVaultDataSchema>;
