import { z } from 'zod';

export const cryptoProfileSchema = z.object({
  currentPassword: z.string().min(1, { message: 'סיסמה נוכחית חסרה' }),
  newPassword: z.string().min(6, { message: 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים' }),
  confirmPassword: z.string().min(1, { message: 'אימות סיסמה חסר' })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
});

export const notificationSettingsSchema = z.object({
  pushEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
});

export const dataPurgeSchema = z.object({
  purgeType: z.enum(['cache', 'history', 'all']),
  confirmationText: z.literal('PURGE', { message: 'יש להקליד PURGE לאישור מחיקת נתונים' }),
});
