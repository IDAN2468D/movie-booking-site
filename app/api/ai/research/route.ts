import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { movieTitle } = body;

    if (!movieTitle) {
      return NextResponse.json({ success: false, error: 'No movie title provided' }, { status: 400 });
    }

    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const resultData = await callGeminiWithRetry(['gemini-3.1-flash-lite', 'gemini-2.5-flash'], async (model) => {
      const generativeModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: `You are a legendary film historian and AI researcher. Provide a "Cinematic Deep Dive" for the requested movie. Include 3 sections: 
1. 🎬 מאחורי הקלעים (Behind the scenes facts)
2. 🥚 איסטראגז ורפרנסים (Easter eggs and references)
3. 👁️ חזון הבמאי (Director's vision and thematic depth)

Format the output in clean Markdown. Respond entirely in Hebrew.`
      });

      const result = await generativeModel.generateContent(`Please research and provide a deep dive for the movie: ${movieTitle}`);
      
      return { text: result.response.text(), modelName: model.model };
    });

    return NextResponse.json({ success: true, research: resultData.text });
  } catch (error: unknown) {
    console.error('Deep Dive Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate research';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
