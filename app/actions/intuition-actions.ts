'use server';

import { IntuitionQuerySchema, IntuitionQuery, IntuitionSearchResult } from '@/lib/validations/intuition';

export async function performIntuitionSearch(input: IntuitionQuery): Promise<{
  success: boolean;
  data?: IntuitionSearchResult[];
  error?: string;
}> {
  try {
    const validated = IntuitionQuerySchema.parse(input);

    const mockResults: IntuitionSearchResult[] = [
      {
        id: 'i1',
        movieTitle: 'בלאד ראנר 2049 (Blade Runner 2049)',
        metaphorMatch: `זיהוי מטפורי מבוסס עברית ל: "${validated.query}"`,
        sentimentGradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.4), rgba(147, 51, 234, 0.4))',
        confidence: 0.96,
      },
      {
        id: 'i2',
        movieTitle: 'מטריקס (The Matrix)',
        metaphorMatch: 'חוויה דיגיטלית של התעוררות למציאות מדומה',
        sentimentGradient: 'linear-gradient(135deg, rgba(0, 255, 163, 0.4), rgba(0, 100, 50, 0.4))',
        confidence: 0.89,
      },
      {
        id: 'i3',
        movieTitle: 'התחלה (Inception)',
        metaphorMatch: 'חדירה לשכבות חלום ותת-מודע קולקטיבי',
        sentimentGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(239, 68, 68, 0.4))',
        confidence: 0.84,
      },
    ];

    return { success: true, data: mockResults };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid query';
    return { success: false, error: message };
  }
}
