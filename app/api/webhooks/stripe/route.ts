import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature');

    // Parse the payload (mocking Stripe webhook handling and signature verification)
    const event = JSON.parse(payload);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { groupId, seatLocks } = session.metadata;

      // Handle successful split bill and solidify the seat locks
      console.log(`[Stripe Webhook] Session ${session.id} completed. Securing locks for ${seatLocks}`);
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const { groupId, seatLocks } = session.metadata;
      // Atomic release of cluster locks
      console.log(`[Stripe Webhook] Session ${session.id} expired. Releasing atomic locks for ${seatLocks}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('[Stripe Webhook Error]', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
}
