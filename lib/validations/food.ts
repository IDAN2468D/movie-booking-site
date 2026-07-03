import { z } from "zod";

export const foodItemQuantitySchema = z.object({
  foodId: z.number().int().positive("Food ID must be positive"),
  delta: z.number().int().refine((val) => val === 1 || val === -1, {
    message: "Delta must be either 1 or -1",
  }),
});

export type FoodItemQuantityInput = z.infer<typeof foodItemQuantitySchema>;

export const foodCategorySchema = z.object({
  category: z.enum(['כל הפריטים', 'חטיפים', 'משקאות', 'קינוחים', 'קומבואים']),
});

export type FoodCategoryInput = z.infer<typeof foodCategorySchema>;
