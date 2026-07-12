import { z } from "zod";

export const PeerSignalPayloadSchema = z.object({
  type: z.enum(['offer', 'answer', 'candidate', 'cursor_move']),
  sdp: z.string().optional(),
  candidate: z.any().optional(),
  coordinates: z.object({
    row: z.number(),
    col: z.number(),
    x: z.number(),
    y: z.number(),
  }).optional(),
});

export const SessionSyncSchema = z.object({
  sessionId: z.string().min(1),
  remoteUserId: z.string().min(1),
  playbackPosition: z.number().nonnegative(),
  isPlaying: z.boolean(),
});

export type PeerSignalPayload = z.infer<typeof PeerSignalPayloadSchema>;
export type SessionSync = z.infer<typeof SessionSyncSchema>;

// Legacy definitions to prevent breaking existing code
export const phantomInviteSchema = z.object({
  hostId: z.string().min(1, "Host User ID is required"),
  guestEmail: z.string().email("Invalid guest email"),
  bookingId: z.string().min(1, "Booking ID is required for WebRTC sync"),
  status: z.enum(["pending", "accepted", "synced", "disconnected"]).default("pending"),
  accessKey: z.string().optional(),
});

export type PhantomInviteInput = z.infer<typeof phantomInviteSchema>;
