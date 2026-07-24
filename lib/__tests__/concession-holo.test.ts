import { describe, it, expect } from 'vitest';
import { MOCK_HOLO_CONCESSIONS } from '@/lib/types/concession';
import { HoloPairingQuerySchema, HoloCartSchema } from '@/lib/validations/concession';
import { getAiConcessionPairing } from '@/lib/actions/concession-actions';

describe('Sprint 63: Kinetic Concession Holographic AR Menu', () => {
  it('should validate mock holographic concession items', () => {
    expect(MOCK_HOLO_CONCESSIONS.length).toBeGreaterThan(0);
    const popcorn = MOCK_HOLO_CONCESSIONS[0];
    expect(popcorn.category).toBe('popcorn');
    expect(popcorn.flavor.sweet).toBeGreaterThan(0);
  });

  it('should validate HoloPairingQuerySchema boundary', () => {
    const valid = HoloPairingQuerySchema.safeParse({
      movieGenre: 'Sci-Fi',
      preferredSweetness: 75,
      preferredSaltiness: 50
    });
    expect(valid.success).toBe(true);

    const invalid = HoloPairingQuerySchema.safeParse({
      movieGenre: 'Sci-Fi',
      preferredSweetness: 200 // Out of range [0, 100]
    });
    expect(invalid.success).toBe(false);
  });

  it('should return AI pairing recommendation via server action', async () => {
    const res = await getAiConcessionPairing({
      movieGenre: 'Sci-Fi',
      preferredSweetness: 80,
      preferredSaltiness: 60
    });

    expect(res.success).toBe(true);
    expect(res.data?.recommendedItem).toBeDefined();
    expect(res.data?.explanation).toContain('Sci-Fi');
  });

  it('should validate HoloCartSchema boundary', () => {
    const validCart = HoloCartSchema.safeParse({
      items: [{ itemId: 'holo-popcorn-neon', quantity: 2, price: 38 }],
      totalPrice: 76
    });
    expect(validCart.success).toBe(true);
  });
});
