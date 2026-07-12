'use server';

import { connectToDatabase } from '@/lib/mongoose';
import SeatLock from '@/lib/models/SeatLock';
import { lockRouletteSeatSchema, LockRouletteSeatOutput } from '@/lib/validations/roulette';

export async function lockRouletteSeatAction(payload: unknown): Promise<LockRouletteSeatOutput> {
  try {
    await connectToDatabase();
    const parsed = lockRouletteSeatSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: 'קלטי נעילת מושב אינם תקינים' };
    }

    const { seatId, showtimeId, userId } = parsed.data;
    const lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      const newLock = await SeatLock.create({
        seatId,
        showtimeId,
        userId,
        lockExpiresAt,
        status: 'held',
      });
      return {
        success: true,
        message: 'מושב ננעל בהצלחה',
        lockId: newLock._id.toString(),
      };
    } catch (err: any) {
      if (err.code === 11000) {
        return { success: false, error: 'המושב נתפס על ידי משתמש אחר ברגע זה' };
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Failed to lock seat:', error);
    return { success: false, error: 'שגיאת שרת פנימית בנעילת מושב' };
  }
}
