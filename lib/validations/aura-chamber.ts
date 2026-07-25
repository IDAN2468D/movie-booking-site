import { z } from 'zod';

export const AuraTypeSchema = z.enum(['cyan_quantum', 'violet_stellar', 'emerald_eco', 'solar_gold']);
export type AuraType = z.infer<typeof AuraTypeSchema>;

export const BiometricAuraScanSchema = z.object({
  holdDurationMs: z.number().min(1000).default(3000),
  pulseRate: z.number().min(50).max(180).default(72),
  preferredGenre: z.string().optional(),
});

export type BiometricAuraScanInput = z.infer<typeof BiometricAuraScanSchema>;

export const AuraProfileResultSchema = z.object({
  auraType: AuraTypeSchema,
  auraTitle: z.string(),
  auraColor: z.string(),
  energyFrequencyHz: z.number(),
  resonancePercentage: z.number(),
  moodDescription: z.string(),
  recommendedVibes: z.array(z.string()),
});

export type AuraProfileResult = z.infer<typeof AuraProfileResultSchema>;
