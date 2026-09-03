"use server";

import { callGeminiWithRetry } from "@/lib/gemini";
import { DynamicComboSchema, DynamicCombo } from "@/lib/validations/comboRoulette";
import { FOOD_ITEMS } from "@/lib/constants";

function getFallbackCombo(movieTitle: string): DynamicCombo {
  const combos: DynamicCombo[] = [
    {
      name: `קומבו בלוקבסטר VIP: ${movieTitle}`,
      description: `השילוב המנצח ל-${movieTitle} – פופקורן פרימיום קריספי, נאצ'וס סופרים חם וסודה קראפט צוננת.`,
      discountPercent: 20,
      items: [1, 2, 3],
    },
    {
      name: `קומבו מגה-אקשן: ${movieTitle}`,
      description: `טעימה מחשמלת של נקניקייה ענקית, פופקורן חם ומשקה מוגז קריר שילוו אתכם בכל רגע מותח.`,
      discountPercent: 25,
      items: [5, 1, 3],
    },
    {
      name: `קומבו מתוקים קולנועי: ${movieTitle}`,
      description: `פינוק מושלם להקרנה – פופקורן קרמל משובח, סוכריות גומי וברד תות פרא קפוא.`,
      discountPercent: 15,
      items: [7, 8, 9],
    },
  ];
  const hash = movieTitle.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return combos[hash % combos.length];
}

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
        "description": "Why this combo fits the movie IN HEBREW, 1-2 engaging sentences",
        "discountPercent": 20,
        "items": [1, 2, 3]
      }
      RULES:
      1. MUST WRITE name and description IN HEBREW ONLY.
      2. Choose food item IDs strictly from the provided list.
      3. discountPercent must be between 10 and 30.
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
  } catch (error) {
    console.warn("Dynamic Combo generation via Gemini fallback activated:", error);
    const fallback = getFallbackCombo(movieTitle);
    return { success: true, data: fallback };
  }
}
