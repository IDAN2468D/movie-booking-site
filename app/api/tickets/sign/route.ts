import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'dev-secret-placeholder-for-stability';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, title, seats, showtime } = body;
    
    if (!bookingId) {
      return NextResponse.json({ success: false, error: 'Missing booking ID' }, { status: 400 });
    }

    // Create a compact payload for the QR code
    const payload = {
      bId: bookingId,
      t: title,
      s: seats,
      st: showtime,
      iss: 'liquid-glass-cinema'
    };
    
    // The token represents the digital ticket
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
    
    return NextResponse.json({ success: true, data: { token } });
  } catch (error: any) {
    console.error('Error signing ticket:', error);
    return NextResponse.json({ success: false, error: 'Failed to sign ticket' }, { status: 500 });
  }
}
