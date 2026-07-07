import { z } from 'zod';

export const biometricIntensitySchema = z.object({
  movieId: z.string(),
  genre: z.string(),
  seatId: z.string(),
  intensity: z.number().min(0).max(100),
  colorSaturate: z.string().optional(),
});

export const chronoHistorySchema = z.object({
  orderId: z.string(),
  movieId: z.string(),
  date: z.string(), // ISO string or 'he-IL' locale string fallback
  timestamp: z.number(),
  decayLevel: z.number().min(0).max(1),
  glassOpacity: z.number().min(0).max(1),
});

export const snackTrayItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  x: z.number(),
  y: z.number(),
  isPlaced: z.boolean(),
  seatTargetId: z.string().optional(),
});

// Infer types
export type BiometricIntensity = z.infer<typeof biometricIntensitySchema>;
export type ChronoHistory = z.infer<typeof chronoHistorySchema>;
export type SnackTrayItem = z.infer<typeof snackTrayItemSchema>;
