import { AIRequest, AIResponse, AIRecommendation } from '@/types/ai';

const MOOD_GENRE_MAP: Record<string, number[]> = {
  'melancholic': [18, 99], // Drama, Documentary
  'adrenaline': [28, 12, 53], // Action, Adventure, Thriller
  'romantic': [10749, 18], // Romance, Drama
  'laugh': [35, 16], // Comedy, Animation
  'scary': [27, 9648], // Horror, Mystery
  'futuristic': [878], // Sci-Fi
  'family': [10751, 16], // Family, Animation
};

/**
 * 🚀 Smart Recommendation Engine (v3.0)
 * Hybrid Filtering: Content + Collaborative + Emotional Mood
 */
export async function generateRecommendations(data: AIRequest & { mood?: string }): Promise<AIResponse> {
  const { userProfile, movieDatabase, liveInventory, mood } = data;
  const { preferences, watchHistory } = userProfile;
  const { requestedSeats, availability } = liveInventory;

  const recommendations: (AIRecommendation & { score: number })[] = [];
  
  for (const movieData of movieDatabase) {
    const movieId = movieData.title.toLowerCase().replace(/ /g, '_');
    const movieAvailability = availability.find(a => a.movieId === movieData.title || a.movieId === movieId);
    
    if (!movieAvailability) continue;

    const validSlots = movieAvailability.slots.filter(s => s.seats >= requestedSeats);
    if (validSlots.length === 0) continue;

    let score = 0;
    const reasons: string[] = [];

    // Signal 1: Mood Match (Weight: Ultra High)
    if (mood && MOOD_GENRE_MAP[mood]) {
      const moodGenres = MOOD_GENRE_MAP[mood];
      const hasMoodMatch = movieData.genre.some(g => {
        const genreId = Object.entries(require('./tmdb').GENRE_MAP).find(([k]) => k === g)?.[1];
        return genreId && moodGenres.includes(genreId as number);
      });
      if (hasMoodMatch) {
        score += 60;
        reasons.push(`מתאים בדיוק למצב הרוח שלך (${mood})`);
      }
    }

    // Signal 2: Genre Match (Weight: High)
    const matchedGenres = movieData.genre.filter(g => preferences.includes(g));
    if (matchedGenres.length > 0) {
      score += matchedGenres.length * 15;
      reasons.push(`מתאים לאהבה שלך ל-${matchedGenres.join(', ')}`);
    }

    // Signal 3: History Match (Weight: Very High)
    if (watchHistory.some(h => movieData.title.includes(h) || h.includes(movieData.title))) {
      score += 50;
      reasons.push('מבוסס על סרטים שאהבת בעבר');
    }

    // Signal 4: Premium Format Optimization
    const isActionSciFi = movieData.genre.some(g => ['פעולה', 'מדע בדיוני', 'סייברפאנק'].includes(g));
    let bestSlot = validSlots[0];
    
    if (isActionSciFi) {
      const premiumSlot = validSlots.find(s => s.format === 'IMAX' || s.format === '4DX');
      if (premiumSlot) {
        bestSlot = premiumSlot;
        score += 20;
        reasons.push('חוויית פרימיום אופטימלית');
      }
    }

    if (score > 0 || recommendations.length < 3) {
      const formatMap: Record<string, string> = {
        'IMAX': 'איימקס',
        '4DX': '4DX',
        'Standard': 'סטנדרטי'
      };

      recommendations.push({
        movieId,
        title: movieData.title,
        reason: reasons.length > 0 ? reasons[0] : 'נבחר בזכות העומק הנרטיבי שלו',
        bestFormat: formatMap[bestSlot.format] || bestSlot.format,
        availabilityBadge: `נותרו ${bestSlot.seats} מושבים ל-${new Date(bestSlot.time).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        savingsTip: userProfile.subscriptionType === 'מנוי פרימיום' ? 'חינם עם מנוי ה-MovieBook שלך' : 'זכאי לזיכוי מוקדם של 2026',
        score
      });
    }
  }

  const finalRecs = recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...rest }) => rest);

  return {
    recommendations: finalRecs,
    globalInsight: mood 
      ? `מצאנו ${finalRecs.length} סרטים שמתאימים למצב הרוח שלך. תהנה מהצפייה!`
      : `מצאנו ${finalRecs.length} חוויות פרימיום המתאימות לפרופיל שלך. הערך הטוב ביותר היום הוא ${finalRecs[0]?.title || 'מהדורות רגילות'} עם ה-${userProfile.subscriptionType} שלך.`
  };
}
