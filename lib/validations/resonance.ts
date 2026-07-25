import { z } from 'zod';

export const ResonanceStateSchema = z.object({
  resonanceLevel: z.number().min(0).max(100),
  profileMode: z.enum(['dialogue', 'bass', 'surround']),
  frequencyTargetHz: z.number().min(20).max(20000),
});

export type ResonanceStateInput = z.infer<typeof ResonanceStateSchema>;

export interface ResonanceResult {
  resonanceLevel: number;
  glowColor: string;
  targetFrequency: number;
  statusHebrew: string;
  descriptionHebrew: string;
}
