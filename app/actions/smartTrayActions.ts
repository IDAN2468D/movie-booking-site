"use server";

import { callGeminiWithRetry } from "@/lib/gemini";
import { FOOD_ITEMS } from "@/lib/constants";
import { z } from "zod";

const SmartTraySchema = z.object({
  recommendedIds: z.array(z.number()),
  explanation: z.string()
});

export async function getSmartTrayRecommendations(movieTitle: string, movieGenre: string) {
  try {
    const catalogStr = FOOD_ITEMS.map(f => `${f.id}: ${f.name} (${f.category})`).join(", ");
    
    const prompt = `
      You are an expert cinematic sommelier.
      The user is watching "${movieTitle}" (Genre: ${movieGenre}).
      From the following food catalog: ${catalogStr}
      Pick exactly 3 item IDs that perfectly match the vibe of the movie.
      Return ONLY a JSON object matching this exact structure:
      {
        "recommendedIds": [id1, id2, id3],
        "explanation": "A short 1-2 sentence explanation IN HEBREW explaining why this combination fits the movie."
      }
      MUST write explanation IN HEBREW. No markdown, just raw JSON.
    `;
    
    const resultText = await callGeminiWithRetry(['gemini-3.5-flash-lite'], async (model) => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    });

    const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    const validated = SmartTraySchema.parse(parsed);

    // Map IDs back to actual items
    const items = validated.recommendedIds.map(id => FOOD_ITEMS.find(f => f.id === id)).filter(Boolean);

    return { success: true, data: { items, explanation: validated.explanation } };
  } catch (error: any) {
    console.error("SmartTray generation failed:", error);
    return { success: false, error: error.message };
  }
}
