import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SeatLock from '@/lib/models/SeatLock';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { seatId, showtimeId, userId, action } = await req.json();

    if (!seatId || !showtimeId || !userId || !action) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (action === 'hold') {
      // Create a pessimistic lock for 10 minutes
      const lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      try {
        const newLock = await SeatLock.create({
          seatId,
          showtimeId,
          userId,
          lockExpiresAt,
          status: 'held'
        });
        return NextResponse.json({ success: true, data: newLock });
      } catch (error: any) {
        if (error.code === 11000) { // Duplicate key error
          return NextResponse.json({ success: false, error: 'Seat is already locked by another user' }, { status: 409 });
        }
        throw error;
      }
    } else if (action === 'release') {
      // Only the user who held it can release it
      const result = await SeatLock.deleteOne({ seatId, showtimeId, userId });
      if (result.deletedCount > 0) {
        return NextResponse.json({ success: true, data: { released: true } });
      } else {
        return NextResponse.json({ success: false, error: 'Lock not found or unauthorized' }, { status: 404 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in /api/tickets/hold:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
