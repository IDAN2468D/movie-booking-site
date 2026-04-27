import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { movieId, movieTitle, overview, genres } = await req.json();

    if (!movieTitle || !overview) {
      return NextResponse.json({ error: 'Missing movie data' }, { status: 400 });
    }

    const prompt = `
      אתה מומחה קולנוע ובינה מלאכותית של אתר MovieBook.
      נתח את הסרט הבא:
      כותרת: ${movieTitle}
      תקציר: ${overview}
      ז'אנרים: ${genres?.join(', ')}

      החזר תשובה בפורמט JSON בלבד:
      {
        "whyWatch": "הסבר קצר וקולע בעברית למה כדאי לצפות בסרט הזה (עד 2 משפטים)",
        "emotionalScore": מספר בין 1 ל-100 המייצג את עוצמת החוויה הרגשית/סגנונית,
        "aiStatus": "סטטוס קצר בעברית (למשל: 'ניתוח הושלם', 'עיבוד נתונים הסתיים')",
        "tags": ["3 תגיות בעברית עם # בתחילתן"]
      }
    `;

    let result;
    let usedModel = 'gemini-3.1-flash-lite-preview';

    try {
      // Primary attempt with 3.1 Flash Lite (requested by user)
      const targetModel = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });
      result = await targetModel.generateContent(prompt);
    } catch (e: any) {
      console.warn('Gemini 3.1 Flash Lite unavailable, trying stable 1.5 Flash...', e.message);
      try {
        // Fallback attempt with stable 1.5 Flash
        usedModel = 'gemini-1.5-flash';
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        result = await fallbackModel.generateContent(prompt);
      } catch (e2: any) {
        console.warn('Gemini 1.5 Flash also unavailable, trying 1.5 Pro...', e2.message);
        // Last resort fallback
        usedModel = 'gemini-1.5-pro';
        const lastResortModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        result = await lastResortModel.generateContent(prompt);
      }
    }

    const responseText = result.response.text();
    
    // Clean JSON if needed
    const jsonStr = responseText.replace(/```json|```/g, '').trim();
    const insights = JSON.parse(jsonStr);

    return NextResponse.json({ 
      success: true, 
      insights,
      model: usedModel
    });

  } catch (error) {
    console.error('AI Insights Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate insights' 
    }, { status: 500 });
  }
}
