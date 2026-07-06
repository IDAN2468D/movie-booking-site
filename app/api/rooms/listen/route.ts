import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get('roomCode');

  if (!roomCode || roomCode.length !== 6) {
    return NextResponse.json({ success: false, error: 'Invalid roomCode' }, { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const client = await clientPromise;
      const db = client.db();
      const rooms = db.collection('rooms');
      
      let isClosed = false;
      const intervalId = setInterval(async () => {
        if (isClosed) return;
        
        try {
          const room = await rooms.findOne({ roomCode });
          if (room && room.status === 'matched') {
            const data = JSON.stringify({ success: true, data: { match: true, matchedMovieId: room.matchedMovieId } });
            controller.enqueue(`data: ${data}\n\n`);
            
            isClosed = true;
            clearInterval(intervalId);
            controller.close();
          }
        } catch (error) {
          isClosed = true;
          clearInterval(intervalId);
          controller.error(error);
        }
      }, 2000);

      req.signal.addEventListener('abort', () => {
        isClosed = true;
        clearInterval(intervalId);
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
