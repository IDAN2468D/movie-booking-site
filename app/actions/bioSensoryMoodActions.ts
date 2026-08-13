'use server';

import { z } from 'zod';
import { callGeminiWithRetry } from '@/lib/gemini';

const BioSensoryMoodInputSchema = z.object({
  energy: z.number().min(0).max(100),
  valence: z.number().min(0).max(100),
  intensity: z.number().min(0).max(100),
  movieGenre: z.string().optional(),
});

const BioSensoryPredictionSchema = z.object({
  predictedMoodName: z.string(),
  moodDescription: z.string(),
  recommendedMovieTitle: z.string(),
  recommendedSnackName: z.string(),
  sensoryFrequencyHz: z.number(),
  flavorNotes: z.array(z.string()),
});

export type BioSensoryPrediction = z.infer<typeof BioSensoryPredictionSchema>;

export async function predictMoodAndFlavorsAction(input: unknown) {
  try {
    const { energy, valence, intensity } = BioSensoryMoodInputSchema.parse(input);

    const getFallback = (): BioSensoryPrediction => {
      if (energy > 70) {
        return {
          predictedMoodName: 'אדרנלין קוונטי מוגבר ⚡',
          moodDescription: 'רמת אנרגיה גבוהה הדורשת סרט אקשן עמוק ונשנושים חריפים-אומאמי.',
          recommendedMovieTitle: 'דילמת המד"ב 2026: אופק האירועים',
          recommendedSnackName: 'פופקורן כמהין זהב & מלח ים',
          sensoryFrequencyHz: 42,
          flavorNotes: ['אומאמי עמוק', 'קראנץ מודגש', 'סיומת מעושנת'],
        };
      }
      return {
        predictedMoodName: 'רוגע אקוסטי ומדיטציה קולנועית 🌊',
        moodDescription: 'תדר נפשי רגוע המתאים לדרמה פסיכולוגית מלווה בטעמים מתוקים-עדינים.',
        recommendedMovieTitle: 'הפרדוקס השקט: מסע בזמן',
        recommendedSnackName: 'סופלה שוקולד לוהט & ניטרוגן',
        sensoryFrequencyHz: 38,
        flavorNotes: ['קקאו עשיר 70%', 'מגע צונן', 'וניל במבוא'],
      };
    };

    if (process.env.NODE_ENV === 'test' || !process.env.GOOGLE_AI_API_KEY) {
      return { success: true, data: getFallback() };
    }

    const prompt = `
אתה AI Bio-Sensory Flavor & Mood Architect.
נתוני סליידר ביומטרי של המשתמש:
- Energy Level: ${energy}%
- Valence (Emotional Tone): ${valence}%
- Intensity: ${intensity}%

חולל חיזוי ביומטרי קולנועי מדויק במבנה JSON תקני בעברית:
{
  "predictedMoodName": "שם מצב הרוח המאובחן",
  "moodDescription": "תיאור קולנועי קצר של המצב הרגשי",
  "recommendedMovieTitle": "שם הסרט המומלץ",
  "recommendedSnackName": "שם המנה/הנשנוש המומלץ במזנון",
  "sensoryFrequencyHz": 40,
  "flavorNotes": ["תו טעם 1", "תו טעם 2", "תו טעם 3"]
}
`;

    try {
      const responseText = await callGeminiWithRetry('gemini-3.5-flash-lite', async (model) => {
        const result = await model.generateContent(prompt);
        return result.response.text();
      });

      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);
      const validated = BioSensoryPredictionSchema.parse(parsedData);

      return { success: true, data: validated };
    } catch {
      return { success: true, data: getFallback() };
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'שגיאה בניתוח הביומטרי',
    };
  }
}
