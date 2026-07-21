import { z } from 'zod';

export const HapticPulseSchema = z.object({
  frequency: z.number().min(20).max(120).default(40), // Sub-bass frequency range (Hz)
  duration: z.number().min(50).max(2000).default(300), // Duration in ms
  pattern: z.array(z.number()).default([100, 50, 100]), // Vibration pattern (e.g. [on, off, on])
  volume: z.number().min(0).max(1).default(0.5), // Audio gain volume
});

export type HapticPulseConfig = z.infer<typeof HapticPulseSchema>;
