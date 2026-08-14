import { NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { searchMovies } from "@/lib/tmdb";

export interface BookingDetails {
  movieName: string;
  ticketCount?: number;
  foodItems?: string[];
  autoPayment?: boolean;
}

export async function handleAutoTicketBooking(
  req: NextRequest,
  bookingDetails: BookingDetails,
  fallbackFeedback?: string
) {
  // 1. Authenticate
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return {
      action: 'navigate',
      route: '/login',
      feedback: 'על מנת שאוכל להזמין עבורך כרטיסים באופן אוטומטי, עליך להתחבר למערכת תחילה.'
    };
  }

  // 2. TMDB Search for movie
  const movies = await searchMovies(bookingDetails.movieName);
  const movie = movies.length > 0 ? movies[0] : null;

  if (!movie) {
    return {
      action: 'navigate',
      route: '/',
      feedback: `לא הצלחתי למצוא את הסרט ${bookingDetails.movieName}. אנא נסה שנית.`
    };
  }

  // 3. Generate Mock VIP seats
  const count = bookingDetails.ticketCount || 1;
  const seats = Array.from({ length: count }, (_, i) => `VIP-${Math.floor(Math.random() * 90) + 10}`);

  // 4. Create booking
  const client = await clientPromise;
  const db = client.db();
  
  const expectedTotal = (count * 45) + (bookingDetails.foodItems?.length || 0) * 20;
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
    food: bookingDetails.foodItems?.map((f: string) => ({ name: f, price: 20 })) || [],
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

  return {
    action: 'navigate',
    route: '/tickets',
    feedback: fallbackFeedback || `הזמנתי עבורך ${count} כרטיסים לסרט ${movie.displayTitle}. התשלום בוצע אוטומטית. מעביר אותך לכרטיסים!`
  };
}
