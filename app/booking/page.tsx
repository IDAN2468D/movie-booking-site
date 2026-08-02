import BookingClientWrapper from "./[showtimeId]/BookingClientWrapper";

export default function GenericBookingPage() {
  return (
    <BookingClientWrapper
      showtimeId="demo-showtime-1"
      userId="guest-user-1"
      occupiedSeats={["A3", "B5", "C2", "D4"]}
    />
  );
}
