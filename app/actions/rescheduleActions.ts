'use server';

import { z } from 'zod';

const RescheduleTicketSchema = z.object({
  ticketId: z.string().min(5),
  newTime: z.string().datetime(),
});

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Server Action: rescheduleTicketAction
 * Proactively shifts a user's ticket to a later showtime.
 */
export async function rescheduleTicketAction(
  payload: z.infer<typeof RescheduleTicketSchema>
): Promise<ActionResponse<{ confirmedTime: string; status: string }>> {
  try {
    // 1. Zod Boundary Validation
    const parsed = RescheduleTicketSchema.safeParse(payload);
    
    if (!parsed.success) {
      return { success: false, error: 'Invalid reschedule parameters.' };
    }

    const { ticketId, newTime } = parsed.data;

    // 2. Mock Database Update (In a real scenario, we'd update MongoDB SeatLocks here)
    // For now, we simulate the database latency and success
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Return successful unified contract
    return {
      success: true,
      data: {
        confirmedTime: newTime,
        status: 'RESCHEDULED_SUCCESSFULLY'
      }
    };

  } catch (error: any) {
    console.error('Reschedule Action Error:', error);
    return { success: false, error: 'Failed to reschedule ticket. Please try again.' };
  }
}
