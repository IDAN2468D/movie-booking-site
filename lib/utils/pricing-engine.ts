interface PricingFactors {
  basePrice: number;
  occupancyRate: number; // 0 to 1
  isWeekend: boolean;
  daysUntilShow: number;
  isPrimeTime: boolean; // 18:00 - 22:00
}

export const calculateDynamicPrice = (factors: PricingFactors): number => {
  let price = factors.basePrice;

  // Occupancy Factor (Demand)
  // If more than 70% full, increase price by 15%
  if (factors.occupancyRate > 0.7) {
    price *= 1.15;
  } else if (factors.occupancyRate < 0.2) {
    // If less than 20% full, decrease price by 10% (Promotion)
    price *= 0.9;
  }

  // Time Factor
  if (factors.isWeekend) {
    price += 5.0; // Flat weekend surcharge
  }

  if (factors.isPrimeTime) {
    price *= 1.1; // 10% prime time increase
  }

  // Early Bird Factor
  if (factors.daysUntilShow > 7) {
    price *= 0.95; // 5% discount for booking a week in advance
  } else if (factors.daysUntilShow === 0) {
    price *= 1.05; // 5% last minute surcharge
  }

  return Math.round(price * 100) / 100;
};

export const getPriceInsights = (factors: PricingFactors) => {
  const insights = [];
  
  if (factors.occupancyRate > 0.7) insights.push('ביקוש גבוה: המחיר עודכן בהתאם לתפוסת האולם');
  if (factors.daysUntilShow > 7) insights.push('הנחת מוקדמות: חסכת 5% בהזמנה מראש');
  if (factors.isWeekend) insights.push('תעריף סופ"ש חל על הזמנה זו');
  
  return insights;
};
