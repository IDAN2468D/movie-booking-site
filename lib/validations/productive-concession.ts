import { z } from 'zod';

export const DietaryTagSchema = z.enum([
  'ALL',
  'KOSHER_MEHADRIN',
  'VEGAN',
  'GLUTEN_FREE',
  'LOW_CALORIE',
]);

export const SpiceOptionSchema = z.enum([
  'CHEDDAR',
  'TRUFFLE',
  'CARAMEL_SALT',
  'SMOKED_PAPRIKA',
  'CLASSIC_SALT',
]);

export const DrinkOptionSchema = z.enum([
  'COLA_ZERO',
  'COLA_ORIGINAL',
  'SPRITE_ZERO',
  'FUZE_TEA',
  'COLD_BREW',
  'MINERAL_WATER',
]);

export const DeliveryModeSchema = z.enum(['COUNTER_EXPRESS', 'IN_SEAT']);

export const CustomizedItemSchema = z.object({
  cartId: z.string().min(1),
  itemId: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  selectedSpice: SpiceOptionSchema.optional(),
  selectedDrink: DrinkOptionSchema.optional(),
  calories: z.number().nonnegative(),
});

export const ProductiveOrderSchema = z.object({
  items: z.array(CustomizedItemSchema).min(1, 'יש להוסיף לפחות מוצר אחד למגש'),
  deliveryMode: DeliveryModeSchema.default('COUNTER_EXPRESS'),
  seatNumber: z.string().optional(),
  hallNumber: z.string().default('אולם 04'),
  totalPrice: z.number().positive(),
  vatAmount: z.number().nonnegative(),
  totalCalories: z.number().nonnegative(),
});

export type ProductiveOrderInput = z.infer<typeof ProductiveOrderSchema>;
