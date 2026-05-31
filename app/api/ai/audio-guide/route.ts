import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { movieId, movieTitle, overview } = await req.json();

    if (!movieTitle || !overview) {
      return NextResponse.json({ error: 'Movie title and overview are required' }, { status: 400 });
    }

    const prompt = `
      אתה קריין רדיו וקולנוע מקצועי בעל קול עמוק, דרמטי וסוחף של אתר MovieBook.
      תפקידך לכתוב תסריט קריינות קצר, מרגש ומלא מתח (עד 35 מילים בעברית) עבור מדריך השמע הקולנועי (Audio Guide) של הסרט: "${movieTitle}".
      התסריט חייב לגרום למאזין לרצות לצפות בסרט מיד, עם משפטי מפתח דרמטיים.
      אל תכתוב הנחיות קריינות (כמו "מוזיקה דרמטית מתחילה" או בסוגריים), אלא אך ורק את הטקסט המדובר עצמו בעברית רהוטה ויוקרתית.
      
      תקציר הסרט לעזרתך: ${overview}
    `;

    const modelNames = ['gemini-3.1-flash-lite-preview', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const { text, modelUsed } = await callGeminiWithRetry(modelNames, async (model) => {
      const result = await model.generateContent(prompt);
      return { text: result.response.text(), modelUsed: model.model };
    });

    return NextResponse.json({
      success: true,
      script: text.trim(),
      model: modelUsed
    });

  } catch (error: any) {
    console.error('Audio Guide Gemini API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate audio script'
    }, { status: 500 });
  }
}
