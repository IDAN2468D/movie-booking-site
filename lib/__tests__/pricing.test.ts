import { describe, it, expect } from 'vitest';
import { calculateTicketPrice, calculatePointsEarned, validateBookingTotal } from '../pricing';

describe('Pricing Logic', () => {
  it('should calculate base price correctly', () => {
    const price = calculateTicketPrice('19:00', new Date('2026-04-22')); // Wednesday evening
    expect(price).toBe(45);
  });

  it('should apply matinee discount', () => {
    const price = calculateTicketPrice('14:00', new Date('2026-04-22')); // Wednesday afternoon
    expect(price).toBe(36); // 45 * 0.8
  });

  it('should apply weekend surcharge', () => {
    const price = calculateTicketPrice('19:00', new Date('2026-04-24')); // Friday evening
    expect(price).toBe(52); // 45 * 1.15 = 51.75 -> round to 52
  });
});

describe('Loyalty Logic', () => {
  it('should calculate points as 10% of total', () => {
    const points = calculatePointsEarned(150);
    expect(points).toBe(15);
  });

  it('should validate total correctly', () => {
    const total = validateBookingTotal({
      tickets: 2,
      showtime: '19:00',
      date: '2026-04-22',
      foodTotal: 0,
      pointsUsed: 0
    });
    expect(total).toBe(90);
  });
});
