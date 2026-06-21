import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    // Extract mime type and base64 data
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ success: false, error: 'Invalid image format' }, { status: 400 });
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];

    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const resultData = await callGeminiWithRetry(['gemini-2.5-flash', 'gemini-1.5-flash-latest'], async (model) => {
      const generativeModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: `אתה אוצר קולנועי מומחה למציאת ה-"Vibe" המדויק. המשתמש מעלה תמונה של הסביבה שלו, ואתה מנתח את האווירה, התאורה, הצבעים ותחושת המקום. לאחר הניתוח, אתה ממליץ על ז'אנר ולפחות סרט אחד שמשדר בדיוק את אותה האווירה. התשובה שלך צריכה להיות פיוטית, תיאורית, עשירה ומעוררת השראה, בעברית בלבד. עצב את התשובה עם כותרות ורשימות מרקדאון.`
      });

      const result = await generativeModel.generateContent([
        "נתח את האווירה שבתמונה הזו והמלץ על סרט שמתאים בדיוק לאותו Vibe.",
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]);
      
      return { text: result.response.text(), modelName: model.model };
    });

    return NextResponse.json({ success: true, recommendation: resultData.text });
  } catch (error: any) {
    console.error('Vibe Matcher Error:', error);
    // Ollama llava fallback could be added here if available locally
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
