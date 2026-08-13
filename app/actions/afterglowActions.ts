'use server';

import { z } from 'zod';

export const AfterglowTriviaQuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
});

export const AfterglowCommentSchema = z.object({
  id: z.string(),
  author: z.string(),
  avatar: z.string(),
  timestamp: z.string(),
  content: z.string(),
  isSpoiler: z.boolean(),
  likes: z.number(),
});

export type AfterglowTriviaQuestion = z.infer<typeof AfterglowTriviaQuestionSchema>;
export type AfterglowComment = z.infer<typeof AfterglowCommentSchema>;

const DEFAULT_COMMENTS: AfterglowComment[] = [
  {
    id: 'comm_1',
    author: 'איתי מ.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    timestamp: 'לפני 12 דקות',
    content: 'הטוויסט בסוף עם מפתח הזמן פשוט הדהים אותי! לא ציפיתי שהדמות הראשית תהיה עצמה מהעתיד.',
    isSpoiler: true,
    likes: 18,
  },
  {
    id: 'comm_2',
    author: 'שירה ר.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    timestamp: 'לפני 25 דקות',
    content: 'עיצוב הסאונד באולם ב-35Hz בסצנת החלל גרם לכל המושב לרעוד. חוויה של 10 מתוך 10!',
    isSpoiler: false,
    likes: 34,
  },
];

export async function getAfterglowTriviaAction(movieTitle: string) {
  try {
    const questions: AfterglowTriviaQuestion[] = [
      {
        id: 1,
        question: `מהי הסצנה הדרמטית שפתחה את המערכה השלישית בסרט "${movieTitle}"?`,
        options: ['המלחמה על הגשר', 'הדיאלוג בערפל', 'הנחיתה על הכוכב', 'המרדף הלילי'],
        correctIndex: 1,
      },
      {
        id: 2,
        question: 'איזה אלמנט אקוסטי ייחודי בלט במהלך הטריילר והפסקול?',
        options: ['פעימת בס 40Hz', 'כינורות סולו', 'שתיקה מוחלטת', 'קולות מקהלה'],
        correctIndex: 0,
      },
    ];

    return {
      success: true,
      data: questions,
    };
  } catch {
    return {
      success: false,
      error: 'שגיאה בטעינת שאלות הטריוויה',
    };
  }
}

export async function getAfterglowDiscussionsAction() {
  try {
    return {
      success: true,
      data: DEFAULT_COMMENTS,
    };
  } catch {
    return {
      success: false,
      error: 'שגיאה בטעינת דיוני הקהילה',
    };
  }
}
