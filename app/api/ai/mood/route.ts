import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    // Extract base64 data
    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ success: false, error: 'Invalid image format' }, { status: 400 });
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];

    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const resultData = await callGeminiWithRetry(['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'], async (model) => {
      const generativeModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: `You are an expert cinematic psychologist. Analyze the user's face expression and mood in the image.
Based on their mood, return a JSON response containing:
1. "mood": A 2-3 word description of their detected mood in Hebrew (e.g. "נרגש ושמח", "עייף אך רגוע", "מתוח ומרוכז").
2. "analysis": A short 1-2 sentence explanation of why you detected this mood (in Hebrew).
3. "genre": The suggested movie genre in Hebrew.
4. "snackRecommendation": A creative gourmet snack and beverage pairing matching their mood in Hebrew (e.g. "פופקורן מלוח-מתוק עם שוקולד מריר ובירת שורשים צוננת", "פלטת גבינות מעודנת עם יין אדום יבש").

Return ONLY valid raw JSON. Do NOT wrap in \`\`\`json or markdown code blocks.`
      });

      const result = await generativeModel.generateContent([
        "Analyze this selfie to detect my mood and recommend the perfect movie genre and custom cinematic snack pairing. Response must be JSON.",
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]);
      
      let text = result.response.text();
      // Clean up markdown block if present
      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return { text, modelName: model.model };
    });

    try {
      const parsed = JSON.parse(resultData.text);
      return NextResponse.json({ 
        success: true, 
        mood: parsed.mood,
        analysis: parsed.analysis,
        genre: parsed.genre,
        snackRecommendation: parsed.snackRecommendation,
        model: resultData.modelName
      });
    } catch (parseError) {
      console.warn("Gemini didn't return valid JSON, returning plain text fallback:", resultData.text, parseError);
      return NextResponse.json({
        success: true,
        mood: "מצב רוח מורכב",
        analysis: "ה-AI זיהה מנעד רחב של רגשות בפניך.",
        genre: "דרמה / מתח",
        snackRecommendation: "פופקורן קלאסי עם חמאה מומסת ומשקה מוגז קר",
        raw: resultData.text
      });
    }

  } catch (error: unknown) {
    console.error('Mood Analyzer Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze mood';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
