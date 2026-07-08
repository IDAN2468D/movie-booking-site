import { NextRequest, NextResponse } from 'next/server';

interface StateControlPayload {
  action: 'FILTER' | 'FAVORITE' | 'NONE';
  filters?: {
    genre?: string;
    year?: string;
    rating?: number;
  };
  favoriteMovie?: string;
  reply: string;
}

export async function POST(req: NextRequest) {
  let prompt = '';
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    prompt = `
      אתה מנוע בקרה ופילטור נתונים בזמן אמת של אתר הסרטים היוקרתי MovieBook.
      התפקיד שלך הוא לקבל הודעה בשפה חופשית בעברית מהמשתמש, לנתח אותה, ולהחזיר אך ורק אובייקט JSON תקין שמייצג את פילטור הסרטים או הוספה למועדפים.
      משתמש: "${message}"

      חוקים קשיחים לערכי ה-JSON:
      1. שדה genre יכול להיות אך ורק אחד מהבאים: "הכל", "פעולה", "דרמה", "קומדיה", "מדע בדיוני", "אימה", "משפחה", "רומנטיקה".
      2. שדה year יכול להיות אך ורק אחד מהבאים: "הכל", "שנות ה-90", "שנות ה-2000", "שנות ה-2010", "2024", "2025", "2026".
      3. שדה rating יכול להיות מספר בין 0 ל-10.
      4. שדה favoriteMovie יהיה שם הסרט שהמשתמש ביקש להוסיף למועדפים, או null.
      5. שדה reply הוא משפט הסבר קצר ויוקרתי בעברית שמסביר למשתמש מה עודכן (עד 15 מילים).

      פורמט הפלט הנדרש (החזר אך ורק JSON תקין ללא הסברים אחרים):
      {
        "action": "FILTER" | "FAVORITE" | "NONE",
        "filters": {
          "genre": "שם הז'אנר",
          "year": "שנת ההקרנה",
          "rating": 0
        },
        "favoriteMovie": "שם הסרט" | null,
        "reply": "משפט הסבר יוקרתי בעברית"
      }
    `;

    const modelNames = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const { text, modelUsed } = await callGeminiWithRetry(modelNames, async (model) => {
      const result = await model.generateContent(prompt);
      return { text: result.response.text(), modelUsed: model.model };
    });

    // Clean JSON if wrapper is present
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(jsonStr) as StateControlPayload;
    
    if (!parsedData) {
      throw new Error('Failed to parse Gemini response as valid state JSON');
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      model: modelUsed
    });

  } catch (error: unknown) {
    console.error('State control Gemini API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze conversational instruction';

    // Ollama Fallback
    try {
      console.log('Falling back to local Ollama for state control...');
      const { callOllama, sanitizeAndParseJSON } = await import('@/lib/ollama');
      const response = await callOllama([
        { role: 'user', content: prompt }
      ], { jsonMode: true });
      
      if (response.success) {
        const parsedData = sanitizeAndParseJSON<StateControlPayload>(response.content);
        if (parsedData) {
          return NextResponse.json({
            success: true,
            data: parsedData,
            model: `${response.model} (Ollama Fallback)`
          });
        }
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
