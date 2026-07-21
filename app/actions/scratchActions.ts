"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { callGeminiWithRetry } from "@/lib/gemini";
import { ScratchCardGenerationInputSchema } from "@/lib/validations/scratchCard";

export type ScratchActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

const FALLBACK_PRIZES = [
  { title: "כרטיס VIP חינם", type: "free_ticket", value: 0 },
  { title: "פופקורן ענק זוגי", type: "discount_percentage", value: 100 },
  { title: "משקה ענק חינם", type: "discount_percentage", value: 100 },
  { title: "נאצוס מוגדל חינם", type: "discount_percentage", value: 100 },
  { title: "1+1 לכרטיס קולנוע", type: "discount_percentage", value: 50 },
  { title: "שדרוג למושב VIP", type: "fixed_discount", value: 30 }
];

export async function generateScratchCardAction(
  userId: string,
  selectedMovieId?: string,
  userMood?: string
): Promise<ScratchActionResponse> {
  try {
    const validated = ScratchCardGenerationInputSchema.safeParse({
      userId,
      selectedMovieId,
      userMood
    });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user already has a pending scratch reward that is not applied and not expired
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return { success: false, error: "משתמש לא נמצא" };
    }

    if (user.pendingScratchReward) {
      const reward = user.pendingScratchReward;
      if (!reward.applied && new Date(reward.expiresAt) > new Date()) {
        return {
          success: true,
          data: reward
        };
      }
    }

    // Try to get movie context if selectedMovieId is provided
    let movieTitle = "סרט מומלץ";
    if (selectedMovieId) {
      try {
        const movieDoc = await db.collection("movies").findOne({ id: parseInt(selectedMovieId, 10) });
        if (movieDoc && movieDoc.title) {
          movieTitle = movieDoc.title;
        }
      } catch (_) {}
    }

    let prize = FALLBACK_PRIZES[Math.floor(Math.random() * FALLBACK_PRIZES.length)];
    let explanation = "הסוכן הנוירוני זיהה שאתה במצב רוח מיוחד, כרטיס זה מוענק לך באהבה!";

    // Call Gemini to generate a personalized prize explanation
    const prompt = `אנחנו מייצרים כרטיס גירוד הטבה נוירוני עבור משתמש באפליקציית סרטים.
המשתמש מתעניין בסרט: "${movieTitle}" ${userMood ? `ונמצא במצב רוח: "${userMood}"` : ""}.
אנא בחר הטבה אחת מתוך הרשימה הבאה:
1. כרטיס VIP חינם (סוג: free_ticket, ערך: 0)
2. פופקורן ענק זוגי (סוג: discount_percentage, ערך: 100)
3. משקה ענק חינם (סוג: discount_percentage, ערך: 100)
4. נאצוס מוגדל חינם (סוג: discount_percentage, ערך: 100)
5. 1+1 לכרטיס קולנוע (סוג: discount_percentage, ערך: 50)
6. שדרוג למושב VIP (סוג: fixed_discount, ערך: 30)

והחזר פלט בפורמט JSON בלבד ובשפה העברית:
{
  "title": "כותרת ההטבה (למשל: כרטיס VIP חינם)",
  "explanation": "הסבר קצר, מלהיב והומוריסטי בעברית המקשר בין ההטבה שנבחרה לבין הסרט/מצב הרוח של המשתמש (עד 20 מילים)",
  "type": "free_ticket" | "discount_percentage" | "fixed_discount",
  "value": מספר (0 או 100 או 50 או 30)
}`;

    try {
      const geminiResult = await callGeminiWithRetry(
        ["gemini-3.5-flash-lite", "gemini-2.5-flash"],
        async (model) => {
          const result = await model.generateContent(prompt);
          return result.response.text().trim();
        }
      );

      // Clean markdown code blocks from response if present
      const cleanJson = geminiResult.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      
      if (parsed.title && parsed.type && typeof parsed.value === "number") {
        prize = {
          title: parsed.title,
          type: parsed.type,
          value: parsed.value
        };
        explanation = parsed.explanation || explanation;
      }
    } catch (err) {
      console.warn("Gemini prize generation failed, using fallback:", err);
    }

    const randomVoucherCode = `VIP-GEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const pendingScratchReward = {
      rewardId: `reward-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: prize.type,
      value: prize.value,
      applied: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      title: prize.title,
      explanation,
      voucherCode: randomVoucherCode
    };

    // Save atomically in database
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { pendingScratchReward } }
    );

    return {
      success: true,
      data: pendingScratchReward
    };
  } catch (error: any) {
    console.error("generateScratchCardAction error:", error);
    return { success: false, error: "שגיאת מערכת ביצירת כרטיס הגירוד הג'נרטיבי" };
  }
}
