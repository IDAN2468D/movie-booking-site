import { NextRequest, NextResponse } from 'next/server';

interface CharacterProfile {
  name: string;
  role: string;
  motivation: string;
  fatalFlaw: string;
  secretGoal: string;
  emotionalIntensity: number;
}

interface CharacterAnalysisResponse {
  characters: CharacterProfile[];
}

export async function POST(req: NextRequest) {
  let prompt = '';
  try {
    const { movieTitle, overview, genres } = await req.json();

    if (!movieTitle || !overview) {
      return NextResponse.json({ error: 'Movie title and overview are required' }, { status: 400 });
    }

    prompt = `
      אתה מומחה ניתוח נרטיבי ותסריטאות קולנועית של אתר MovieBook.
      נתח את הסרט הבא והפק פרופיל פסיכולוגי עמוק ומרהיב עבור 3 דמויות מפתח (ראשיות, משניות או ניגודים עלילתיים).
      כותרת הסרט: ${movieTitle}
      תקציר הסרט: ${overview}
      ז'אנרים: ${genres?.join(', ')}

      החזר אך ורק אובייקט JSON תקין ומובנה בעברית, ללא שום מילים נוספות מחוץ ל-JSON.

      פורמט ה-JSON הנדרש:
      {
        "characters": [
          {
            "name": "שם הדמות בעברית",
            "role": "תפקיד עלילתי קצר (למשל: הגיבור הטרגי, האנטגוניסט המניפולטיבי, המדריך השקט)",
            "motivation": "מה מניע את הדמות לפעול במהלך הסרט (עד 2 משפטים)",
            "fatalFlaw": "הפגם הטרגי או החולשה הפסיכולוגית של הדמות (משפט אחד)",
            "secretGoal": "השאיפה הסודית או המניע הנסתר שאינו גלוי בתחילת הסרט (משפט אחד)",
            "emotionalIntensity": מספר בין 1 ל-100 המייצג את מורכבותה הרגשית של הדמות
          }
        ]
      }
    `;

    const modelNames = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const { text, modelUsed } = await callGeminiWithRetry(modelNames, async (model) => {
      const result = await model.generateContent(prompt);
      return { text: result.response.text(), modelUsed: model.model };
    });

    // Clean JSON wrapper if model included it
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(jsonStr) as CharacterAnalysisResponse;

    if (!parsedData || !parsedData.characters) {
      throw new Error('Failed to parse Gemini character analysis response');
    }

    return NextResponse.json({
      success: true,
      characters: parsedData.characters,
      model: modelUsed
    });

  } catch (error: any) {
    console.error('Character analysis Gemini API Error:', error);

    // Ollama Fallback
    try {
      console.log('Falling back to local Ollama for character analysis...');
      const { callOllama, sanitizeAndParseJSON } = await import('@/lib/ollama');
      const response = await callOllama([
        { role: 'user', content: prompt }
      ], { jsonMode: true });
      
      if (response.success) {
        const parsedData = sanitizeAndParseJSON<CharacterAnalysisResponse>(response.content);
        if (parsedData && parsedData.characters) {
          return NextResponse.json({
            success: true,
            characters: parsedData.characters,
            model: `${response.model} (Ollama Fallback)`
          });
        }
      }
    } catch (ollamaErr) {
      console.error('Ollama fallback failed:', ollamaErr);
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate character profiles'
    }, { status: 500 });
  }
}
