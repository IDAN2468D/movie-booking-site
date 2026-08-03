import { callGeminiWithRetry } from '../gemini';

export interface StoryBranchOption {
  id: string;
  titleHe: string;
  descriptionHe: string;
  predictedOutcomeHe: string;
  audioCommentaryUrl?: string;
  votes: number;
}

export interface StoryBranchResponse {
  branches: StoryBranchOption[];
  directorNoteHe: string;
  audioTheme: 'cyberpunk' | 'suspense' | 'triumphant' | 'noir';
}

export async function generateStoryBranches(
  movieId: string,
  sceneDescription: string,
  currentTimestamp: number
): Promise<StoryBranchResponse> {
  const prompt = `אתה תסריטאי ומנהל קולנוע אינטראקטיבי AI ב-CinePulse.
סרט ID: ${movieId}
תיאור סצנה נוכחית: ${sceneDescription}
זמן בשניות: ${currentTimestamp}

צור 3 אפשרויות הסתעפות עלילתית ("What-If") מרתקות בעברית.
החזר תגובת JSON תקנית במבנה הבא:
{
  "branches": [
    {
      "id": "b1",
      "titleHe": "כותרת קצרה בעברית",
      "descriptionHe": "תיאור ההסתעפות העלילתית",
      "predictedOutcomeHe": "תוצאה צפויה"
    }
  ],
  "directorNoteHe": "הערת במאי AI בעברית על כיוון העלילה",
  "audioTheme": "suspense"
}`;

  try {
    const resultText = await callGeminiWithRetry(
      ['gemini-3.5-flash-lite', 'gemini-1.5-flash', 'gemini-pro'],
      async (model) => {
        const res = await model.generateContent(prompt);
        return res.response.text();
      }
    );

    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        branches: (parsed.branches || []).map((b: any, idx: number) => ({ ...b, votes: 0, id: b.id || `b_${idx}` })),
        directorNoteHe: parsed.directorNoteHe || 'הסתעפות עלילתית נוצרה בהצלחה.',
        audioTheme: parsed.audioTheme || 'suspense',
      };
    }
  } catch (error) {
    console.warn('Gemini story branching fallback triggered:', error);
  }

  // Graceful fallback response
  return {
    branches: [
      { id: 'branch_a', titleHe: 'עימות חזיתי', descriptionHe: 'הגיבור בוחר לעמוד מול היריב בדו-קרב קולנועי מתוח.', predictedOutcomeHe: 'הגברת הקצב המוזיקלי והסאונד המרחבי.', votes: 0 },
      { id: 'branch_b', titleHe: 'בריחה דרך הצללים', descriptionHe: 'הגיבור נסוג דרך סמטה חשוכה ומסתורית.', predictedOutcomeHe: 'מעבר לתאורת לילה ניאונית ואפקטי באס עמוקים.', votes: 0 },
      { id: 'branch_c', titleHe: 'שימוש בטכנולוגיה', descriptionHe: 'פריצה למערכת האבטחה העירונית והפעלת אזעקה.', predictedOutcomeHe: 'הפעלת ויברציה הפטית והתראות ויזואליות.', votes: 0 }
    ],
    directorNoteHe: 'בחירת הקהל תכריע את המשך הסצנה והחוויה הסנסורית בחיור האולם.',
    audioTheme: 'cyberpunk'
  };
}
