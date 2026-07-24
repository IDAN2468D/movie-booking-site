'use server';

import { MoodSchema, MoodInput, MoodRecommendation } from '@/lib/validations/mood';

export async function getMoodBasedRecommendations(input: MoodInput): Promise<{
  success: boolean;
  data?: MoodRecommendation[];
  error?: string;
}> {
  try {
    const validated = MoodSchema.parse(input);
    
    // Mock neural semantic filtering based on valence and arousal
    const recommendations: MoodRecommendation[] = [
      {
        id: 'm1',
        title: 'בלאד ראנר 2049 (Blade Runner 2049)',
        genre: 'סייברפאנק / ניאו-נואר',
        matchScore: Math.round((validated.valence * 0.4 + validated.arousal * 0.6) * 100),
        refractionColor: 'rgba(0, 240, 255, 0.4)',
        description: 'חוויה ויזואלית עמוקה בסביבת זכוכית נוזלית ניאונית.',
      },
      {
        id: 'm2',
        title: 'בינכוכבי (Interstellar)',
        genre: 'מדע בדיוני קוסמי',
        matchScore: Math.round((validated.valence * 0.7 + validated.arousal * 0.3) * 100),
        refractionColor: 'rgba(147, 51, 234, 0.4)',
        description: 'מסע חלל תדרים אקוסטיים בתוך חור תולעת מרחבי.',
      },
      {
        id: 'm3',
        title: 'דיונה: חלק שני (Dune: Part Two)',
        genre: 'אפוס קולנועי',
        matchScore: Math.round((validated.valence * 0.5 + validated.arousal * 0.5) * 100),
        refractionColor: 'rgba(245, 158, 11, 0.4)',
        description: 'תדר סאב-באס נמוך בעוצמה גבוהה במדבר הקוונטי.',
      },
    ];

    return { success: true, data: recommendations };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid mood input';
    return { success: false, error: message };
  }
}
