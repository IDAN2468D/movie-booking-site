"use server";

import { callGeminiWithRetry } from "@/lib/gemini";
import { HologramThemeSchema, HologramTheme } from "@/lib/validations/hologramSchema";

export async function generateHologramThemeAction(movieTitle: string, genre: string = "Cinema"): Promise<{ success: boolean; data?: HologramTheme; error?: string }> {
  try {
    const prompt = `
      You are an expert AI designer creating a generative holographic ticket pass theme.
      The user just booked a ticket for: "${movieTitle}" (Genre: ${genre}).
      
      Generate a customized Hologram Theme matching the vibe of the movie.
      Return ONLY a valid JSON object matching this exact structure:
      {
        "primaryColor": "#FF0000",
        "secondaryColor": "#00FF00",
        "hologramTextureType": "crystal", // MUST BE one of: "crystal", "liquid", "cyber", "plasma"
        "passName": "Pass Name IN HEBREW"
      }
      RULES:
      1. MUST WRITE passName IN HEBREW (e.g., "כרטיס VIP גלקטי", "פס אימה יוקרתי").
      2. Ensure colors are valid Hex codes.
      3. Do not include markdown blocks, just raw JSON.
    `;
    
    const resultText = await callGeminiWithRetry(['gemini-3.5-flash-lite'], async (model) => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    });

    const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    const validated = HologramThemeSchema.parse(parsed);

    return { success: true, data: validated };
  } catch (error: any) {
    console.error("Hologram Theme generation failed:", error);
    return { success: false, error: error.message };
  }
}
