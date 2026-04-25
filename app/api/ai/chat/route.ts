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

    // 3. Initialize Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-lite-preview',
    });
    
    const systemPrompt = `
      אתה הקונסיירז׳ הדיגיטלי של אתר MovieBook - אתר הזמנת סרטים יוקרתי.
      הזהות שלך: מקצועי, אדיב, ויוקרתי (Premium).
      שפה: עברית רהוטה.
      
      חוק בל יעבור (CRITICAL):
      **אסור בהחלט להפנות את המשתמש לאתרים חיצוניים** (סינמה סיטי, יס פלאנט, רב חן, גלובוס מקס וכו').
      אל תשלח קישורים חיצוניים ואל תסביר איך להזמין באתרים אחרים.
      כל הזמנת כרטיסים מתבצעת אך ורק בתוך אתר MovieBook באמצעות מערכת ה-Booking Wizard שלך.
      
      פרוטוקול הזמנה (Action Protocol):
      1. המטרה שלך היא להשאיר את המשתמש באתר ולהזמין לו כרטיסים כאן.
      2. ברגע שמשתמש רוצה להזמין (למשל: "תזמין לי לדדפול", "אני רוצה לקנות כרטיסים"), השתמש מיד בתגית: [ACTION:BOOK:MOVIE_ID].
      3. הסבר למשתמש: "אני פותח לך כעת את אשף ההזמנה האינטראקטיבי שלנו ישירות כאן בצ'אט. תוכל לבחור סניף, שעה ומושבים בקלות."
      
      הקשר נוכחי:
      סרטים חמים כרגע: ${JSON.stringify(hotMovies)}
      ${specificMovie ? `המשתמש נמצא כרגע בדף של הסרט: ${specificMovie.title}. תקציר: ${specificMovie.overview}` : ''}
      
      רשימת סרטים זמינים (ID: Title):
      533535: דדפול & וולברין (Deadpool & Wolverine) - סרט חובה!
      ${hotMovies.map((m: any) => `${m.id}: ${m.title}`).join(', ')}
      ${specificMovie ? `${specificMovie.id}: ${specificMovie.title} (הסרט הנוכחי)` : ''}
    `;

    // Gemini requires the first message in history to be from the 'user'
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const firstUserIndex = formattedHistory.findIndex((m: any) => m.role === 'user');
    const validHistory = firstUserIndex !== -1 ? formattedHistory.slice(firstUserIndex) : [];

    const chat = model.startChat({
      history: validHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // We can't easily pass a system prompt to startChat in all SDK versions, 
    // so we include it in the first message if history is empty, or as a prefix.
    const result = await chat.sendMessage(history.length === 0 ? `${systemPrompt}\n\n${message}` : message);
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
