'use server';

import { authSchema } from '@/lib/validations/auth';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export interface AuthResult {
  success: boolean;
  error?: string;
  targetUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function authenticateUserAction(prevState: any, formData: FormData): Promise<AuthResult> {
  const payload = Object.fromEntries(formData.entries());
  const parsed = authSchema.safeParse(payload);
  
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Simulate an isolated cryptographic hash baseline lookup with a controlled async delay of 1200ms
  await new Promise((resolve) => setTimeout(resolve, 1200));

  try {
    const client = await clientPromise;
    const db = client.db();
    const data = parsed.data;

    if (data.actionType === 'register') {
      const normalizedEmail = data.email.toLowerCase();
      const existingUser = await db.collection('users').findOne({ email: normalizedEmail });
      if (existingUser) {
        return { success: false, error: 'כתובת אימייל זו כבר רשומה במערכת' };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      await db.collection('users').insertOne({
        name: data.name,
        email: normalizedEmail,
        password: hashedPassword,
        createdAt: new Date(),
      });
      return { success: true, targetUrl: '/splash' };
    } else {
      const normalizedEmail = data.email.toLowerCase();
      const user = await db.collection('users').findOne({ email: normalizedEmail });
      if (!user || !user.password) {
        return { success: false, error: 'פרטי התחברות שגויים' };
      }

      const isValid = await bcrypt.compare(data.password, user.password);
      if (!isValid) {
        return { success: false, error: 'פרטי התחברות שגויים' };
      }

      return { success: true, targetUrl: '/splash' };
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: any) {
    return { success: false, error: 'אירעה שגיאה בשרת. אנא נסה שנית.' };
  }
}
