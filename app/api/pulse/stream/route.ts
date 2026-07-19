import { NextRequest } from "next/server";

const CITIES = ["תל אביב", "חיפה", "ירושלים", "ראשון לציון", "באר שבע", "הרצליה", "פתח תקווה"];
const MOVIES = ["Inception", "Interstellar", "The Dark Knight", "Oppenheimer", "Dune", "Avatar", "The Matrix"];
const SIZES = ["small", "medium", "large"];

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
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

        controller.enqueue(encoder.encode(`event: pulse\ndata: ${JSON.stringify(data)}\n\n`));
      };

      // Initial burst to populate
      setTimeout(sendEvent, 1000);
      setTimeout(sendEvent, 2500);

      const interval = setInterval(sendEvent, 5000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
