import { NextRequest, NextResponse } from 'next/server';


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

    const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.1-flash-lite-preview', 'gemini-1.5-flash-latest'];
    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const { text, modelUsed } = await callGeminiWithRetry(modelNames, async (model) => {
      const result = await model.generateContent(prompt);
      return { text: result.response.text(), modelUsed: model.model };
    });

    // Clean JSON if needed
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const insights = JSON.parse(jsonStr);

    return NextResponse.json({
      success: true,
      insights,
      model: modelUsed
    });

  } catch (error) {
    console.error('AI Insights Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate insights'
    }, { status: 500 });
  }
}
