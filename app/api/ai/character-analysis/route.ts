import { NextRequest, NextResponse } from 'next/server';
import { SchemaType } from '@google/generative-ai';

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
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    const { movieTitle, overview, genres } = body;

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

    // Upgraded to Gemini 3.1 Flash Lite to avoid 2.5-flash quota limits and improve speed
    const modelNames = ['gemini-3.5-flash-lite', 'gemini-3.5-flash'];
    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const { text, modelUsed } = await callGeminiWithRetry(modelNames, async (model) => {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { 
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              characters: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    name: { type: SchemaType.STRING },
                    role: { type: SchemaType.STRING },
                    motivation: { type: SchemaType.STRING },
                    fatalFlaw: { type: SchemaType.STRING },
                    secretGoal: { type: SchemaType.STRING },
                    emotionalIntensity: { type: SchemaType.INTEGER }
                  },
                  required: ["name", "role", "motivation", "fatalFlaw", "secretGoal", "emotionalIntensity"]
                }
              }
            },
            required: ["characters"]
          }
        }
      });
      return { text: result.response.text(), modelUsed: model.model };
    });

    // Extract JSON block aggressively in case the model wraps it with text
    let jsonStr = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    // Clean JSON wrapper if model included it
    jsonStr = jsonStr.replace(/```json|```/g, '').trim();
    
    const parsedData = JSON.parse(jsonStr) as CharacterAnalysisResponse;

    if (!parsedData || !parsedData.characters) {
      throw new Error('Failed to parse Gemini character analysis response');
    }

    return NextResponse.json({
      success: true,
      characters: parsedData.characters,
      model: modelUsed
    });

  } catch (error: unknown) {
    console.error('Character analysis Gemini API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate character profiles';

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
