"use server";

import { ChronoPortalSchema, ChronoPortalInput } from "@/lib/validations/chrono-portal";

export async function actionGetChronoPresets(input: ChronoPortalInput) {
  try {
    const validated = ChronoPortalSchema.parse(input);
    const presets: Record<string, { title: string; description: string; baseFreq: number }> = {
      "1920s": { title: "Silent Gramophone Era", description: "Narrow bandpass with vintage vinyl crackle.", baseFreq: 440 },
      "1970s": { title: "Analog Magnetic Tape", description: "Warm saturation with gentle high roll-off.", baseFreq: 320 },
      "1990s": { title: "Digital Surround Dynamic", description: "Crisp dynamic range with punchy bass.", baseFreq: 120 },
      "2090s": { title: "Neural Quantum Resonance", description: "Ultra-wide spatial acoustics with 38Hz sub-bass.", baseFreq: 38 },
    };

    return {
      success: true,
      data: {
        decade: validated.decade,
        preset: presets[validated.decade],
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message || "Validation failed" };
  }
}
