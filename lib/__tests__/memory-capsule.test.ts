import { describe, it, expect } from 'vitest';
import { memoryCapsuleItemSchema, memoryReflectionSchema } from '@/lib/validations/memoryCapsule';
import { DEFAULT_MEMORY_CAPSULES } from '@/lib/constants/defaultMemoryCapsules';

describe('Cinematic Memory Capsule & Shard Validation Suite', () => {
  it('should successfully validate default memory capsules', () => {
    expect(DEFAULT_MEMORY_CAPSULES.length).toBeGreaterThan(0);
    DEFAULT_MEMORY_CAPSULES.forEach((capsule) => {
      const parsed = memoryCapsuleItemSchema.safeParse(capsule);
      expect(parsed.success).toBe(true);
    });
  });

  it('should validate user personal reflection payload', () => {
    const reflection = {
      capsuleId: 'CAPSULE-001',
      rating: 5,
      personalNote: 'חוויה קולנועית פנומנלית באולם ה-IMAX.',
      companions: 'עם דניאל',
      favoriteScene: 'רכיבת התולעת הראשונה',
      emotionalVibe: 'עוצר נשימה',
    };

    const parsed = memoryReflectionSchema.safeParse(reflection);
    expect(parsed.success).toBe(true);
  });

  it('should reject invalid reflection ratings outside 1-5 range', () => {
    const invalidReflection = {
      capsuleId: 'CAPSULE-001',
      rating: 10,
      personalNote: 'Too high rating',
    };

    const parsed = memoryReflectionSchema.safeParse(invalidReflection);
    expect(parsed.success).toBe(false);
  });
});
