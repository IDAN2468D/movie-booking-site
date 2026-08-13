'use server';

import { z } from 'zod';
import { callGeminiWithRetry } from '@/lib/gemini';

export const ScreenplayBranchInputSchema = z.object({
  movieTitle: z.string().min(1),
  divergencePoint: z.string().min(3),
  targetGenre: z.string().optional(),
});

export const SceneBranchNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  divergenceTone: z.string(),
  climaxPrediction: z.string(),
  characterFate: z.array(z.string()),
  choices: z.array(z.string()),
});

export type SceneBranchNode = z.infer<typeof SceneBranchNodeSchema>;

export async function generateScreenplayBranchAction(input: unknown) {
  try {
    const { movieTitle, divergencePoint, targetGenre } = ScreenplayBranchInputSchema.parse(input);

    const getFallback = (): SceneBranchNode => ({
      id: `branch_${Date.now()}`,
      title: `${movieTitle}: קו הזמן החלופי`,
      summary: `ברגע שבו התרחשה נקודת המפנה "${divergencePoint}", שרשרת האירועים המוכרת נשברה לחלוטין. במקום הסיום הידוע, הדמויות נאלצו להתמודד עם מציאות חדשה שבה כל בחירה הובילה לקונפליקט מועצם.`,
      divergenceTone: 'מותחן פסיכולוגי עתידני',
      climaxPrediction: 'עימות בלתי נמנע בשיא ההקרנה המשנה את גורל כל הדמויות.',
      characterFate: [
        'הדמות הראשית בוחרת בנתיב בלתי צפוי ומגלה בעל ברית חדש',
        'האנטגוניסט משיג יתרון טקטי שמשנה את מאזן הכוחות',
        'הקונפליקט המרכזי מגיע לפתרון דרמטי שלא נראה בסרט המקורי',
      ],
      choices: [
        'לחקור את התוצאות 5 שנים קדימה בעתיד',
        'לראות מה קרה מנקודת המבט של הנבל',
      ],
    });

    if (process.env.NODE_ENV === 'test' || !process.env.GOOGLE_AI_API_KEY) {
      return { success: true, data: getFallback() };
    }

    const prompt = `
אתה תסריטאי קולנוע ו-AI Creative Director מומחה.
הסרט המקורי: "${movieTitle}"
נקודת המפנה וההחלטה האלטרנטיבית: "${divergencePoint}"
${targetGenre ? `ז'אנר יעד מבוקש: ${targetGenre}` : ''}

צור תסריט אלטרנטיבי קולנועי מפורט (What-If Screenplay) במבנה JSON מדויק בעברית:
{
  "id": "branch_1",
  "title": "כותרת הסרט/הענף האלטרנטיבי",
  "summary": "תיאור קולנועי מרתק של התפתחות העלילה החדשה (3-4 פסקאות)",
  "divergenceTone": "אופי וטון העלילה",
  "climaxPrediction": "תיאור נקודת השיא והסיום הבלתי צפוי",
  "characterFate": ["גורל דמות ראשית...", "גורל דמות משנית...", "ההשלכות על העולם..."],
  "choices": ["בחירה להמשך עלילה א'", "בחירה להמשך עלילה ב'"]
}
`;

    try {
      const responseText = await callGeminiWithRetry('gemini-3.5-flash-lite', async (model) => {
        const result = await model.generateContent(prompt);
        return result.response.text();
      });

      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);
      const validated = SceneBranchNodeSchema.parse(parsedData);

      return { success: true, data: validated };
    } catch {
      return { success: true, data: getFallback() };
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'שגיאה ביצירת ענף התסריט',
    };
  }
}
