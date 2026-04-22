import { AIRequest, AIResponse, AIRecommendation } from '@/types/ai';

export async function generateRecommendations(data: AIRequest): Promise<AIResponse> {
  const { userProfile, movieDatabase, liveInventory } = data;
  const { preferences } = userProfile;
  const { requestedSeats, availability } = liveInventory;

  // 1. Scoring & Filtering
  const recommendations: AIRecommendation[] = [];
  
  // Heuristic: Filter movies that have at least one slot with enough seats
  for (const movieData of movieDatabase) {
    const movieAvailability = availability.find(a => a.movieId === movieData.title || a.movieId === movieData.title.toLowerCase().replace(/ /g, '_'));
    
    if (!movieAvailability) continue;

    // Constraint 1: Must have enough seats
    const validSlots = movieAvailability.slots.filter(s => s.seats >= requestedSeats);
    if (validSlots.length === 0) continue;

    // Scoring
    let score = 0;
    movieData.genre.forEach(g => {
      if (preferences.includes(g)) score += 10;
    });

    if (score > 0 || recommendations.length < 3) {
      // Constraint 2: Prioritize IMAX/4DX for Action/Sci-Fi
      const isActionSciFi = movieData.genre.some(g => ['פעולה', 'מדע בדיוני', 'סייברפאנק'].includes(g));
      let bestSlot = validSlots[0];
      
      if (isActionSciFi) {
        const premiumSlot = validSlots.find(s => s.format === 'IMAX' || s.format === '4DX');
        if (premiumSlot) bestSlot = premiumSlot;
      }

      const formatMap: Record<string, string> = {
        'IMAX': 'איימקס',
        '4DX': '4DX',
        'Standard': 'סטנדרטי'
      };

      const bestFormat = formatMap[bestSlot.format] || bestSlot.format;

      recommendations.push({
        movieId: movieData.title.toLowerCase().replace(/ /g, '_'),
        title: movieData.title,
        reason: `מתאים לעניין שלך ב-${movieData.genre.join(', ')}. ${isActionSciFi ? 'אופטימיזציה לחוויה חושית ברמה גבוהה.' : 'נבחר בזכות העומק הנרטיבי שלו.'}`,
        bestFormat: bestFormat,
        availabilityBadge: `נותרו ${bestSlot.seats} מושבים ל-${new Date(bestSlot.time).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        savingsTip: userProfile.subscriptionType === 'מנוי פרימיום' ? 'חינם עם מנוי ה-MovieBook שלך' : 'זכאי לזיכוי מוקדם של 2026'
      });
    }
  }

  // Final sort by score and limit to top 3
  const finalRecs = recommendations.slice(0, 3);

  return {
    recommendations: finalRecs,
    globalInsight: `מצאנו ${finalRecs.length} חוויות פרימיום המתאימות לפרופיל שלך. הערך הטוב ביותר היום הוא ${finalRecs[0]?.title || 'מהדורות רגילות'} עם ה-${userProfile.subscriptionType} שלך.`
  };
}
