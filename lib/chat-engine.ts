import { Movie } from '@/lib/tmdb';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'text' | 'movie_suggestion' | 'action_link';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

export const chatIntents = {
  RECOMMEND: 'recommend',
  BOOK: 'book',
  SHOWTIMES: 'showtimes',
  GREETING: 'greeting',
  VIP: 'vip',
  FOOD: 'food',
  ACTION: 'action',
  COMEDY: 'comedy',
  MOOD: 'mood',
  UNKNOWN: 'unknown'
};

export function processMessage(message: string, movies: Movie[]) {
  const text = message.toLowerCase();
  
  // Greeting
  if (text.includes('היי') || text.includes('שלום') || text.includes('בוקר טוב')) {
    return {
      intent: chatIntents.GREETING,
      response: "שלום! אני העוזר החכם שלכם. איזה סרט תרצו לראות היום? 🍿"
    };
  }

  // Booking
  if (text.includes('להזמין') || text.includes('כרטיס') || text.includes('תשריין')) {
    return {
      intent: chatIntents.BOOK,
      response: "מעולה! בואו נתחיל בתהליך ההזמנה. הנה כמה סרטים שרצים עכשיו לבחירתך:",
      movies: [...movies].slice(0, 3)
    };
  }

  // Action Movies
  if (text.includes('פעולה') || text.includes('אקשן')) {
    const actionMovies = movies.filter(m => m.genre_ids?.includes(28) || m.overview?.includes('פעולה') || m.title?.includes('פעולה')).slice(0, 2);
    return {
      intent: chatIntents.ACTION,
      response: "אוהב אדרנלין? הנה סרטי הפעולה הכי חמים שלנו עכשיו:",
      movies: actionMovies.length > 0 ? actionMovies : [...movies].sort(() => 0.5 - Math.random()).slice(0, 2)
    };
  }

  // Comedy Movies
  if (text.includes('קומדי') || text.includes('מצחיק')) {
    const comedyMovies = movies.filter(m => m.genre_ids?.includes(35) || m.overview?.includes('קומד') || m.title?.includes('קומד')).slice(0, 2);
    return {
      intent: chatIntents.COMEDY,
      response: "בא לך לצחוק? הנה הקומדיות שחובה לראות עכשיו:",
      movies: comedyMovies.length > 0 ? comedyMovies : [...movies].sort(() => 0.5 - Math.random()).slice(0, 2)
    };
  }

  // General Recommendation / What's new
  if (text.includes('המלץ') || text.includes('מה כדאי') || text.includes('סרט טוב') || text.includes('חדש') || text.includes('מוקרן היום')) {
    const randomMovies = [...movies].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      intent: chatIntents.RECOMMEND,
      response: "בטח! הנה כמה סרטים מומלצים וחמים במיוחד בשבילך:",
      movies: randomMovies
    };
  }

  // VIP Club
  if (text.includes('vip') || text.includes('מועדון') || text.includes('וי איי פי')) {
    return {
      intent: chatIntents.VIP,
      response: "מועדון ה-VIP שלנו מעניק לך חוויה קולנועית שאין כמותה! כורסאות עור מתכווננות, תפריט שף אישי ללא הגבלה, ואווירה יוקרתית. לחץ על 'מועדון VIP' בתפריט הצדדי לפרטים ולהצטרפות."
    };
  }

  // Food and Beverage
  if (text.includes('מזנון') || text.includes('אוכל') || text.includes('פופקורן') || text.includes('שתייה')) {
    return {
      intent: chatIntents.FOOD,
      response: "במזנון שלנו תמצאו פופקורן קראנצ'י, נאצ'וס עם גבינה חמה, שתייה קלה וברד במגוון טעמים! תוכלו להזמין מראש דרך האפליקציה ולאסוף בלי תור."
    };
  }
  
  // Mood Matcher
  if (text.includes('מצב רוח') || text.includes('התאם')) {
    return {
      intent: chatIntents.MOOD,
      response: "אני יכול להתאים לך סרט במיוחד למצב הרוח שלך! נסה את פיצ'ר ה-'Movie Matcher' שלנו (כמו טינדר לסרטים) ותגלה מה מושלם עבורך היום. ⚡"
    };
  }

  return {
    intent: chatIntents.UNKNOWN,
    response: "מצטער, לא הבנתי את בקשתך במדויק. תוכל לנסות ללחוץ על אחת מהפעולות המהירות למטה, או לשאול על המלצות לסרטים, VIP, והזמנת כרטיסים? 😊"
  };
}
