import { z } from "zod";

export const SmartTrayItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(["popcorn", "drink", "snack", "vip_combo"]),
  price: z.number().positive(),
  recommendedGenre: z.string(),
  calories: z.number().optional(),
});

export const SmartTrayResponseSchema = z.object({
  comboName: z.string(),
  items: z.array(SmartTrayItemSchema),
  totalPrice: z.number().positive(),
  estimatedDeliveryMin: z.number().positive(),
});

export type SmartTrayItem = z.infer<typeof SmartTrayItemSchema>;
export type SmartTrayResponse = z.infer<typeof SmartTrayResponseSchema>;
