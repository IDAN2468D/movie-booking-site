export type DietaryTag = 'ALL' | 'KOSHER_MEHADRIN' | 'VEGAN' | 'GLUTEN_FREE' | 'LOW_CALORIE';

export type SpiceOption = 'CHEDDAR' | 'TRUFFLE' | 'CARAMEL_SALT' | 'SMOKED_PAPRIKA' | 'CLASSIC_SALT';

export type DrinkOption = 'COLA_ZERO' | 'COLA_ORIGINAL' | 'SPRITE_ZERO' | 'FUZE_TEA' | 'COLD_BREW' | 'MINERAL_WATER';

export type DeliveryMode = 'COUNTER_EXPRESS' | 'IN_SEAT';

export interface ExpressBundle {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  savingsBadge: string;
  icon: string;
  itemIds: number[];
  caloriesTotal: number;
}

export interface ProductiveConcessionItem {
  id: number;
  name: string;
  category: 'popcorn' | 'drinks' | 'snacks' | 'sweets';
  categoryLabel: string;
  price: number;
  rating: number;
  image: string;
  tag?: string;
  dietaryTags: DietaryTag[];
  calories: number;
  prepTimeMinutes: number;
  allowsSpiceCustomization?: boolean;
}

export interface CustomizedCartItem {
  cartId: string;
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  selectedSpice?: SpiceOption;
  selectedDrink?: DrinkOption;
  calories: number;
}

export const SPICE_LABELS: Record<SpiceOption, { label: string; icon: string }> = {
  CHEDDAR: { label: 'צ׳דר מעושן עשיר', icon: '🧀' },
  TRUFFLE: { label: 'חמאת כמהין שחורה', icon: '🍄' },
  CARAMEL_SALT: { label: 'קרמל מלוח צרפתי', icon: '🍯' },
  SMOKED_PAPRIKA: { label: 'פפריקה מעושנת ושום', icon: '🌶️' },
  CLASSIC_SALT: { label: 'מלח ים אטלנטי קלאסי', icon: '🧂' },
};

export const DRINK_LABELS: Record<DrinkOption, { label: string; icon: string }> = {
  COLA_ZERO: { label: 'קולה זירו קרה כקרח', icon: '🥤' },
  COLA_ORIGINAL: { label: 'קולה קלאסית מרעננת', icon: '🥤' },
  SPRITE_ZERO: { label: 'ספרייט זירו ליים', icon: '🍋' },
  FUZE_TEA: { label: 'פיוז-טי אפרסק מרענן', icon: '🍑' },
  COLD_BREW: { label: 'קולד ברו ניטרו 4D', icon: '☕' },
  MINERAL_WATER: { label: 'מי מעיין אלפיניים', icon: '💧' },
};
