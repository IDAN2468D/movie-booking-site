import { NextRequest } from "next/server";

const CITIES = ["תל אביב", "חיפה", "ירושלים", "ראשון לציון", "באר שבע", "הרצליה", "פתח תקווה"];
const MOVIES = ["Inception", "Interstellar", "The Dark Knight", "Oppenheimer", "Dune", "Avatar", "The Matrix"];
const SIZES = ["small", "medium", "large"];

// Global registry of active SSE controllers to broadcast events across the dev server
declare global {
  var activePulseControllers: Set<ReadableStreamDefaultController>;
  var emitVibeEvent: ((pulseId: string) => void) | undefined;
}

if (!globalThis.activePulseControllers) {
  globalThis.activePulseControllers = new Set();
}

if (!globalThis.emitVibeEvent) {
  globalThis.emitVibeEvent = (pulseId: string) => {
    const encoder = new TextEncoder();
    const message = `event: vibe_check\ndata: ${JSON.stringify({ pulseId })}\n\n`;
    globalThis.activePulseControllers.forEach(controller => {
      try {
        controller.enqueue(encoder.encode(message));
      } catch (e) {
        // Ignore stale controllers
      }
    });
  };
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      globalThis.activePulseControllers.add(controller);

      // Send initial connection successful event
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ message: "connected" })}\n\n`)
      );

      // Simulate a booking every 3-8 seconds
      const sendEvent = () => {
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];
        const movie = MOVIES[Math.floor(Math.random() * MOVIES.length)];
        const size = SIZES[Math.floor(Math.random() * SIZES.length)];
        // Random coordinates for the ripple on screen (percentages)
        const x = Math.floor(Math.random() * 80) + 10; 
        const y = Math.floor(Math.random() * 80) + 10;

        const data = {
          id: Date.now().toString(),
          message: `מישהו ב${city} הזמין כרטיס ל-${movie}`,
          size,
          x,
          y
        };

        try {
          controller.enqueue(encoder.encode(`event: pulse\ndata: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          clearInterval(interval);
        }
      };

      // Initial burst to populate
      setTimeout(sendEvent, 1000);
      setTimeout(sendEvent, 2500);

      const interval = setInterval(sendEvent, 5000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        globalThis.activePulseControllers.delete(controller);
        controller.close();
      });
    },
    cancel(controller) {
      globalThis.activePulseControllers.delete(controller);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
