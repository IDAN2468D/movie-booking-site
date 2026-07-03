import { z } from "zod";

export const cateringOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  mood: z.enum(["relaxed", "hyped", "focused", "romantic"]),
  items: z.array(z.string()).min(1, "At least one item must be predicted/selected"),
  totalPrice: z.number().nonnegative(),
  status: z.enum(["preparing", "delivering", "delivered"]).default("preparing"),
  seatNumber: z.string().min(1, "Seat number is required for magnetic delivery"),
});

export type CateringOrderInput = z.infer<typeof cateringOrderSchema>;

export const deliveryPhaseSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  itemIdx: z.number().int().nonnegative(),
  phase: z.enum(["Trailers", "Act 1", "Climax"]),
});

export type DeliveryPhaseInput = z.infer<typeof deliveryPhaseSchema>;

export const groupComboSchema = z.object({
  comboId: z.string().min(1, "Combo ID is required"),
  seatCount: z.number().int().positive("Must select at least 1 seat for splitting"),
  seats: z.array(z.string()).min(1, "Seats are required"),
});

export type GroupComboInput = z.infer<typeof groupComboSchema>;

export const biometricFilterSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  allergyTokens: z.array(z.string()),
});

export type BiometricFilterInput = z.infer<typeof biometricFilterSchema>;

