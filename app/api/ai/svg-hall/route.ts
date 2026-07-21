import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { movieTitle, theme } = await req.json();

    if (!movieTitle) {
      return NextResponse.json({ success: false, error: 'No movie title provided' }, { status: 400 });
    }

    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const resultData = await callGeminiWithRetry(['gemini-3.5-flash-lite', 'gemini-2.5-flash'], async (model) => {
      const generativeModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: `You are an expert SVG seating chart designer. Create a customized, highly creative SVG representation of a movie theater seating layout.
The seating layout must match the requested movie theme!
1. For Space/Sci-fi (e.g. Star Wars, Interstellar): Arrange seats (colored circles) in the shape of a spaceship, ring of planets, or rocket.
2. For Romance/Drama: Arrange seats in the shape of a heart or wings.
3. For Action/Adventure: Arrange seats in waves or concentric semicircles.
4. For Classic/Standard: Arrange seats in a beautiful futuristic curving amphitheatrical grid.

Rules:
1. ONLY output raw, valid SVG code.
2. NO markdown formatting, NO \`\`\`svg. Just the <svg> element.
3. Use a dark cinematic theme (dark backgrounds, glowing neon lines, neat text for the screen).
4. viewBox="0 0 600 400".
5. Screen must be represented at the top (e.g., a curving glowing path or rect saying "SCREEN" / "מסך").
6. Draw about 20-30 seats. Make them circles \`<circle>\` or rounded rects \`<rect>\` with properties like class="seat" and cursor="pointer". Use CSS inside \`<style>\` to make them glow on hover!
7. Ensure valid SVG structure.`
      });

      const result = await generativeModel.generateContent(`Create a themed custom SVG seating map for: ${movieTitle} with the theme: ${theme || 'Space'}`);
      let text = result.response.text();
      // Clean up markdown block if present
      text = text.replace(/```svg/gi, '').replace(/```/g, '').trim();
      return { text, modelName: model.model };
    });

    return NextResponse.json({ success: true, svg: resultData.text });
  } catch (error: unknown) {
    console.error('SVG Hall Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate custom hall SVG';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
