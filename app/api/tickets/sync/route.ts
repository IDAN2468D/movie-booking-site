import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SeatLock from '@/lib/models/SeatLock';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  
  const showtimeId = req.nextUrl.searchParams.get('showtimeId');
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial data
        const initialLocks = await SeatLock.find(showtimeId ? { showtimeId } : {});
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'initial', data: initialLocks })}\n\n`));

        // Setup MongoDB Change Stream
        const changeStream = SeatLock.watch([], { fullDocument: 'updateLookup' });

        changeStream.on('change', (change) => {
          if (showtimeId && change.fullDocument && change.fullDocument.showtimeId !== showtimeId) {
            return;
          }
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'change', data: change })}\n\n`));
        });

        req.signal.addEventListener('abort', () => {
          changeStream.close();
        });
      } catch (error) {
        console.error('SSE Error:', error);
        controller.error(error);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
