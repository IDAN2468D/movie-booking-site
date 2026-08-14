import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { searchMovies, getMovieVideos } from "@/lib/tmdb";
import { handleAutoTicketBooking } from './autoBooking';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();
    if (!transcript) {
      return NextResponse.json({ success: false, error: 'No transcript provided' }, { status: 400 });
    }

    const { callGeminiWithRetry } = await import('@/lib/gemini');
    const modelNames = ['gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];

    const prompt = `
      You are the AI Voice Concierge for a hyper-premium movie booking platform.
      A user has spoken the following voice command (often in Hebrew): "${transcript}"
      
      Determine if their intent is to:
      1. Play/watch a movie trailer (e.g. "הפעל טריילר של גלדיאטור", "תראה לי טריילר של חולית", "play trailer for deadpool", "טריילר של באטמן"). Set action="play_trailer", extract movieName into trailerDetails.
      2. Book a ticket autonomously (e.g. "הזמן 2 כרטיסים לדדפול עם פופקורן"). Set action="book_ticket", extract movieName, ticketCount, foodItems into bookingDetails.
      3. Navigate to a route (e.g. "פתח כרטיסים", "עבור לדף הבית"). Set action="navigate", provide exact route.
      Valid routes: "/", "/tickets", "/favorites", "/discovery", "/profile", "/soundtracks", "/discover/coop", "/food", "/rewards", "/cinema", "/concierge", "/shazam", "/trophy-vault", "/news", "/wrapped", "/splinter-demo", "/showcase", "/vision", "/coming-soon", "/vip".
      4. If unrelated, set action="unknown".
    `;

    const responseText = await callGeminiWithRetry(modelNames, async (m) => {
      const model = genAI.getGenerativeModel({
        model: m.model,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              action: {
                type: SchemaType.STRING,
                description: "The intended action: 'play_trailer', 'navigate', 'book_ticket', or 'unknown'."
              },
              route: {
                type: SchemaType.STRING,
                description: "The route to navigate to if action is 'navigate'."
              },
              feedback: {
                type: SchemaType.STRING,
                description: "A short, natural, enthusiastic Hebrew response confirming the action."
              },
              trailerDetails: {
                type: SchemaType.OBJECT,
                description: "Details if action is 'play_trailer'.",
                properties: {
                  movieName: { type: SchemaType.STRING, description: "Name of the movie to play trailer for." }
                }
              },
              bookingDetails: {
                type: SchemaType.OBJECT,
                description: "Details if action is 'book_ticket'.",
                properties: {
                  movieName: { type: SchemaType.STRING },
                  ticketCount: { type: SchemaType.NUMBER },
                  foodItems: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                  autoPayment: { type: SchemaType.BOOLEAN }
                }
              }
            },
            required: ["action", "feedback"]
          }
        }
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    });

    const data = JSON.parse(responseText);

    // Handle Play Trailer Action
    if (data.action === 'play_trailer' && (data.trailerDetails?.movieName || transcript)) {
      const movieQuery = data.trailerDetails?.movieName || transcript.replace(/טריילר|הפעל|תראה לי|play|trailer/gi, '').trim();
      const searchRes = await searchMovies(movieQuery);
      if (searchRes.length > 0) {
        const foundMovie = searchRes[0];
        const videos = await getMovieVideos(foundMovie.id);
        const youtubeTrailer = videos.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || videos[0];

        if (youtubeTrailer) {
          return NextResponse.json({
            success: true,
            data: {
              action: 'play_trailer',
              movieId: String(foundMovie.id),
              movieTitle: foundMovie.displayTitle || foundMovie.title,
              trailerKey: youtubeTrailer.key,
              videoList: videos.map(v => ({ id: v.id, key: v.key, name: v.name })),
              feedback: `מפעיל כעת את הטריילר של ${foundMovie.displayTitle || foundMovie.title} בנגן הקולנועי!`
            }
          });
        }
      }
    }

    // Handle Autonomous Ticket Booking
    if (data.action === 'book_ticket' && data.bookingDetails) {
      const bookingData = await handleAutoTicketBooking(req, data.bookingDetails, data.feedback);
      return NextResponse.json({ success: true, data: bookingData });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Gemini Voice Nav Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to process voice command' }, { status: 500 });
  }
}
