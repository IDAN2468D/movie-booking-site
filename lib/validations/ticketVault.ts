import { z } from "zod";

export const TicketVaultPayloadSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  seatId: z.string().min(1, "Seat ID is required"),
  concessions: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().int().positive()
  })).optional()
});

export type TicketVaultPayload = z.infer<typeof TicketVaultPayloadSchema>;
