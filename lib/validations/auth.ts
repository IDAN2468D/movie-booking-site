import { z } from 'zod';

const baseSchema = {
  email: z.string().email('כתובת אימייל לא תקינה. אנא ודאו את תקינות הפורמט.'),
  password: z.string().min(8, 'הסיסמה חייבת להכיל לפחות 8 תווים ברמת אנטרופיה גבוהה.'),
};

export const authSchema = z.discriminatedUnion("actionType", [
  z.object({
    actionType: z.literal("login"),
    ...baseSchema,
  }),
  z.object({
    actionType: z.literal("register"),
    name: z.string().min(2, 'שם מלא חייב להכיל לפחות 2 תווים.'),
    ...baseSchema,
  })
]);

export type AuthPayload = z.infer<typeof authSchema>;
