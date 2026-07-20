import { NextResponse } from "next/server";
import { SchemaType } from '@google/generative-ai';
import { CinematicResearchInputSchema, CinematicResearchOutputSchema } from "@/lib/schemas/researcher";
import { callGeminiWithRetry } from "@/lib/gemini";

// Unified Result Pattern definition
interface UnifiedResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  model?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Zod Validation for Input
    const parseResult = CinematicResearchInputSchema.safeParse(body);
    if (!parseResult.success) {
      const errorResult: UnifiedResult = {
        success: false,
        error: `Validation error: ${parseResult.error.message}`,
      };
      return NextResponse.json(errorResult, { status: 400 });
    }
    
    const { movieTitle } = parseResult.data;

    const prompt = `
    You are an expert cinematic researcher. Search the web for deep lore, trivia, and cultural impact about the movie '${movieTitle}'.
    IMPORTANT: You MUST write your entire response in Hebrew (עברית).
    Format the response strictly as a JSON object with the following schema:
    {
        "trivia": ["string", "string", "string"],
        "culturalImpact": "string",
        "behindTheScenes": "string"
    }
    Do not wrap the output in markdown code blocks. Output raw JSON only.
    `;

    const modelNames = ['gemini-3.1-flash-lite', 'gemini-2.5-flash'];
    let text = '';
    let modelUsed = '';

    try {
      const result = await callGeminiWithRetry(modelNames, async (model) => {
        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                trivia: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING }
                },
                culturalImpact: { type: SchemaType.STRING },
                behindTheScenes: { type: SchemaType.STRING }
              },
              required: ["trivia", "culturalImpact", "behindTheScenes"]
            }
          }
        });
        return { text: res.response.text(), modelUsed: model.model };
      });
      text = result.text;
      modelUsed = result.modelUsed;
    } catch (geminiError: any) {
      console.warn("Gemini failed:", geminiError);
      throw new Error(geminiError.message || "Failed to generate cinematic insights.");
    }

    // Extract JSON block aggressively
    let jsonStr = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    jsonStr = jsonStr.replace(/```json|```/g, '').trim();

    const rawData = JSON.parse(jsonStr);

    // 4. Zod Validation for Output
    const outParseResult = CinematicResearchOutputSchema.safeParse(rawData);
    if (!outParseResult.success) {
      const errorResult: UnifiedResult = {
        success: false,
        error: `Output Validation error: ${outParseResult.error.message}`,
      };
      return NextResponse.json(errorResult, { status: 500 });
    }

    const successResult: UnifiedResult = {
      success: true,
      data: outParseResult.data,
      model: modelUsed
    };
    return NextResponse.json(successResult);

  } catch (err: any) {
    console.error("Deep Cinematic Researcher Error:", err);
    const errorResult: UnifiedResult = {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
    return NextResponse.json(errorResult, { status: 500 });
  }
}
