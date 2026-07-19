"use server";

import { callGeminiWithRetry } from "@/lib/gemini";
import { CinematicAuraSchema, CinematicAura } from "@/lib/validations/aura";
import { getUserMemoriesAction } from "@/app/actions/memoryActions";

export async function generateAuraAction(userId: string): Promise<{ success: boolean; data?: CinematicAura; error?: string }> {
  try {
    const memoriesRes = await getUserMemoriesAction(userId);
    const memories = memoriesRes.success ? memoriesRes.data : [];
    const titles = memories?.map((m: any) => m.movieTitle).join(', ') || 'No history yet';
    
    const prompt = `
      Analyze this movie watching history: ${titles}.
      Generate a "Cinematic Aura" profile representing their cinematic energy.
      Return ONLY a valid JSON object matching this exact structure:
      {
        "mood": "Short 1-2 words description IN HEBREW",
        "colors": {
          "primary": "#HEX",
          "secondary": "#HEX",
          "accent": "#HEX"
        },
        "intensity": 85,
        "description": "A poetic 1-sentence description IN HEBREW"
      }
      MUST WRITE MOOD AND DESCRIPTION IN HEBREW ONLY. Use vibrant, neon colors. Do not include markdown blocks, just raw JSON.
    `;
    
    const resultText = await callGeminiWithRetry(['gemini-3.1-flash-lite'], async (model) => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    });

    const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    const validated = CinematicAuraSchema.parse(parsed);

    return { success: true, data: validated };
  } catch (error: any) {
    console.error("Aura generation failed:", error);
    return { success: false, error: error.message };
  }
}
