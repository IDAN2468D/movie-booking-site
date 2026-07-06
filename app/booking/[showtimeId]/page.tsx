import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { ShowtimeSeats } from "@/lib/models/ShowtimeSeats";
import BookingClientWrapper from "./BookingClientWrapper";

interface BookingPageProps {
  params: Promise<{ showtimeId: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const resolvedParams = await params;
  const showtimeId = resolvedParams.showtimeId;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  await connectToDatabase();

  let occupiedSeats: string[] = [];

  try {
    const showtimeData = await ShowtimeSeats.findOne({ showtimeId }).lean();
    if (showtimeData && showtimeData.seats) {
      occupiedSeats = showtimeData.seats
        .filter((seat: any) => seat.status === 'locked' || seat.status === 'occupied')
        .map((seat: any) => seat.seatId);
    }
  } catch (error) {
    console.error("Error fetching showtime seats:", error);
  }

  return (
    <BookingClientWrapper 
      showtimeId={showtimeId} 
      userId={userId} 
      occupiedSeats={occupiedSeats} 
    />
  );
}
