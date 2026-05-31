import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

interface RPGTurn {
  role: 'user' | 'assistant';
  content: string;
}

interface RPGChoice {
  id: string;
  text: string;
}

interface RPGResponse {
  scenario: string;
  choices: RPGChoice[];
  pointsAwarded: number;
  isGameOver: boolean;
}

interface GeminiHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const { movieTitle, history = [] }: { movieTitle: string; history: RPGTurn[] } = await req.json();

    if (!movieTitle) {
      return NextResponse.json({ error: 'Movie title is required' }, { status: 400 });
    }

    const systemPrompt = `
      אתה ה-Game Master (שליט המבוך) של משחק תפקידים אינטראקטיבי מבוסס טקסט של אתר MovieBook.
      המשחק מתרחש ביקום הקולנועי של הסרט: "${movieTitle}".
      תפקידך לייצר סצנה קצרה, מותחת ומרהיבה בעברית (עד 3 משפטים) ולהציע למשתמש 3 בחירות מגוונות לפעולה הבאה שלו.

      חוקים נוקשים:
      1. המשך את הסיפור בצורה עקבית על בסיס היסטוריית המשחק (history).
      2. החזר אך ורק אובייקט JSON תקין ומובנה בעברית, ללא שום מילים נוספות מחוץ ל-JSON.
      3. אם המשתמש מגיע לסוף הסיפור או נכשל/מת, הגדר את isGameOver ל-true ותן סיכום יפה. אחרת, הוא false.
      4. הענק נקודות (pointsAwarded): תן 0 לרוב הסיבובים, ו-10 או 20 נקודות לקראת סוף הסיפור או על בחירה הירואית במיוחד.

      פורמט ה-JSON הנדרש:
      {
        "scenario": "תיאור הסצנה וההתרחשות בעברית (עד 3 משפטים)",
        "choices": [
          { "id": "1", "text": "אפשרות פעולה ראשונה (עד 6 מילים)" },
          { "id": "2", "text": "אפשרות פעולה שנייה (עד 6 מילים)" },
          { "id": "3", "text": "אפשרות פעולה שלישית (עד 6 מילים)" }
        ],
        "pointsAwarded": 0,
        "isGameOver": false
      }
    `;

    const modelNames = ['gemini-3.1-flash-lite-preview', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
    const { callGeminiWithRetry } = await import('@/lib/gemini');

    // Prepare chat history format for Gemini
    const formattedHistory: GeminiHistoryItem[] = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Ensure history starts with user and alternates
    const firstUserIndex = formattedHistory.findIndex((m) => m.role === 'user');
    let validHistory = firstUserIndex !== -1 ? formattedHistory.slice(firstUserIndex) : [];

    // Deduplicate consecutive roles
    validHistory = validHistory.filter((msg, i) => {
      if (i === 0) return true;
      return msg.role !== validHistory[i - 1].role;
    });

    const { text, modelUsed } = await callGeminiWithRetry(modelNames, async (model) => {
      const chatModel = genAI.getGenerativeModel({
        model: model.model,
        systemInstruction: systemPrompt,
      });

      // If we have history, start a chat session. Otherwise, generate content directly.
      if (validHistory.length > 0) {
        const lastMsg = validHistory[validHistory.length - 1];
        const chat = chatModel.startChat({
          history: validHistory.slice(0, -1),
        });
        const result = await chat.sendMessage(lastMsg.parts[0].text);
        return { text: result.response.text(), modelUsed: model.model };
      } else {
        const result = await chatModel.generateContent(`התחל את משחק התפקידים עבור הסרט ${movieTitle}`);
        return { text: result.response.text(), modelUsed: model.model };
      }
    });

    // Clean JSON
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(jsonStr) as RPGResponse;

    if (!parsedData || !parsedData.scenario) {
      throw new Error('Failed to parse Gemini RPG response');
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      model: modelUsed
    });

  } catch (error: any) {
    console.error('RPG Gemini API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to process RPG turn'
    }, { status: 500 });
  }
}
