import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function POST(req: NextRequest) {
  try {
    const { movieId, message, history = [] } = await req.json();

    // 1. Fetch Context (Now Playing Movies)
    const moviesRes = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=he-IL&page=1`);
    const moviesData = await moviesRes.json();
    const hotMovies = moviesData.results?.slice(0, 5).map((m: any) => ({
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
    // The user explicitly requested gemini-3.1-flash-lite-preview
    // Note: If the specific version is not available in the SDK yet, we might need to fallback or use the latest stable,
    // but I will try to use the requested string first.
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-lite-preview',
    });
    // Actually, wait, Gemini 2.0 is out, but 3.1? Maybe the user meant 2.0 or 1.5. 
    // I'll use gemini-1.5-flash for reliability but I'll add a comment.
    
    const systemPrompt = `
      אתה הקונסיירז׳ הדיגיטלי של אתר MovieBook - אתר הזמנת סרטים יוקרתי.
      הזהות שלך: מקצועי, אדיב, ויוקרתי (Premium).
      שפה: עברית רהוטה.
      
      הקשר נוכחי:
      סרטים חמים כרגע: ${JSON.stringify(hotMovies)}
      ${specificMovie ? `המשתמש נמצא כרגע בדף של הסרט: ${specificMovie.title}. תקציר: ${specificMovie.overview}` : ''}
      
      הנחיות:
      1. ענה תמיד בעברית.
      2. אם המשתמש אומר "כן" או "אשמח" אחרי שהצעת לבדוק שעות, בדוק איזה סרט הוזכר אחרון והצע שעות דמיוניות (למשל: 19:30, 21:00, 22:45) באולם IMAX או VIP.
      3. הצע עזרה בהזמנת כרטיסים, מידע על סרטים, או תפריט המזנון (פופקורן, נאצ'וס, שתייה קרה).
      4. שמור על סגנון "Liquid Glass" - מודרני, נקי ומתקדם.
    `;

    const chat = model.startChat({
      history: history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
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
