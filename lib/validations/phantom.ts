import { z } from "zod";

export const phantomInviteSchema = z.object({
  hostId: z.string().min(1, "Host User ID is required"),
  guestEmail: z.string().email("Invalid guest email"),
  bookingId: z.string().min(1, "Booking ID is required for WebRTC sync"),
  status: z.enum(["pending", "accepted", "synced", "disconnected"]).default("pending"),
  accessKey: z.string().optional(),
});

export type PhantomInviteInput = z.infer<typeof phantomInviteSchema>;
