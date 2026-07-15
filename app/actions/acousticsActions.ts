"use server"

import { SeatAcousticProfileSchema, SeatAcousticProfileInput } from "@/lib/validations/acoustics";

export async function getSeatAcousticProfileAction(input: SeatAcousticProfileInput) {
  try {
    const validated = SeatAcousticProfileSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { x, y } = validated.data;
    
    // Simulate acoustic venue profile math
    // X and Y are normalized from -1 to 1 based on seat position
    // Center of the theater (X=0) has perfect stereo balance.
    const pan = Number(x.toFixed(2));

    // Y is rows from screen. Y=-1 is closest (loudest, wide freq), Y=1 is furthest (dampened highs).
    // Let's calculate lowpass filter frequency. Front = 20000Hz, Back = 4000Hz.
    const distanceFactor = (y + 1) / 2; // 0 (front) to 1 (back)
    const filterFreq = 20000 - (16000 * distanceFactor);

    // Delay based on distance from screen (speed of sound ~343 m/s)
    // Assume max distance is 30 meters. delay = distance / 343.
    // 0ms at front, ~80ms at back.
    const delayTime = distanceFactor * 0.08;

    return { 
      success: true, 
      data: { 
        pan, 
        filterFreq: Math.round(filterFreq),
        delayTime: Number(delayTime.toFixed(3))
      } 
    };
  } catch (error) {
    console.error("[getSeatAcousticProfileAction]", error);
    return { success: false, error: "שגיאה בחישוב המטריצה האקוסטית" };
  }
}
