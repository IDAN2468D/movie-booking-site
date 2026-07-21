"use server";

import { callGeminiWithRetry } from "@/lib/gemini";
import { DynamicComboSchema, DynamicCombo } from "@/lib/validations/comboRoulette";
import { FOOD_ITEMS } from "@/lib/constants";

export async function generateDynamicComboAction(movieTitle: string): Promise<{ success: boolean; data?: DynamicCombo; error?: string }> {
  try {
    const foodItemsData = FOOD_ITEMS.map(item => `{ id: ${item.id}, name: "${item.name}" }`).join(", ");
    
    const prompt = `
      You are an expert cinema AI sales assistant creating a personalized snack combo.
      The user is about to watch: "${movieTitle}".
      We want to offer them a unique dynamic combo using 2 or 3 of these available products:
      ${foodItemsData}
      
      Generate a dynamic combo.
      Return ONLY a valid JSON object matching this exact structure:
      {
        "name": "Combo Name IN HEBREW",
        "description": "Why this combo fits the movie IN HEBREW",
        "discountPercent": 15,
        "items": [1, 3]
      }
      RULES:
      1. MUST WRITE name and description IN HEBREW ONLY.
      2. Choose food item IDs strictly from the provided list.
      3. discountPercent must be between 5 and 30.
      4. Do not include markdown blocks, just raw JSON.
    `;
    
    const resultText = await callGeminiWithRetry(['gemini-3.5-flash-lite'], async (model) => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    });

    const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    const validated = DynamicComboSchema.parse(parsed);

    return { success: true, data: validated };
  } catch (error: any) {
    console.error("Dynamic Combo generation failed:", error);
    return { success: false, error: error.message };
  }
}
