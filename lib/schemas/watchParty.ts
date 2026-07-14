import { z } from 'zod';

export const CursorMovePayloadSchema = z.object({
  x: z.number(),
  y: z.number(),
  userId: z.string(),
  color: z.string(),
});

export type CursorMovePayload = z.infer<typeof CursorMovePayloadSchema>;

export const PeerClickPayloadSchema = z.object({
  col: z.number(),
  row: z.string(),
});

export type PeerClickPayload = z.infer<typeof PeerClickPayloadSchema>;
