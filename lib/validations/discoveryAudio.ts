import { z } from 'zod';

export const GenreAudioMetadataSchema = z.object({
  genreId: z.string().min(1),
  oscillatorType: z.enum(['sine', 'square', 'sawtooth', 'triangle']),
  baseFrequency: z.number().min(20).max(2000),
  sweepDuration: z.number().positive(),
  gainIntensity: z.number().min(0).max(1),
});

export const SelectionNodeStateSchema = z.object({
  isOverTarget: z.boolean(),
  currentFocalScale: z.number(),
  frequencyModulationLocked: z.boolean(),
});

export type GenreAudioMetadata = z.infer<typeof GenreAudioMetadataSchema>;
export type SelectionNodeState = z.infer<typeof SelectionNodeStateSchema>;
