import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { rewardId, points } = await req.json();

    if (!rewardId || !points) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('movie-booking');
    
    // 1. Get User
    const user = await db.collection('users').findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // 2. Check Points
    const currentPoints = user.points || 0;
    if (currentPoints < points) {
      return NextResponse.json({ success: false, error: 'Insufficient points' }, { status: 400 });
    }

    // 3. Deduct Points & Save Redemption
    const voucherCode = `RW-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;
    
    await db.collection('users').updateOne(
      { email: session.user.email },
      { $inc: { points: -points } }
    );

    await db.collection('redemptions').insertOne({
      userId: user._id,
      rewardId,
      points,
      code: voucherCode,
      createdAt: new Date(),
      status: 'active'
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        code: voucherCode,
        newPoints: currentPoints - points
      }
    });

  } catch (error) {
    console.error('Redemption error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
