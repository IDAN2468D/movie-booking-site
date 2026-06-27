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
