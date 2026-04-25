import { z } from 'zod';

// Pricing Configuration
export const PRICING_CONFIG = {
  BASE_PRICE: 45, // NIS
  MATINEE_DISCOUNT: 0.20, // 20% off
  WEEKEND_SURCHARGE: 0.15, // 15% extra
  MEMBER_DISCOUNT: 0.10, // 10% off
  POINTS_EARN_RATE: 0.10, // 1 point per 10 NIS (represented as 0.1 points per NIS)
  POINTS_VALUE: 0.1, // 100 points = 10 NIS (1 point = 0.1 NIS)
};

export const CouponSchema = z.object({
  code: z.string().toUpperCase(),
  type: z.enum(['PERCENT_OFF', 'FIXED_AMOUNT', 'BOGO']),
  value: z.number(),
  minSpend: z.number().optional().default(0),
});

export type Coupon = z.infer<typeof CouponSchema>;

/**
 * Calculate the price for a single ticket based on time and day.
 * (DYNAMIC_PRICING_LOYALTY)
 */
export function calculateTicketPrice(showtime: string, date: Date): number {
  let price = PRICING_CONFIG.BASE_PRICE;
  
  const hour = parseInt(showtime.split(':')[0]);
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday

  // Matinee Discount (Before 16:00)
  if (hour < 16) {
    price *= (1 - PRICING_CONFIG.MATINEE_DISCOUNT);
  }

  // Weekend Surcharge (Friday afternoon to Saturday night)
  // In Israel, weekend is Friday/Saturday
  if (day === 5 || day === 6) {
    price *= (1 + PRICING_CONFIG.WEEKEND_SURCHARGE);
  }

  return Math.round(price);
}

/**
 * Calculate points earned for a total amount.
 */
export function calculatePointsEarned(amount: number): number {
  return Math.floor(amount * PRICING_CONFIG.POINTS_EARN_RATE);
}

/**
 * Calculate discount from points.
 */
export function calculatePointsDiscount(points: number): number {
  return points * PRICING_CONFIG.POINTS_VALUE;
}

/**
 * Validate a booking server-side.
 * (GOVERNANCE Rule 1)
 */
export function validateBookingTotal(params: {
  tickets: number;
  showtime: string;
  date: string;
  foodTotal: number;
  pointsUsed: number;
  coupon?: Coupon;
}) {
  const baseTicketPrice = calculateTicketPrice(params.showtime, new Date(params.date));
  let total = (baseTicketPrice * params.tickets) + params.foodTotal;

  // Apply Coupon
  if (params.coupon) {
    if (params.coupon.type === 'PERCENT_OFF') {
      total *= (1 - params.coupon.value / 100);
    } else if (params.coupon.type === 'FIXED_AMOUNT') {
      total -= params.coupon.value;
    }
  }

  // Apply Points
  const pointsDiscount = calculatePointsDiscount(params.pointsUsed);
  total -= pointsDiscount;

  return Math.max(0, Math.round(total));
}
