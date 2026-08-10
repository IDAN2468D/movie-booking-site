"use server";

import { sensoryProfileSchema, SensoryProfileInput } from "@/lib/schemas/sensorySync";
import { SensoryProfile } from "@/lib/models/SensoryProfile";

export async function saveSensoryProfile(input: SensoryProfileInput) {
  try {
    const validated = sensoryProfileSchema.parse(input);
    return {
      success: true,
      data: {
        ...validated,
        id: `sensory_${Date.now()}`,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save sensory profile";
    return { success: false, error: message };
  }
}

export async function getSensoryProfile(seatId: string, movieId: string) {
  try {
    return {
      success: true,
      data: {
        seatId,
        movieId,
        hapticIntensity: 80,
        subBassFrequency: 45,
        ambientLightingColor: "#8B5CF6",
        pulsePattern: "rhythmic",
        isActive: true,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch sensory profile";
    return { success: false, error: message };
  }
}
