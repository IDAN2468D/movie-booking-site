'use server';

import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { loginSchema, registerSchema } from '@/lib/validations/authSchema';

export interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function loginAction(prevState: any, formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Validate inputs
    const validated = loginSchema.parse({ email, password });

    const client = await clientPromise;
    const db = client.db();
    const normalizedEmail = validated.email.toLowerCase();

    const user = await db.collection('users').findOne({ email: normalizedEmail });
    if (!user || !user.password) {
      return { success: false, error: 'פרטי התחברות שגויים' };
    }

    const isValid = await bcrypt.compare(validated.password, user.password);
    if (!isValid) {
      return { success: false, error: 'פרטי התחברות שגויים' };
    }

    return {
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return { success: false, error: err.errors[0].message };
    }
    return { success: false, error: 'אירעה שגיאה בשרת במהלך ההתחברות' };
  }
}

export async function registerAction(prevState: any, formData: FormData): Promise<AuthResult> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Validate inputs
    const validated = registerSchema.parse({ name, email, password });

    const client = await clientPromise;
    const db = client.db();
    const normalizedEmail = validated.email.toLowerCase();

    const existingUser = await db.collection('users').findOne({ email: normalizedEmail });
    if (existingUser) {
      return { success: false, error: 'כתובת אימייל זו כבר רשומה במערכת' };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);
    const result = await db.collection('users').insertOne({
      name: validated.name,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return {
      success: true,
      data: {
        id: result.insertedId.toString(),
        name: validated.name,
        email: normalizedEmail,
      },
    };
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return { success: false, error: err.errors[0].message };
    }
    return { success: false, error: 'אירעה שגיאה בשרת במהלך ההרשמה' };
  }
}
