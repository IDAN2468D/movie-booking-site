'use server';

import { VoiceCommandInputSchema, VoiceCommandAction } from '../validations/voice-command-schema';

export async function processVoiceCommand(input: { transcript: string; locale?: string }): Promise<{
  success: boolean;
  data?: VoiceCommandAction;
  error?: string;
}> {
  try {
    const parsed = VoiceCommandInputSchema.parse(input);
    const text = parsed.transcript.trim().toLowerCase();

    let actionData: VoiceCommandAction = {
      action: 'unknown',
      replyHebrew: `הוראה לא זוהתה: "${parsed.transcript}"`,
    };

    if (text.includes('בית') || text.includes('ראשי') || text.includes('חזור')) {
      actionData = {
        action: 'navigate',
        targetUrl: '/',
        replyHebrew: 'מעביר אותך לעמוד הבית הראשי...',
      };
    } else if (text.includes('פסקול') || text.includes('מוזיקה') || text.includes('שיר')) {
      actionData = {
        action: 'navigate',
        targetUrl: '/soundtracks',
        replyHebrew: 'פותח את מחולל הפסקולים הנוירוני...',
      };
    } else if (text.includes('זוגי') || text.includes('מאצ') || text.includes('קו אופ') || text.includes('coop')) {
      actionData = {
        action: 'navigate',
        targetUrl: '/discover/coop',
        replyHebrew: 'מעביר ל-Co-op Matcher הזוגי...',
      };
    } else if (text.includes('גילוי') || text.includes('רגש') || text.includes('חיפוש')) {
      actionData = {
        action: 'navigate',
        targetUrl: '/discovery',
        replyHebrew: 'מעביר למערכת הגילוי הנוירונית לפי רגשות...',
      };
    } else if (text.includes('חזון') || text.includes('אודות')) {
      actionData = {
        action: 'navigate',
        targetUrl: '/vision',
        replyHebrew: 'מעביר לעמוד החזון הקולנועי...',
      };
    } else if (text.includes('כרטיסים') || text.includes('סרטים שלי')) {
      actionData = {
        action: 'navigate',
        targetUrl: '/tickets',
        replyHebrew: 'מציג את מועדון הכרטיסים השמורים שלך...',
      };
    } else {
      actionData = {
        action: 'search',
        query: parsed.transcript,
        targetUrl: `/discovery?q=${encodeURIComponent(parsed.transcript)}`,
        replyHebrew: `מחפש סרטים ואירועים תואמים ל: "${parsed.transcript}"`,
      };
    }

    return { success: true, data: actionData };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Voice command processing failure';
    return { success: false, error: msg };
  }
}
