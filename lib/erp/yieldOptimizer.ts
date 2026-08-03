export interface YieldRecommendation {
  recommendedDiscountPercentage: number;
  recommendedPrice: number;
  promoActionHe: string;
  actionType: 'flash_sale' | 'vip_upgrade' | 'regular_price';
}

export function calculateYieldOptimization(
  occupancyPercentage: number,
  hoursUntilShowtime: number,
  basePrice: number
): YieldRecommendation {
  if (occupancyPercentage < 35 && hoursUntilShowtime < 4) {
    // Low occupancy close to showtime: Trigger Flash Sale
    const discount = 25;
    return {
      recommendedDiscountPercentage: discount,
      recommendedPrice: Math.round(basePrice * (1 - discount / 100)),
      promoActionHe: 'הפעלת Flash Sale אוטומטית (25% הנחה לקראת הקרנה)',
      actionType: 'flash_sale',
    };
  }

  if (occupancyPercentage < 50 && hoursUntilShowtime >= 12) {
    // Mid occupancy: VIP Upgrade Incentive
    return {
      recommendedDiscountPercentage: 10,
      recommendedPrice: basePrice,
      promoActionHe: 'שדרוג חינמי למושבי VIP למזמינים בשעתיים הקרובות',
      actionType: 'vip_upgrade',
    };
  }

  return {
    recommendedDiscountPercentage: 0,
    recommendedPrice: basePrice,
    promoActionHe: 'תפוסה יציבה - תמחור רגיל ללא שינוי',
    actionType: 'regular_price',
  };
}
