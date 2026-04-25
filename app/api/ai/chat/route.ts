import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function POST(req: NextRequest) {
  try {
    const { movieId, message, history = [] } = await req.json();

    // 1. Fetch Context (More movies for better coverage)
    const moviesRes = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=he-IL&page=1`);
    const moviesData = await moviesRes.json();
    const hotMovies = moviesData.results?.slice(0, 20).map((m: any) => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      rating: m.vote_average
    }));

    // 2. Fetch Specific Movie if requested
    let specificMovie = null;
    if (movieId) {
      const movieRes = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=he-IL`);
      specificMovie = await movieRes.json();
    }

    // 3. Initialize Gemini with systemInstruction for persistence
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-lite-preview',
      systemInstruction: `
        אתה הקונסיירז׳ הדיגיטלי של אתר MovieBook - אתר הזמנת סרטים יוקרתי.
        הזהות שלך: עוזר אישי (Concierge), מקצועי, ויוקרתי.
        
        חוקי ברזל (MANDATORY):
        1. **לעולם אל תפנה לאתרים חיצוניים** (סינמה סיטי, יס פלאנט וכו'). אל תיתן קישורים חיצוניים.
        2. **יכולת הזמנה**: בניגוד לבינה מלאכותית רגילה, לך **יש** יכולת להזמין כרטיסים! אתה עושה זאת על ידי שימוש בתגית: [ACTION:BOOK:MOVIE_ID].
        3. **אל תסרב להזמין**: אם המשתמש רוצה להזמין, אל תגיד "אני לא יכול". פשוט תפעיל את האשף עם התגית.
        
        פרוטוקול פעולה:
        - הזמנת כרטיס/רכישה: [ACTION:BOOK:ID]
        - הסבר למשתמש: "בשמחה! אני פותח לך כעת את מערכת ההזמנות היוקרתית שלנו כאן בצ'אט."
        
        הקשר סרטים:
        ${JSON.stringify(hotMovies)}
        ID: 533535 - דדפול & וולברין (Deadpool & Wolverine)
        ${specificMovie ? `סרט נוכחי: ${specificMovie.title} (ID: ${specificMovie.id})` : ''}
      `,
    });

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const firstUserIndex = formattedHistory.findIndex((m: any) => m.role === 'user');
    const validHistory = firstUserIndex !== -1 ? formattedHistory.slice(firstUserIndex) : [];

    const chat = model.startChat({
      history: validHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ 
      success: true, 
      response: responseText 
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    // Fallback to simpler logic if Gemini fails
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}
