import { z } from 'zod';

export const smartTrayPrepSchema = z.object({
  showtimeId: z.string().min(1),
  seatId: z.string().min(1),
  items: z.array(z.object({
    itemId: z.string(),
    name: z.string(),
    quantity: z.number().int().positive(),
  })),
  deliveryTiming: z.enum(['before_movie', 'intermission', 'custom_timestamp']),
  targetDeliveryTimestamp: z.number().optional(),
});

export const arFlavorPairingSchema = z.object({
  genre: z.string().min(1),
  durationMinutes: z.number().positive(),
});

export type SmartTrayPrepPayload = z.infer<typeof smartTrayPrepSchema>;
export type ARFlavorPairingPayload = z.infer<typeof arFlavorPairingSchema>;
