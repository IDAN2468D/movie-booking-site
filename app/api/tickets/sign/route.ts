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
  } catch (error: unknown) {
    console.error('Error signing ticket:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign ticket';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
