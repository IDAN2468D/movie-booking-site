"use server";

import {
  VoiceSearchInputSchema,
  VoiceSearchOutput,
} from "@/lib/validations/voiceSearch.schema";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function processVoiceSearchAction(
  rawInput: unknown
): Promise<ActionResult<VoiceSearchOutput>> {
  try {
    const validated = VoiceSearchInputSchema.parse(rawInput);
    const { transcript, selectedMood } = validated;

    const query = transcript.trim();
    let detectedMood = selectedMood || "אקשן ומתח";

    if (query.includes("מצחיק") || query.includes("קומדיה")) {
      detectedMood = "קומדיה וצחוק";
    } else if (query.includes("פחד") || query.includes("אימה")) {
      detectedMood = "אימה ומתח";
    } else if (query.includes("אהבה") || query.includes("רומנטי")) {
      detectedMood = "רומנטיקה";
    } else if (query.includes("דרמה") || query.includes("מרגש")) {
      detectedMood = "דרמה מרגשת";
    }

    const suggestedGenres = ["Action", "Sci-Fi", "Thriller"];
    const matchedMovieIds = [101, 102, 103, 104];
    const explanation = `זיהינו חיפוש קולי: "${query}". הותאמו סרטים בקטגוריית ${detectedMood}.`;

    return {
      success: true,
      data: {
        query,
        intent: "search_movies",
        detectedMood,
        suggestedGenres,
        matchedMovieIds,
        explanation,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to process voice search query",
    };
  }
}
