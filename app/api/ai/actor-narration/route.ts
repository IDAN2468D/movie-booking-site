import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const RequestSchema = z.object({
  actorName: z.string(),
  biography: z.string(),
  notableRoles: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  let prompt = "";
  try {
    const body = await req.json();
    const validated = RequestSchema.parse(body);

    prompt = `
      אתה קריין קולנוע מקצועי, דרמטי ומסקרן באתר MovieBook.
      תפקידך לכתוב תסריט קריינות קצר, מרתק ויוקרתי (עד 40 מילים בעברית) על השחקן/שחקנית: "${validated.actorName}".
      התסריט צריך להתמקד בסגנון המשחק הייחודי שלו, תפקידיו הבולטים, והאנרגיה שהוא מביא למסך.
      נסה להציג אותו בצורה הגדולה מהחיים (קולנועית ותיאטרלית) כדי לעורר עניין רב אצל חובבי קולנוע.
      כתוב אך ורק את הטקסט המדובר עצמו בעברית רהוטה, ללא הנחיות קריינות (כמו בסוגריים או כותרות).
      
      רקע ביוגרפי: ${validated.biography}
      תפקידים בולטים: ${validated.notableRoles.join(", ")}
    `;

    const modelNames = [
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
    ];
    const { callGeminiWithRetry } = await import("@/lib/gemini");

    const { text, modelUsed } = await callGeminiWithRetry(
      modelNames,
      async (model) => {
        const result = await model.generateContent(prompt);
        return { text: result.response.text(), modelUsed: model.model };
      }
    );

    return NextResponse.json({
      success: true,
      script: text.trim(),
      model: modelUsed,
    });
  } catch (error: unknown) {
    console.error("Actor Narration Gemini API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate actor narration script";

    // Ollama Fallback
    try {
      console.log("Falling back to local Ollama for actor-narration...");
      const { callOllama } = await import("@/lib/ollama");
      const response = await callOllama([{ role: "user", content: prompt }]);
      if (response.success) {
        return NextResponse.json({
          success: true,
          script: response.content.trim(),
          model: `${response.model} (Ollama Fallback)`,
        });
      }
    } catch (ollamaErr) {
      console.error("Ollama fallback failed for actor-narration:", ollamaErr);
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
