"use server";

import { DirectorsAudioSchema, DirectorsAudioInput } from "@/lib/validations/directorsAudio";

export async function getDirectorsTriviaAction(input: DirectorsAudioInput) {
  try {
    const validated = DirectorsAudioSchema.parse(input);
    const { movieId, timestampSeconds, audioMode } = validated;

    // Simulated / Native GenAI Trivia payload for cinematic trailers
    const triviaBubbles = [
      { timestamp: 15, trivia: "הבמאי בחר לצלם סצנה זו במצלמות IMAX 70mm ייחודיות." },
      { timestamp: 45, trivia: "פסקול הסצנה נערך בתדר 40Hz להגברת מתח אקוסטי." },
      { timestamp: 90, trivia: "אפקט התאורה הנוזלית בסצנה נוצר ללא CG — באמצעות השתקפויות מים טבעיות." },
    ];

    const currentTrivia = triviaBubbles.find(t => Math.abs(t.timestamp - timestampSeconds) <= 15)?.trivia || "אין פרטי טריוויה זמינים לשניה זו.";

    return {
      success: true,
      data: {
        movieId,
        timestampSeconds,
        audioMode,
        activeTrivia: currentTrivia,
        filterConfig: {
          highPassFreq: audioMode === 'dialogue_boost' ? 1000 : 200,
          lowPassFreq: audioMode === 'bass_drop' ? 120 : 8000,
          gainDb: audioMode === 'score_focus' ? 12 : 0,
        },
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.issues?.[0]?.message || error.message };
    }
    return { success: false, error: "שגיאה בטעינת טריוויית הבמאי" };
  }
}
