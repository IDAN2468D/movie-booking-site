import { z } from 'zod';

export const EraTypeSchema = z.enum(['80s_synthwave', '50s_film_noir', 'cyberpunk_2099', '70s_technicolor']);

export const RemixRequestSchema = z.object({
  movieId: z.string().min(1),
  era: EraTypeSchema,
  audioEqProfile: z.string().optional(),
});

export const RemixResponseSchema = z.object({
  movieId: z.string(),
  era: EraTypeSchema,
  tagline: z.string(),
  remixedSynopsis: z.string(),
  colorFilterCss: z.string(),
  synthFrequencyHz: z.number(),
});

export type EraType = z.infer<typeof EraTypeSchema>;
export type RemixRequest = z.infer<typeof RemixRequestSchema>;
export type RemixResponse = z.infer<typeof RemixResponseSchema>;
