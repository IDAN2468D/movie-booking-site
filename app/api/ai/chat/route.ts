import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function POST(req: NextRequest) {
  try {
    const { movieId, message } = await req.json();
    const q = message.toLowerCase();

    // 1. Handle "Hot Movies" / Recommendations
    if (q.includes('סרטים חמים') || q.includes('המלצה') || q.includes('hot movies')) {
      const res = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=he-IL&page=1`);
      const data = await res.json();
      const movies = data.results?.slice(0, 3).map((m: any) => m.title).join(', ');
      
      return NextResponse.json({ 
        success: true, 
        response: `כרגע הסרטים הכי חמים אצלנו הם: ${movies || 'דדפול & וולברין, הקול בראש 2'}. תרצה שאבדוק לך שעות הקרנה לאחד מהם?`
      });
    }

    // 2. Handle Specific Movie Context
    if (movieId || q.includes('דדפול') || q.includes('deadpool')) {
      const targetId = movieId || '533535'; // Deadpool & Wolverine ID
      const res = await fetch(`${TMDB_BASE_URL}/movie/${targetId}?api_key=${TMDB_API_KEY}&language=he-IL`);
      const movie = await res.json();
      
      if (q.includes('הזמן') || q.includes('book') || q.includes('כרטיס')) {
        return NextResponse.json({
          success: true,
          response: `בחירה מעולה! אני רואה שיש מקומות פנויים ל-${movie.title} להערב. כמה כרטיסים תרצה להזמין?`
        });
      }

      return NextResponse.json({ 
        success: true, 
        response: `על "${movie.title}": ${movie.overview?.substring(0, 150)}... נשמע מעניין?`
      });
    }

    // 3. Handle Food/Snacks
    if (q.includes('נשנושים') || q.includes('אוכל') || q.includes('פופקורן')) {
      return NextResponse.json({
        success: true,
        response: "המזנון שלנו פתוח! יש לנו פופקורן חם, נאצ'וס עם גבינה מותכת ושתייה קרה. להוסיף משהו להזמנה שלך?"
      });
    }

    // Default Fallback (More natural)
    return NextResponse.json({ 
      success: true, 
      response: "אני כאן לכל שאלה! תרצה המלצה על סרט, עזרה בהזמנה או אולי להזמין משהו מהמזנון?"
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}
