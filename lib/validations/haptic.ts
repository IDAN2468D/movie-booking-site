import { z } from 'zod';

export const HapticPresetSchema = z.enum(['sci-fi', 'thriller', 'action', 'ambient']);
export type HapticPreset = z.infer<typeof HapticPresetSchema>;

export const HapticCalibrationSchema = z.object({
  subBassFrequency: z.number().min(20).max(100).default(40),
  hapticIntensity: z.number().min(0).max(1).default(0.8),
  spatialPanning: z.number().min(-1).max(1).default(0),
  preset: HapticPresetSchema.default('sci-fi'),
  activeNodeId: z.string().optional(),
});

export type HapticCalibrationInput = z.infer<typeof HapticCalibrationSchema>;

export const HapticNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  frequency: z.number(),
  vibratePattern: z.array(z.number()),
  x: z.number(),
  y: z.number(),
});

export type HapticNode = z.infer<typeof HapticNodeSchema>;
