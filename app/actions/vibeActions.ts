'use server';

import { z } from 'zod';

const VibeCheckSchema = z.object({
  pulseId: z.string(),
  senderName: z.string().optional(),
});

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Global emitter access (for simulation in Next.js dev server)
// In production, you would use Redis Pub/Sub here.
declare global {
  var emitVibeEvent: ((pulseId: string) => void) | undefined;
}

/**
 * Server Action: sendVibeCheckAction
 * Registers a peer-to-peer Vibe Check interaction on a specific pulse node.
 */
export async function sendVibeCheckAction(
  payload: z.infer<typeof VibeCheckSchema>
): Promise<ActionResponse<{ pulseId: string; status: string }>> {
  try {
    const parsed = VibeCheckSchema.safeParse(payload);
    
    if (!parsed.success) {
      return { success: false, error: 'Invalid vibe check parameters.' };
    }

    const { pulseId } = parsed.data;

    // Simulate database/Redis registration latency
    await new Promise(resolve => setTimeout(resolve, 200));

    // Broadcast the vibe check to active SSE clients if the emitter exists
    if (globalThis.emitVibeEvent) {
      globalThis.emitVibeEvent(pulseId);
    }

    return {
      success: true,
      data: {
        pulseId,
        status: 'VIBE_SENT'
      }
    };

  } catch (error: any) {
    console.error('Vibe Action Error:', error);
    return { success: false, error: 'Failed to send vibe check.' };
  }
}
