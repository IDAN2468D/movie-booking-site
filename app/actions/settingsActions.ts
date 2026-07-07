'use server';

import { cryptoProfileSchema, notificationSettingsSchema, dataPurgeSchema } from '@/lib/validations/settings';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export interface ActionResult {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}

export async function updateCryptographicProfileAction(userEmail: string, payload: unknown): Promise<ActionResult> {
  const parsed = cryptoProfileSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const user = await db.collection('users').findOne({ email: userEmail });
    if (!user || !user.password) {
      return { success: false, error: 'משתמש לא נמצא' };
    }

    const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: 'הסיסמה הנוכחית שגויה' };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);
    await db.collection('users').updateOne(
      { email: userEmail },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    return { success: true, data: { message: 'הפרופיל הקריפטוגרפי עודכן בהצלחה' } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return { success: false, error: 'שגיאה בעדכון הפרופיל הקריפטוגרפי' };
  }
}

export async function updateNotificationMatrixAction(userEmail: string, payload: unknown): Promise<ActionResult> {
  const parsed = notificationSettingsSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('users').updateOne(
      { email: userEmail },
      { $set: { notificationMatrix: parsed.data, updatedAt: new Date() } }
    );

    return { success: true, data: { message: 'מטריצת ההתראות סונכרנה בהצלחה' } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return { success: false, error: 'שגיאה בסנכרון מטריצת ההתראות' };
  }
}

export async function executeDataPurgeAction(userEmail: string, payload: unknown): Promise<ActionResult> {
  const parsed = dataPurgeSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const unsetPayload: any = { cache: 1 };
    if (parsed.data.purgeType === 'history' || parsed.data.purgeType === 'all') {
      unsetPayload.searchHistory = 1;
    }
    if (parsed.data.purgeType === 'all') {
      unsetPayload.savedPreferences = 1;
      unsetPayload.liquidGlassOptics = 1;
    }

    await db.collection('users').updateOne(
      { email: userEmail },
      { $unset: unsetPayload }
    );

    return { success: true, data: { message: 'טיהור הנתונים בוצע בהצלחה (Atomic Cache Cleared)' } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return { success: false, error: 'שגיאה בביצוע טיהור נתונים מול MongoDB' };
  }
}
