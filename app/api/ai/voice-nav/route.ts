import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { searchMovies } from "@/lib/tmdb";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ success: false, error: 'No transcript provided' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            action: {
              type: SchemaType.STRING,
              description: "The intended action. Must be exactly 'navigate', 'book_ticket', or 'unknown'."
            },
            route: {
              type: SchemaType.STRING,
              description: "The route to navigate to. Must be one of: '/', '/tickets', '/favorites', '/discovery', '/profile', '/splinter-demo', '/showcase', '/vision', '/coming-soon', '/vip', or '' if unknown/book_ticket."
            },
            feedback: {
              type: SchemaType.STRING,
              description: "A short, natural, enthusiastic Hebrew response confirming the action. If unknown, apologize in Hebrew."
            },
            bookingDetails: {
              type: SchemaType.OBJECT,
              description: "Details of the booking, if action is 'book_ticket'.",
              properties: {
                movieName: { type: SchemaType.STRING, description: "The name of the movie." },
                ticketCount: { type: SchemaType.NUMBER, description: "Number of tickets." },
                foodItems: { 
                  type: SchemaType.ARRAY, 
                  items: { type: SchemaType.STRING },
                  description: "List of food and drink items." 
                },
                autoPayment: { type: SchemaType.BOOLEAN, description: "Whether automatic payment was requested." }
              }
            }
          },
          required: ["action", "feedback"]
        }
      }
    });

    const prompt = `
      You are the AI Voice Concierge for a hyper-premium movie booking platform.
      A user has spoken the following voice command (often in Hebrew): "${transcript}"
      
      Determine if their intent is to navigate the app or to book a ticket autonomously.
      
      If their intent is to book a ticket (e.g., "book 2 tickets to deadpool with popcorn and pay automatically"), set action="book_ticket".
      Extract the movieName, ticketCount, foodItems array, and autoPayment boolean into bookingDetails. 
      Write a full, polite, engaging Hebrew sentence confirming the booking explicitly (e.g. "הזמנתי עבורך 2 כרטיסים לדדפול יחד עם פופקורן. התשלום בוצע אוטומטית, מיד תועבר לכרטיסים שלך!").
      
      If their intent matches a route, set action="navigate", provide the exact route, and write a full, polite, engaging Hebrew sentence confirming the action explicitly.
      Valid routes: "/", "/tickets", "/favorites", "/discovery", "/profile", "/splinter-demo", "/showcase", "/vision", "/coming-soon", "/vip".
      
      If their intent has absolutely nothing to do with the app or booking, set action="unknown" and write a polite Hebrew apology.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    if (data.action === 'book_ticket' && data.bookingDetails) {
      // 1. Authenticate
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json({
          success: true,
          data: {
            action: 'navigate',
            route: '/login',
            feedback: 'על מנת שאוכל להזמין עבורך כרטיסים באופן אוטומטי, עליך להתחבר למערכת תחילה.'
          }
        });
      }

      // 2. TMDB Search for movie
      const movies = await searchMovies(data.bookingDetails.movieName);
      const movie = movies.length > 0 ? movies[0] : null;

      if (!movie) {
        return NextResponse.json({
          success: true,
          data: {
            action: 'navigate',
            route: '/',
            feedback: `לא הצלחתי למצוא את הסרט ${data.bookingDetails.movieName}. אנא נסה שנית.`
          }
        });
      }

      // 3. Generate Mock VIP seats
      const count = data.bookingDetails.ticketCount || 1;
      const seats = Array.from({ length: count }, (_, i) => `VIP-${Math.floor(Math.random() * 90) + 10}`);

      // 4. Create booking
      const client = await clientPromise;
      const db = client.db();
      
      const expectedTotal = (count * 45) + (data.bookingDetails.foodItems?.length || 0) * 20;
      const pointsEarned = Math.floor(expectedTotal * 0.1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newBooking: any = {
        userId: session.user.id,
        userEmail: session.user.email,
        movie: {
          id: movie.id,
          title: movie.title || movie.name,
          displayTitle: movie.displayTitle,
          poster_path: movie.poster_path
        },
        seats,
        food: data.bookingDetails.foodItems?.map((f: string) => ({ name: f, price: 20 })) || [],
        total: expectedTotal,
        pointsEarned,
        pointsUsed: 0,
        paymentInfo: {
          cardName: session.user.name || "Auto AI Payment",
          lastFour: "1234",
        },
        status: "confirmed",
        createdAt: new Date(),
        showtime: "20:00",
        date: new Date().toLocaleDateString('he-IL'),
        hall: "אולם VIP 01",
        isAiBooking: true
      };

      const bookingResult = await db.collection("bookings").insertOne(newBooking);

      // Give points
      await db.collection("users").updateOne(
        { email: session.user.email },
        { $inc: { points: pointsEarned } }
      );
      
      await db.collection("loyaltyusers").updateOne(
        { userId: session.user.id },
        { $inc: { points: pointsEarned } },
        { upsert: true }
      );
      
      // Ledger entry
      if (pointsEarned > 0) {
        await db.collection("loyalty_ledger").insertOne({
          userId: session.user.id,
          pointsDelta: pointsEarned,
          reason: "TICKET_PURCHASE_AI",
          bookingId: bookingResult.insertedId.toString(),
          timestamp: new Date()
        });
      }

      // Send email with tickets
      try {
        const origin = req.nextUrl.origin;
        await fetch(`${origin}/api/send-ticket`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            movieTitle: movie.displayTitle || movie.title || movie.name,
            seats: seats,
            price: expectedTotal,
            orderId: bookingResult.insertedId.toString(),
            posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
            date: newBooking.date,
            time: newBooking.showtime,
            hall: newBooking.hall,
            userName: session.user.name || 'אורח'
          }),
        });
      } catch (emailErr) {
        console.error("Auto AI Email failed:", emailErr);
      }

      // Return navigate instruction
      return NextResponse.json({
        success: true,
        data: {
          action: 'navigate',
          route: '/tickets',
          feedback: data.feedback || `הזמנתי עבורך ${count} כרטיסים לסרט ${movie.displayTitle}. התשלום בוצע אוטומטית. מעביר אותך לכרטיסים!`
        }
      });
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Gemini Voice Nav Error:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to process voice command' },
      { status: 500 }
    );
  }
}
