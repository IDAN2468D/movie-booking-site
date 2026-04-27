import { AIRequest, AIResponse, AIRecommendation } from '@/types/ai';
import { getRecommendations, getSimilarMovies } from './tmdb';

/**
 * 🚀 Smart Recommendation Engine (v2.0)
 * Hybrid Filtering: Content + Collaborative + Availability
 */
export async function generateRecommendations(data: AIRequest): Promise<AIResponse> {
  const { userProfile, movieDatabase, liveInventory } = data;
  const { preferences, watchHistory } = userProfile;
  const { requestedSeats, availability } = liveInventory;

  // 1. Scoring & Weighting System
  const recommendations: (AIRecommendation & { score: number })[] = [];
  
  // Parallel fetch for external similarity signals if history exists
  // For now, we simulate this by processing the movieDatabase with higher weights
  
  for (const movieData of movieDatabase) {
    const movieId = movieData.title.toLowerCase().replace(/ /g, '_');
    const movieAvailability = availability.find(a => a.movieId === movieData.title || a.movieId === movieId);
    
    if (!movieAvailability) continue;

    const validSlots = movieAvailability.slots.filter(s => s.seats >= requestedSeats);
    if (validSlots.length === 0) continue;

    let score = 0;
    let reasons: string[] = [];

    // Signal 1: Genre Match (Weight: High)
    const matchedGenres = movieData.genre.filter(g => preferences.includes(g));
    if (matchedGenres.length > 0) {
      score += matchedGenres.length * 15;
      reasons.push(`מתאים לאהבה שלך ל-${matchedGenres.join(', ')}`);
    }

    // Signal 2: History Match (Weight: Very High)
    // If movie title or similar keywords are in history
    if (watchHistory.some(h => movieData.title.includes(h) || h.includes(movieData.title))) {
      score += 50;
      reasons.push('מבוסס על סרטים שאהבת בעבר');
    }

    // Signal 3: Premium Format Optimization
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

  // Final sort by score and limit to top 3
  const finalRecs = recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...rest }) => rest);

  return {
    recommendations: finalRecs,
    globalInsight: `מצאנו ${finalRecs.length} חוויות פרימיום המתאימות לפרופיל שלך. הערך הטוב ביותר היום הוא ${finalRecs[0]?.title || 'מהדורות רגילות'} עם ה-${userProfile.subscriptionType} שלך.`
  };
}
