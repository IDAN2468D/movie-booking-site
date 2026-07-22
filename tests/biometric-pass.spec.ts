import { describe, it, expect } from 'vitest';
import { BiometricPassSchema } from '../lib/validations/biometricPass';

describe('Sprint 53: Biometric Dynamic Holographic Passbook', () => {
  it('validates biometric pass hold schema', () => {
    const valid = BiometricPassSchema.safeParse({
      ticketId: 'TICKET-9921',
      holdDurationMs: 1200,
      moodScore: 92,
    });
    expect(valid.success).toBe(true);

    const invalid = BiometricPassSchema.safeParse({
      ticketId: '',
      holdDurationMs: -100,
    });
    expect(invalid.success).toBe(false);
  });
});
