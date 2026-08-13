'use server';

import { z } from 'zod';

export const SpoilerCommentInputSchema = z.object({
  text: z.string().min(1).max(500),
  movieTitle: z.string().min(1),
  authorName: z.string().optional(),
});

export const LiveCommentSchema = z.object({
  id: z.string(),
  author: z.string(),
  avatar: z.string(),
  text: z.string(),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'INTENSE']),
  isSpoiler: z.boolean(),
  timestamp: z.string(),
  expiresAt: z.string(),
});

export type LiveComment = z.infer<typeof LiveCommentSchema>;

const LIVE_STREAM_COMMENTS: LiveComment[] = [
  {
    id: 'stream_1',
    author: 'אלון נ.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    text: 'סצנת המעבר דרך חור התולעת הייתה מדהימה! הסאונד באולם רעד במיוחד.',
    sentiment: 'INTENSE',
    isSpoiler: false,
    timestamp: 'לפני 3 דקות',
    expiresAt: 'בעוד 23 שעות',
  },
  {
    id: 'stream_2',
    author: 'גל ד.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    text: 'זהירות ספוילר: המנהיג הסודי מתברר בסוף כדמות מהפרק הראשון!',
    sentiment: 'INTENSE',
    isSpoiler: true,
    timestamp: 'לפני 8 דקות',
    expiresAt: 'בעוד 23 שעות',
  },
];

export async function getLiveSpoilerStreamAction(movieTitle: string) {
  try {
    return {
      success: true,
      data: LIVE_STREAM_COMMENTS,
      movieTitle,
    };
  } catch {
    return {
      success: false,
      error: 'שגיאה בטעינת הזרם החי',
    };
  }
}

export async function postSpoilerCommentAction(input: unknown) {
  try {
    const { text, movieTitle, authorName } = SpoilerCommentInputSchema.parse(input);

    const hasSpoilerKeywords = /סוף|ספוילר|מת בסוף|הרוצח|מתברר|טוויסט/i.test(text);
    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const newComment: LiveComment = {
      id: `comment_${Date.now()}`,
      author: authorName || 'צופה אנונימי',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
      text,
      sentiment: text.length > 50 ? 'INTENSE' : 'POSITIVE',
      isSpoiler: hasSpoilerKeywords,
      timestamp: 'עכשיו',
      expiresAt: `תפוג ב-${expires.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`,
    };

    LIVE_STREAM_COMMENTS.unshift(newComment);

    return {
      success: true,
      data: newComment,
      message: 'התגובה נוספה בהצלחה לזרם הקהילתי',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'שגיאה בשיגור התגובה',
    };
  }
}
