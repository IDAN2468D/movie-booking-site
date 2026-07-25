import { z } from 'zod';

export const ScaleTypeSchema = z.enum(['cinematic_minor', 'sci_fi_major', 'dark_thriller', 'ambient_harmony']);
export type ScaleType = z.infer<typeof ScaleTypeSchema>;

export const SoundtrackSynthSchema = z.object({
  scale: ScaleTypeSchema.default('cinematic_minor'),
  tempoBpm: z.number().min(60).max(180).default(110),
  cutoffFreqHz: z.number().min(200).max(8000).default(1200),
  activeLayers: z.object({
    bassDrone: z.boolean().default(true),
    arpeggio: z.boolean().default(true),
    harmonicPad: z.boolean().default(true),
    subBass: z.boolean().default(true),
  }),
});

export type SoundtrackSynthInput = z.infer<typeof SoundtrackSynthSchema>;

export const SoundtrackPresetResultSchema = z.object({
  presetTitle: z.string(),
  scaleName: z.string(),
  harmonicNotes: z.array(z.number()),
  baseFrequencyHz: z.number(),
  themeDescription: z.string(),
});

export type SoundtrackPresetResult = z.infer<typeof SoundtrackPresetResultSchema>;
