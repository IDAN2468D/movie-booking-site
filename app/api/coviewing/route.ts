import { NextResponse } from 'next/server';
import { z } from 'zod';

const CoViewingInviteSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  friendId: z.string().min(1, 'Friend ID is required'),
  seatId: z.string().min(1, 'Seat ID is required'),
});

// In-memory store simulation (since we must not expose MongoDB directly, and for this prototype we simulate the DB response)
// A real implementation would use the server-side MongoDB adapter.
const activeSessions = new Map<string, { expiresAt: number; status: 'pending' | 'locked' }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Zod Validation Boundary
    const parsed = CoViewingInviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { userId, friendId, seatId } = parsed.data;
    const sessionKey = `${userId}-${friendId}-${seatId}`;

    // 2. Logic Simulation (5 Min TTL)
    const now = Date.now();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes TTL

    activeSessions.set(sessionKey, { expiresAt, status: 'pending' });

    // 3. Standardized Output
    return NextResponse.json({
      success: true,
      data: {
        sessionId: sessionKey,
        expiresAt,
        status: 'pending',
        message: 'Invitation sent. Seat locked for 5 minutes.',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, action } = body;

    if (!sessionId || !action) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const session = activeSessions.get(sessionId);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found or expired' }, { status: 404 });
    }

    if (Date.now() > session.expiresAt) {
      activeSessions.delete(sessionId);
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 400 });
    }

    if (action === 'confirm') {
      activeSessions.set(sessionId, { ...session, status: 'locked' });
      return NextResponse.json({ success: true, data: { status: 'locked' } });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// In-memory amplitude store (simulating real-time WebSocket/SSE state)
const activeAmplitudes = new Map<string, number>();

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, amplitude } = body;
    
    if (userId && typeof amplitude === 'number') {
      activeAmplitudes.set(userId, amplitude);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // Returns all current amplitudes (Polling simulation for the demo)
  return NextResponse.json({
    success: true,
    data: Object.fromEntries(activeAmplitudes)
  });
}

