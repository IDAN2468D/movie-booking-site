import { z } from 'zod';

export const DirectorsAudioSchema = z.object({
  movieId: z.string().min(1, 'Movie ID is required'),
  timestampSeconds: z.number().min(0),
  audioMode: z.enum(['balanced', 'dialogue_boost', 'bass_drop', 'score_focus']).default('balanced'),
});

export type DirectorsAudioInput = z.infer<typeof DirectorsAudioSchema>;
