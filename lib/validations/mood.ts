import { z } from 'zod';

export const MoodSchema = z.object({
  valence: z.number().min(0).max(1),
  arousal: z.number().min(0).max(1),
  dominance: z.number().min(0).max(1),
  preset: z.enum(['melancholy', 'hype', 'cyber_euphoria', 'cosmic_horror']).optional(),
});

export type MoodInput = z.infer<typeof MoodSchema>;

export interface MoodRecommendation {
  id: string;
  title: string;
  genre: string;
  matchScore: number;
  refractionColor: string;
  description: string;
}
