import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { movieTitle } = await req.json();

    if (!movieTitle) {
      return NextResponse.json({ success: false, error: 'No movie title provided' }, { status: 400 });
    }

    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const resultData = await callGeminiWithRetry(['gemini-3.5-flash-lite', 'gemini-2.5-flash'], async (model) => {
      const generativeModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: `You are an expert data visualization engineer. Create a beautiful, complex SVG mind-map connecting the movie to its actors, director, and related cinematic universe. 
Rules:
1. ONLY output raw SVG code.
2. NO markdown formatting, NO \`\`\`svg. Just the <svg> element.
3. Use a dark theme (dark backgrounds, neon lines, glowing nodes).
4. Use valid XML without external dependencies.
5. viewBox="0 0 800 600".
6. Add some subtle CSS animations inside <style> tags within the SVG.`
      });

      const result = await generativeModel.generateContent(`Create a cinematic universe mind map in SVG format for the movie: ${movieTitle}`);
      let text = result.response.text();
      // Clean up markdown block if present
      text = text.replace(/```svg/gi, '').replace(/```/g, '').trim();
      return { text, modelName: model.model };
    });

    return NextResponse.json({ success: true, svg: resultData.text });
  } catch (error: unknown) {
    console.error('SVG Map Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate SVG map';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
