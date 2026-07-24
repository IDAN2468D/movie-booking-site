import { z } from 'zod';

export const CinematicAuraSchema = z.object({
  mood: z.string(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),
  intensity: z.number().min(0).max(100),
  description: z.string(),
});

export type CinematicAura = z.infer<typeof CinematicAuraSchema>;

export const AuraResonanceSchema = z.object({
  seatId: z.string(),
  row: z.string(),
  number: z.number(),
  compatibilityScore: z.number().min(0).max(1),
  occupantGenreAffinity: z.string(),
  glowColor: z.string(),
  isBooked: z.boolean(),
});

export type AuraResonance = z.infer<typeof AuraResonanceSchema>;
