import { z } from 'zod';

export const BiometricSeatSchema = z.object({
  seatId: z.string().min(1),
  row: z.number().int().min(1).max(20),
  col: z.number().int().min(1).max(30),
  bassPreference: z.number().min(0).max(100),
  clarityPreference: z.number().min(0).max(100),
});

export const AcousticProfileResultSchema = z.object({
  sweetSpotScore: z.number().min(0).max(100),
  dbBoost: z.number(),
  surroundResonance: z.number(),
  vibeTag: z.string(),
});

export type BiometricSeatInput = z.infer<typeof BiometricSeatSchema>;
export type AcousticProfileResult = z.infer<typeof AcousticProfileResultSchema>;
