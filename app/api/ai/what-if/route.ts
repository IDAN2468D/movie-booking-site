import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { movieTitle, scenario } = await req.json();

    if (!movieTitle || !scenario) {
      return NextResponse.json({ success: false, error: 'Missing movieTitle or scenario' }, { status: 400 });
    }

    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const resultData = await callGeminiWithRetry(['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'], async (model) => {
      const generativeModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: `You are an incredibly creative Hollywood screenwriter and script doctor.
The user will ask "What if..." about a specific movie.
Your job is to write a highly dramatic, cinematic, and compelling alternate storyline based on their premise.
Rules:
1. Respond ONLY in Hebrew.
2. Structure the response like a movie script synopsis or a dramatic story block.
3. Be descriptive, creative, and match the tone of the original movie.
4. Keep it relatively short (1-2 paragraphs).
5. Output format should be markdown.`
      });

      const result = await generativeModel.generateContent(`Movie: ${movieTitle}\nPremise: ${scenario}`);
      return { text: result.response.text(), modelName: model.model };
    });

    return NextResponse.json({ success: true, text: resultData.text });
  } catch (error: unknown) {
    console.error('What-If Scenario Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate what-if scenario';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
