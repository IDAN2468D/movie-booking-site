'use server';

import { VoiceOrderInputSchema, VoiceOrderParsedOutput } from '../validations/voice-order.schema';
import { ActionResult } from './crowd-heatmap.actions';

export async function parseVoiceOrderAction(
  rawInput: unknown
): Promise<ActionResult<VoiceOrderParsedOutput>> {
  try {
    const input = VoiceOrderInputSchema.parse(rawInput);
    const text = input.transcript.toLowerCase();

    let intent: VoiceOrderParsedOutput['intentType'] = 'search_movie';
    let actionText = `מבצע חיפוש עבור "${input.transcript}"`;

    if (text.includes('פופקורן') || text.includes('שתייה') || text.includes('נאצ׳וס')) {
      intent = 'add_concession';
      actionText = `פריט המזנון "${input.transcript}" נוסף בהצלחה לסל`;
    } else if (text.includes('מושב') || text.includes('כיסא') || text.includes('שורה')) {
      intent = 'select_seat';
      actionText = `מושב נבחר בהצלחה: "${input.transcript}"`;
    } else if (text.includes('תשלום') || text.includes('קנה') || text.includes('הזמן')) {
      intent = 'checkout';
      actionText = `מעביר לקופה עבור הזמנתך`;
    }

    const output: VoiceOrderParsedOutput = {
      intentType: intent,
      targetQuery: input.transcript,
      confidence: 0.96,
      actionResultText: actionText,
      audioConfirmationHz: intent === 'checkout' ? 880 : 440,
    };

    return {
      success: true,
      data: output,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to parse voice command',
    };
  }
}
