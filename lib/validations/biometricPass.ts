import { z } from 'zod';

export const BiometricPassSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  holdDurationMs: z.number().min(0),
  moodScore: z.number().min(0).max(100).default(85),
});

export type BiometricPassInput = z.infer<typeof BiometricPassSchema>;
