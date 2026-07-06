import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { signTicketPayload } from '@/lib/utils/ticket-signer';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type !== 'checkout.session.completed') {
      return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    const { bookingId, showtimeId, seats } = body.data;

    if (!bookingId || !showtimeId || !seats || !Array.isArray(seats)) {
      return NextResponse.json({ success: false, error: 'Invalid webhook payload' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    let objectId;
    try {
      objectId = new ObjectId(bookingId);
    } catch {
      objectId = bookingId;
    }

    const bookings = db.collection('bookings');
    const updateResult = await bookings.updateOne(
      { _id: objectId, status: 'pending' },
      { $set: { status: 'confirmed', confirmedAt: new Date() } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ success: false, error: 'Booking not found or already processed' }, { status: 404 });
    }

    const locks = db.collection('temporary_locks');
    await locks.deleteMany({ showtimeId, seatId: { $in: seats } });

    const qrPayload = signTicketPayload({ bookingId: objectId.toString(), showtimeId, seats });

    await bookings.updateOne(
      { _id: objectId },
      { $set: { qrPayload } }
    );

    return NextResponse.json({ success: true, data: { bookingId: objectId.toString(), status: 'confirmed', qrPayload } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
