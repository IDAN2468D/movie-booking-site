import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let prompt = '';
  try {
    const { movieTitle, overview } = await req.json();

    if (!movieTitle || !overview) {
      return NextResponse.json({ error: 'Movie title and overview are required' }, { status: 400 });
    }

    prompt = `
      אתה קריין רדיו וקולנוע מקצועי בעל קול עמוק, דרמטי וסוחף של אתר MovieBook.
      תפקידך לכתוב תסריט קריינות קצר, מרגש ומלא מתח (עד 35 מילים בעברית) עבור מדריך השמע הקולנועי (Audio Guide) של הסרט: "${movieTitle}".
      התסריט חייב לגרום למאזין לרצות לצפות בסרט מיד, עם משפטי מפתח דרמטיים.
      אל תכתוב הנחיות קריינות (כמו "מוזיקה דרמטית מתחילה" או בסוגריים), אלא אך ורק את הטקסט המדובר עצמו בעברית רהוטה ויוקרתית.
      
      תקציר הסרט לעזרתך: ${overview}
    `;

    const modelNames = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
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

  } catch (error: unknown) {
    console.error('Audio Guide Gemini API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate audio script';

    // Ollama Fallback
    try {
      console.log('Falling back to local Ollama for audio-guide...');
      const { callOllama } = await import('@/lib/ollama');
      const response = await callOllama([
        { role: 'user', content: prompt }
      ]);
      if (response.success) {
        return NextResponse.json({
          success: true,
          script: response.content.trim(),
          model: `${response.model} (Ollama Fallback)`
        });
      }
    } catch (ollamaErr) {
      console.error('Ollama fallback failed:', ollamaErr);
    }

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
