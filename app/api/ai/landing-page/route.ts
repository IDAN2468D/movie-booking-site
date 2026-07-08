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

    const resultData = await callGeminiWithRetry(['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'], async (model) => {
      const generativeModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: `You are an expert frontend developer and designer. The user is hosting a VIP screening of the movie.
Generate a stunning, single-file HTML landing page (using Tailwind CSS via CDN) to invite their friends to the screening.
Rules:
1. Output ONLY the raw HTML code. Do NOT wrap in \`\`\`html or markdown blocks.
2. The page must be responsive, dark-themed, and cinematic.
3. Include a title like "You're Invited to an Exclusive VIP Screening of [Movie Title]".
4. Include a fake RSVP button.
5. Add dramatic CSS animations or gradients using Tailwind.
6. The language of the page should be Hebrew (dir="rtl").`
      });

      const result = await generativeModel.generateContent(`Create the VIP invitation landing page for the movie: ${movieTitle}`);
      let html = result.response.text();
      // Clean up markdown block if present
      html = html.replace(/```html/gi, '').replace(/```/g, '').trim();
      return { text: html, modelName: model.model };
    });

    return NextResponse.json({ success: true, html: resultData.text });
  } catch (error: unknown) {
    console.error('Landing Page Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate landing page';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
