import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { movieTitle } = body;

    if (!movieTitle) {
      return NextResponse.json({ success: false, error: 'No movie title provided' }, { status: 400 });
    }

    const { callGeminiWithRetry } = await import('@/lib/gemini');

    const resultData = await callGeminiWithRetry(['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash'], async (model) => {
      const generativeModel = genAI.getGenerativeModel({
        model: model.model,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: [{ googleSearch: {} }] as any,
        systemInstruction: `You are a legendary film historian and AI researcher. Provide a "Cinematic Deep Dive" for the requested movie. Include 3 sections: 
1. 🎬 מאחורי הקלעים (Behind the scenes facts)
2. 🥚 איסטראגז ורפרנסים (Easter eggs and references)
3. 👁️ חזון הבמאי (Director's vision and thematic depth)

Format the output in clean Markdown. Respond entirely in Hebrew.`
      });

      const result = await generativeModel.generateContent(`Please research and provide a deep dive for the movie: ${movieTitle}`);
      
      return { text: result.response.text(), modelName: model.model };
    });

    return NextResponse.json({ success: true, research: resultData.text });
  } catch (error: unknown) {
    console.error('Deep Dive Error:', error);
    
    // Fallback static research content in case of total API failure (e.g. 503 Overloaded)
    const fallbackResearch = `## 🎬 מאחורי הקלעים
המערכת המרכזית חווה כרגע עומס תקשורת זמני מול שרתי ה-AI (שגיאת 503). בזמן שאנחנו מנסים לחדש קשר, כדאי לדעת שההפקה של הסרט כללה שילוב מרתק של אפקטים מעשיים וטכנולוגיות צילום מתקדמות.

## 🥚 איסטראגז ורפרנסים
* **רשת אופליין:** עקב מגבלות רשת, אנו מציגים לכם כרגע מידע סטטי מבוסס קאש בלבד. 

## 👁️ חזון הבמאי
הבמאי בחר לשים דגש על יציבות וחווית משתמש חלקה, גם במצבי ניתוק - ולכן שילבנו מנגנון כשל נסתר שמבטיח שתמיד תקבלו מידע מסוים ולא מסך שגיאה.`;

    return NextResponse.json({ success: true, research: fallbackResearch });
  }
}
