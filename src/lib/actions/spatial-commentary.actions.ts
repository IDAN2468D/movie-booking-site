'use server';

import { SpatialCommentaryInputSchema, CommentaryItem } from '../validations/spatial-commentary.schema';

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function fetchSpatialCommentaryAction(
  rawInput: unknown
): Promise<ActionResult<CommentaryItem[]>> {
  try {
    const input = SpatialCommentaryInputSchema.parse(rawInput);

    const commentaryList: CommentaryItem[] = [
      {
        id: 'comm-1',
        timestampSec: input.timestampSec,
        speakerName: "Director's Whisper (Christopher Nolan AI)",
        quote: 'Notice how the sub-bass pulse in this scene syncs with the IMAX screen curvature, creating a visceral acoustic tension.',
        panningValue: -0.6,
        audioBoostDb: 4.5,
      },
      {
        id: 'comm-2',
        timestampSec: input.timestampSec + 15,
        speakerName: 'Sound Architect AI',
        quote: 'We isolated dialogue frequencies to 2.4kHz to prevent acoustic masking during heavy explosive sound effects.',
        panningValue: 0.6,
        audioBoostDb: 6.0,
      },
    ];

    return {
      success: true,
      data: commentaryList,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to fetch spatial commentary overlay',
    };
  }
}
