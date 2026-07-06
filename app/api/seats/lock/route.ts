import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SeatLockSchema } from '@/lib/validations/seat';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SeatLockSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid lock payload', data: parsed.error.format() }, { status: 400 });
    }
    
    const { showtimeId, seatId, userId } = parsed.data;
    
    const client = await clientPromise;
    const db = client.db();
    
    const bookings = db.collection('bookings');
    const confirmed = await bookings.findOne({ showtimeId, "seats.seatId": seatId });
    if (confirmed) {
      return NextResponse.json({ success: false, error: 'Seat is already booked' });
    }
    
    const locks = db.collection('temporary_locks');
    await locks.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 });
    await locks.createIndex({ showtimeId: 1, seatId: 1 }, { unique: true });
    
    try {
      await locks.updateOne(
        { showtimeId, seatId },
        { 
          $setOnInsert: { showtimeId, seatId, userId, createdAt: new Date() }
        },
        { upsert: true }
      );
      
      const currentLock = await locks.findOne({ showtimeId, seatId });
      if (currentLock && currentLock.userId !== userId) {
        return NextResponse.json({ success: false, error: 'Seat is currently locked by another user' });
      }
      
      if (currentLock && currentLock.userId === userId) {
        await locks.updateOne({ _id: currentLock._id }, { $set: { createdAt: new Date() } });
      }
      
      return NextResponse.json({ success: true, data: { showtimeId, seatId, locked: true } });
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Seat is currently locked by another user' });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
