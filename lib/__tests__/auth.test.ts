import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loginSchema, registerSchema } from '../validations/authSchema';
import { loginAction, registerAction } from '@/app/actions/authActions';

// Mock DB client
vi.mock('@/lib/mongodb', () => {
  return {
    default: Promise.resolve({
      db: () => ({
        collection: () => ({
          findOne: vi.fn(),
          insertOne: vi.fn(),
        }),
      }),
    }),
  };
});

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login input', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('כתובת אימייל לא תקינה');
      }
    });

    it('should fail on too short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('הסיסמה חייבת להכיל לפחות 6 תווים');
      }
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration input', () => {
      const result = registerSchema.safeParse({
        name: 'ישראל ישראלי',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should fail on short name', () => {
      const result = registerSchema.safeParse({
        name: 'א',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('השם חייב להכיל לפחות 2 תווים');
      }
    });
  });
});
