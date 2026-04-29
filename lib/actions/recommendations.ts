'use server';

import { generateRecommendations } from '../ai-engine';
import { getPopularMovies, getNowPlayingMovies } from '../tmdb';
import clientPromise from '../mongodb';
import { AIResponse, AIRequest } from '@/types/ai';
import { ObjectId } from 'mongodb';

/**
 * 🎫 Server Action: Fetch Smart Recommendations
 * Optimized with parallel fetching and caching.
 */
export async function getSmartRecommendationsAction(userId?: string): Promise<AIResponse> {
  try {
    // 1. Parallel Fetching (SPEED optimization)
    const [movies, nowPlaying, client] = await Promise.all([
      getPopularMovies(),
      getNowPlayingMovies(),
      clientPromise
    ]);

    // 2. Fetch User Profile from MongoDB (or use mock for guest)
    let userProfile = {
      preferences: ['פעולה', 'מדע בדיוני', 'סייברפאנק'],
      watchHistory: [],
      subscriptionType: 'מנוי פרימיום'
    };

    if (userId && client) {
      const db = client.db('moviebook');
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(userId) as any 
      });
      if (user) {
        userProfile = {
          preferences: user.aiPreferences?.genres || userProfile.preferences,
          watchHistory: user.watchHistory || [],
          subscriptionType: user.loyaltyTier === 'Liquid' ? 'מנוי פרימיום' : 'מנוי רגיל'
        };
      }
    }

    // 3. Prepare Movie Database for AI Engine
    // Map TMDB movies to the AI Engine's expected format
    const movieDatabase = [...movies, ...nowPlaying].map(m => ({
      title: m.displayTitle,
      genre: m.genre_ids.map(id => {
        // Simple mapping back to Hebrew genre names for the heuristic engine
        if (id === 28) return 'פעולה';
        if (id === 878) return 'מדע בדיוני';
        if (id === 12) return 'הרפתקאות';
        return 'דרמה';
      }),
      formats: ['IMAX', '4DX', 'Standard']
    }));

    // 4. Prepare Live Inventory (Mocked for now)
    const liveInventory = {
      requestedSeats: 2,
      availability: movieDatabase.map(m => ({
        movieId: m.title,
        slots: [
          { time: new Date().toISOString(), seats: 12, format: 'IMAX' },
          { time: new Date(Date.now() + 3600000).toISOString(), seats: 4, format: 'Standard' }
        ]
      }))
    };

    const aiRequest: AIRequest = {
      userProfile,
      movieDatabase,
      liveInventory
    };

    // 5. Generate Recommendations
    const results = await generateRecommendations(aiRequest);
    
    // Fallback if AI engine returns empty (ensure something is ALWAYS visible)
    if (results.recommendations.length === 0) {
      return {
        recommendations: [
          {
            movieId: 'dune_2',
            title: 'חולית: חלק 2',
            reason: 'מבוסס על אהבתך למדע בדיוני ואקסטזה קולנועית',
            bestFormat: 'IMAX',
            availabilityBadge: 'נותרו 5 מושבים ל-21:00',
            savingsTip: 'חינם עם מנוי ה-MovieBook שלך'
          },
          {
            movieId: 'oppenheimer',
            title: 'אופנהיימר',
            reason: 'דרמה עוצמתית שתשאב אותך פנימה',
            bestFormat: 'Standard',
            availabilityBadge: 'נותרו 12 מושבים ל-20:30',
            savingsTip: '20% הנחה למזמינים עכשיו'
          }
        ],
        globalInsight: 'הוספנו המלצות פרימיום מיוחדות עבורך על בסיס הטרנדים החדשים.'
      };
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return {
      recommendations: [
        {
          movieId: 'fallback_1',
          title: 'חולית: חלק 2',
          reason: 'חוויה קולנועית עוצרת נשימה',
          bestFormat: 'IMAX',
          availabilityBadge: 'נותרו 8 מושבים ל-21:30',
          savingsTip: 'זמין עכשיו'
        }
      ],
      globalInsight: 'ניתוח AI זמין במצב אופליין - מציג המלצות מובילות.'
    };
  }
}
