"use server";

import { groupMatchSchema, GroupMatchInput } from "@/lib/schemas/groupSync";

export async function calculateGroupCompatibility(input: GroupMatchInput) {
  try {
    const validated = groupMatchSchema.parse(input);
    const score = Math.floor(Math.random() * 25) + 75; // 75-100% score

    return {
      success: true,
      data: {
        ...validated,
        compatibilityScore: score,
        recommendedMovie: "Inception: Resonated",
        overlapGenres: ["Sci-Fi", "Action", "Thriller"],
        vibeSummary: "קבוצה זו מתאפיינת בזיקה חזקה למותחני מדע בדיוני ועלילות מורכבות.",
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to calculate group compatibility";
    return { success: false, error: message };
  }
}

export async function processVoiceVibeInput(audioTranscript: string) {
  try {
    return {
      success: true,
      data: {
        transcript: audioTranscript,
        extractedMood: "Action-Packed Thriller",
        suggestedGroupScore: 92,
        recommendedShowtime: "21:30 - VIP Lounge",
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process voice vibe";
    return { success: false, error: message };
  }
}
