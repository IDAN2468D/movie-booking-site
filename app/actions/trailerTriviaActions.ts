"use server";

import { callGeminiWithRetry } from "@/lib/gemini";
import { TrailerTriviaResponseSchema, TrailerTriviaItem } from "@/lib/validations/trivia";

export async function generateTrailerTriviaAction(movieTitle: string): Promise<{ success: boolean; data?: TrailerTriviaItem[]; error?: string }> {
  try {
    const prompt = `
      You are an expert movie director providing behind-the-scenes trivia for a movie trailer.
      The movie is: "${movieTitle}".
      Generate exactly 4 short, interesting trivia facts about this movie (e.g., casting, stunts, budget, hidden details).
      Return ONLY a valid JSON array matching this exact structure:
      [
        {
          "timeInSeconds": 3,
          "text": "Short trivia text IN HEBREW"
        },
        ...
      ]
      RULES:
      1. MUST WRITE TRIVIA IN HEBREW ONLY.
      2. The timeInSeconds should be spaced out (e.g., 3, 10, 18, 25).
      3. Do not include markdown blocks, just raw JSON array.
    `;
    
    const resultText = await callGeminiWithRetry(['gemini-3.5-flash-lite'], async (model) => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    });

    const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    const validated = TrailerTriviaResponseSchema.parse(parsed);

    return { success: true, data: validated };
  } catch (error: any) {
    console.error("Trivia generation failed:", error);
    return { success: false, error: error.message };
  }
}
