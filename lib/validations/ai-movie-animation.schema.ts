import { z } from 'zod';

export const AiMovieAnimationRequestSchema = z.object({
  movieId: z.number().int().positive(),
  movieTitle: z.string().min(1),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  overview: z.string().optional(),
  customPrompt: z.string().optional(),
  stylePreset: z.enum(['cyberpunk', 'retro_film', 'epic_glow', 'noir', 'fantasy']).optional().default('cyberpunk'),
});

export type AiMovieAnimationRequest = z.infer<typeof AiMovieAnimationRequestSchema>;

export const AiMovieAnimationFrameSchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  cssFilter: z.string(),
  animationType: z.enum(['zoom_in', 'pan_right', 'pulse_glow', 'rotation_tilt']),
  description: z.string(),
});

export type AiMovieAnimationFrame = z.infer<typeof AiMovieAnimationFrameSchema>;

export const AiMovieAnimationResponseSchema = z.object({
  frames: z.array(AiMovieAnimationFrameSchema),
  activeStyle: z.string(),
});

export type AiMovieAnimationResponse = z.infer<typeof AiMovieAnimationResponseSchema>;
