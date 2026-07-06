'use server';

import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export async function getUserHaptics(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const haptics = await db.collection('moviehaptics').findOne({ userId: new ObjectId(userId) });
    
    if (!haptics) {
      return { success: true, data: { vibration: 50, scent: false, air: 30, light: 70 } };
    }
    
    return { 
      success: true, 
      data: { ...haptics, _id: haptics._id.toString(), userId: haptics.userId.toString() } 
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveUserHaptics(userId: string, settings: any) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('moviehaptics').updateOne(
      { userId: new ObjectId(userId) },
      { $set: { ...settings, updatedAt: new Date() } },
      { upsert: true }
    );
    
    revalidatePath('/vip/liquid-capital');
    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
