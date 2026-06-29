import { DynamicSeatMap } from "@/components/booking/DynamicSeatMap";
import { notFound } from "next/navigation";

export const metadata = {
  title: "בחירת מושבים | MovieBook",
};

export default async function SeatSelectionPage({ params }: { params: { showtimeId: string } }) {
  const { showtimeId } = await params;
  
  if (!showtimeId) {
    notFound();
  }

  // Mocking userId for scaffolding since we don't have the auth scope yet
  const userId = "test-seat-user";

  return <DynamicSeatMap showtimeId={showtimeId} userId={userId} />;
}
