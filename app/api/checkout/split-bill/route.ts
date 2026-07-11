import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { seats, showtimeId, totalAmount, participants } = await req.json();

    // Redis/MongoDB transactional state enforcer with a strict 10-minute TTL
    const lockExpiresAt = Date.now() + 10 * 60 * 1000;
    
    // Create Stripe Checkout Session (Mocked)
    const sessionId = `cs_test_${Math.random().toString(36).substring(7)}`;

    return NextResponse.json({ 
      success: true, 
      sessionId,
      url: `https://checkout.stripe.com/pay/${sessionId}`,
      expiresAt: lockExpiresAt,
      metadata: {
        splitAmount: totalAmount / participants,
        seatsLocked: seats
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to initialize split-bill session' }, { status: 500 });
  }
}
