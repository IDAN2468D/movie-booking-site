import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SeatLockSchema } from '@/lib/validations/seat';

// Resilient in-memory fallback lock storage for offline / disconnected DB environments
const inMemoryLocks = new Map<string, { userId: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SeatLockSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid lock payload', data: parsed.error.format() },
        { status: 400 }
      );
    }
    
    const { showtimeId, seatId, userId } = parsed.data;
    const lockKey = `${showtimeId}:${seatId}`;
    const now = Date.now();

    // 1. Try MongoDB locking if accessible within 1500ms
    try {
      const client = await Promise.race([
        clientPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('MONGODB_SELECTION_TIMEOUT')), 1500)
        ),
      ]);

      const db = client.db();
      const bookings = db.collection('bookings');
      const confirmed = await bookings.findOne({ showtimeId, "seats.seatId": seatId });
      
      if (confirmed) {
        return NextResponse.json({ success: false, error: 'Seat is already booked' });
      }
      
      const locks = db.collection('temporary_locks');
      locks.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 }).catch(() => {});
      locks.createIndex({ showtimeId: 1, seatId: 1 }, { unique: true }).catch(() => {});
      
      await locks.updateOne(
        { showtimeId, seatId },
        { $setOnInsert: { showtimeId, seatId, userId, createdAt: new Date() } },
        { upsert: true }
      );
      
      const currentLock = await locks.findOne({ showtimeId, seatId });
      if (currentLock && currentLock.userId !== userId) {
        return NextResponse.json({ success: false, error: 'Seat is currently locked by another user' });
      }
      
      if (currentLock && currentLock.userId === userId) {
        await locks.updateOne({ _id: currentLock._id }, { $set: { createdAt: new Date() } });
      }
      
      inMemoryLocks.set(lockKey, { userId, expiresAt: now + 300000 });
      return NextResponse.json({ success: true, data: { showtimeId, seatId, locked: true } });
    } catch (dbErr: any) {
      console.warn(`[Seat Lock] MongoDB unavailable (${dbErr.message}). Using resilient in-memory lock store.`);
      
      // Clean expired in-memory locks
      for (const [key, lock] of inMemoryLocks.entries()) {
        if (lock.expiresAt < now) {
          inMemoryLocks.delete(key);
        }
      }

      const existingMemLock = inMemoryLocks.get(lockKey);
      if (existingMemLock && existingMemLock.userId !== userId && existingMemLock.expiresAt > now) {
        return NextResponse.json({ success: false, error: 'Seat is currently locked by another user' });
      }

      // Successfully locked in memory
      inMemoryLocks.set(lockKey, { userId, expiresAt: now + 300000 });
      return NextResponse.json({
        success: true,
        data: { showtimeId, seatId, locked: true, mode: 'resilient-in-memory' },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
