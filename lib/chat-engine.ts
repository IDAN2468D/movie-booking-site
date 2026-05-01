import { Movie } from '@/lib/tmdb';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'text' | 'movie_suggestion' | 'action_link';
  metadata?: any;
}

export const chatIntents = {
  RECOMMEND: 'recommend',
  BOOK: 'book',
  SHOWTIMES: 'showtimes',
  GREETING: 'greeting',
  UNKNOWN: 'unknown'
};

export function processMessage(message: string, movies: Movie[]) {
  const text = message.toLowerCase();
  
  // Simple NLP for Hebrew intents
  if (text.includes('היי') || text.includes('שלום') || text.includes('בוקר טוב')) {
    return {
      intent: chatIntents.GREETING,
      response: "שלום! אני העוזר החכם שלכם. איזה סרט תרצו לראות היום? 🍿"
    };
  }

  if (text.includes('המלץ') || text.includes('מה כדאי') || text.includes('סרט טוב')) {
    const randomMovies = [...movies].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      intent: chatIntents.RECOMMEND,
      response: "בטח! הנה כמה המלצות חמות בשבילך:",
      movies: randomMovies
    };
  }

  if (text.includes('להזמין') || text.includes('כרטיס') || text.includes('תשריין')) {
    return {
      intent: chatIntents.BOOK,
      response: "מעולה! בואו נתחיל בתהליך ההזמנה. איזה סרט תרצו להזמין?"
    };
  }

  return {
    intent: chatIntents.UNKNOWN,
    response: "מצטער, לא הבנתי. תוכל לנסות לשאול על המלצות לסרטים או איך להזמין כרטיסים? 😊"
  };
}
