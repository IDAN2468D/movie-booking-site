import { z } from 'zod';

export const MovieSelectionAnimationInputSchema = z.object({
  movieId: z.number().int().positive(),
  movieTitle: z.string().min(1),
  genres: z.array(z.string()).default([]),
  rating: z.number().min(0).max(10).default(0),
});

export type MovieSelectionAnimationInput = z.infer<typeof MovieSelectionAnimationInputSchema>;

export const MovieSelectionAnimationPresetSchema = z.object({
  glowColor: z.string(),
  secondaryGlow: z.string(),
  rotationSpeed: z.number(),
  particleCount: z.number(),
  hologramIntensity: z.number(),
  themeName: z.string(),
});

export type MovieSelectionAnimationPreset = z.infer<typeof MovieSelectionAnimationPresetSchema>;
