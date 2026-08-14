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

    const resultData = await callGeminiWithRetry(['gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'], async (model) => {
      const generativeModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: `You are an expert frontend developer and designer. The user is hosting an exclusive VIP screening of the movie "${movieTitle}".
Generate a stunning, self-contained single-file HTML landing page (using Tailwind CSS via CDN and Lucide Icons via unpkg or SVG) for guests to RSVP and reserve their seats in the VIP hall.
Rules:
1. Output ONLY the raw HTML code. Do NOT wrap in \`\`\`html or markdown blocks.
2. The page must be responsive, dark-themed (slate-950/black with amber/gold VIP gradients), and cinematic.
3. Language: Hebrew with dir="rtl".
4. Include a fully interactive RSVP form with:
   - Full Name input (שם מלא)
   - Phone Number input (טלפון נייד)
   - Number of seats selector (מספר מקומות מבוקש - 1, 2 זוגי, 3, 4)
   - Submit Button: "שמור לי מקום באולם" (Save my seat in the hall)
5. Include functional inline JavaScript (<script>):
   - When the user submits "שמור לי מקום באולם", intercept submit, prevent default.
   - Save to localStorage ('vip_rsvp_' + movieTitle) and POST to '/api/vip/rsvp' if available.
   - Dynamically replace the form with a gorgeous animated VIP Gold Reservation Pass showing:
     - Guest name
     - Phone number
     - Reserved VIP seats (e.g. VIP-A1, VIP-A2)
     - Success banner: "✨ מקומך באולם VIP שוריין בהצלחה!"
     - Dynamic barcode and ticket confirmation ID.
6. Add smooth CSS transitions and glow effects.`
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
