"use server";

import { SeatAcousticProfileSchema, SeatAcousticProfileInput } from "@/lib/validations/acoustics";

export async function getSeatAcousticProfile(input: SeatAcousticProfileInput) {
  try {
    const parsed = SeatAcousticProfileSchema.parse(input);
    const { seatId, x, y } = parsed;

    // Simulate database/acoustic mapping logic
    // We calculate a realistic reverb time based on seat position
    const rowChar = seatId.charAt(0).toUpperCase();
    const rowIndex = rowChar.charCodeAt(0) - 65; // A=0, H=7
    
    // Front rows (A,B,C) have less reverb, back rows (F,G,H) have more
    const baseReverb = 1.0;
    const reverbTime = baseReverb + (rowIndex * 0.15); // ranges 1.0 - 2.05
    
    // Lowpass filter: center seats have clearer sound (higher lowpass cutoff)
    // Edges (x approaching -1 or 1) have slightly muffled sound
    const lowpassFreq = 20000 - (Math.abs(x) * 5000); // 15000 - 20000 Hz
    
    // Delay: seats further back have more delay from the screen
    const delayTime = (rowIndex + 1) * 0.01; // 0.01s - 0.08s

    return {
      success: true,
      data: {
        reverbTime,
        lowpassFreq,
        delayTime
      }
    };
  } catch (error: any) {
    console.error("Acoustic Profile Error:", error);
    return { success: false, error: "Failed to load acoustic profile." };
  }
}
