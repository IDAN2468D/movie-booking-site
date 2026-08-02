import { z } from "zod";

export const CryptoTicketInputSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  seatId: z.string().min(1, "Seat ID is required"),
  biometricToken: z.string().optional(),
});

export type CryptoTicketInput = z.infer<typeof CryptoTicketInputSchema>;

export const CryptoTicketOutputSchema = z.object({
  ticketId: z.string(),
  isUnlocked: z.boolean(),
  qrPayload: z.string(),
  expiresAt: z.number(),
  securityLevel: z.string(),
});

export type CryptoTicketOutput = z.infer<typeof CryptoTicketOutputSchema>;
