import { z } from "zod";

export const ConcessionOrderSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  seatId: z.string().min(1, "Seat ID is required"),
  items: z.array(z.object({
    itemId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    modifiers: z.array(z.string()).optional()
  })).min(1, "At least one item is required"),
  totalCost: z.number().positive()
});

export const SyncDeliveryUpdateSchema = z.object({
  orderId: z.string(),
  status: z.enum(["PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED"]),
  etaMinutes: z.number().min(0).optional()
});

export const HoloPairingQuerySchema = z.object({
  movieGenre: z.string().default("Sci-Fi"),
  preferredSweetness: z.number().min(0).max(100).default(50),
  preferredSaltiness: z.number().min(0).max(100).default(50)
});

export const HoloCartSchema = z.object({
  items: z.array(z.object({
    itemId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1, "עגלת הקניות ריקה"),
  totalPrice: z.number().positive()
});

export type ConcessionOrderType = z.infer<typeof ConcessionOrderSchema>;
export type SyncDeliveryUpdateType = z.infer<typeof SyncDeliveryUpdateSchema>;
export type HoloPairingQueryType = z.infer<typeof HoloPairingQuerySchema>;
export type HoloCartType = z.infer<typeof HoloCartSchema>;

