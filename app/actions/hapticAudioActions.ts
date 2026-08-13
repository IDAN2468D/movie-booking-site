'use server';

import { z } from 'zod';

const HapticConfigSchema = z.object({
  frequencyHz: z.number().min(20).max(120).default(40),
  intensity: z.number().min(0.1).max(1.0).default(0.8),
  pattern: z.array(z.number()).default([100, 50, 100]),
});

export type HapticConfig = z.infer<typeof HapticConfigSchema>;

export async function processHapticAudioSync(input: unknown) {
  try {
    const parsed = HapticConfigSchema.parse(input);
    const audioWavefront = Array.from({ length: 12 }, (_, i) => ({
      timestampMs: i * 250,
      subBassGain: Math.sin(i * 0.5) * parsed.intensity,
      vibrationPulseMs: parsed.pattern[i % parsed.pattern.length],
    }));

    return {
      success: true,
      data: {
        config: parsed,
        audioWavefront,
        tactileStatus: 'SYNCHRONIZED',
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid haptic config';
    return { success: false, error: message };
  }
}
