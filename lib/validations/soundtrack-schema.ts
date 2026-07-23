import { z } from 'zod';

export const HarmonicConfigSchema = z.object({
  rootFreq: z.number().min(30).max(880),
  scaleType: z.enum(['minor', 'major', 'pentatonic', 'ambient', 'dark']),
  reverbDecay: z.number().min(0.1).max(10.0),
  filterCutoff: z.number().min(100).max(12000),
  bpm: z.number().min(40).max(180),
  mood: z.string().min(1),
});

export type HarmonicConfig = z.infer<typeof HarmonicConfigSchema>;

export const SoundtrackRequestSchema = z.object({
  movieId: z.string().min(1),
  title: z.string().min(1),
  genres: z.array(z.string()),
  moodPrompt: z.string().optional(),
});

export type SoundtrackRequest = z.infer<typeof SoundtrackRequestSchema>;
