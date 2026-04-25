import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Shared schemas (mimicking the ones in API routes)
const BookingRequestSchema = z.object({
  movie: z.object({
    id: z.number(),
    title: z.string().optional(),
    displayTitle: z.string(),
    poster_path: z.string().nullable(),
  }),
  seats: z.array(z.string()),
  food: z.array(z.any()).default([]),
  total: z.number(),
  paymentInfo: z.object({
    cardName: z.string(),
    cardNumber: z.string().min(16),
  }),
  showtime: z.string().default("19:30"),
  date: z.string().default(new Date().toISOString()),
  pointsUsed: z.number().default(0),
});

const RedemptionRequestSchema = z.object({
  rewardId: z.number(),
  points: z.number().positive(),
});

describe('API Validation Schemas', () => {
  describe('BookingRequestSchema', () => {
    it('should validate correct booking data', () => {
      const validData = {
        movie: { id: 123, title: 'Test Movie', displayTitle: 'Test Movie', poster_path: '/path.jpg' },
        seats: ['A1', 'A2'],
        total: 90,
        paymentInfo: { cardName: 'Idan K', cardNumber: '1234567812345678' }
      };
      expect(BookingRequestSchema.safeParse(validData).success).toBe(true);
    });

    it('should fail if cardNumber is too short', () => {
      const invalidData = {
        movie: { id: 123, title: 'Test Movie', poster_path: '/path.jpg' },
        seats: ['A1'],
        total: 45,
        paymentInfo: { cardName: 'Idan K', cardNumber: '1234' }
      };
      const result = BookingRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('RedemptionRequestSchema', () => {
    it('should validate correct redemption data', () => {
      const validData = { rewardId: 1, points: 500 };
      expect(RedemptionRequestSchema.safeParse(validData).success).toBe(true);
    });

    it('should fail if points are negative', () => {
      const invalidData = { rewardId: 1, points: -100 };
      expect(RedemptionRequestSchema.safeParse(invalidData).success).toBe(false);
    });
  });
});
