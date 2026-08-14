import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { VipRsvp } from "@/lib/models/VipRsvp";
import { CreateVipRsvpSchema } from "@/lib/validations/vipRsvpValidation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateVipRsvpSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { movieTitle, guestName, phoneNumber, seatsCount, notes } = validated.data;
    await connectToDatabase();

    const phoneSuffix = phoneNumber.replace(/\D/g, "").slice(-4) || "0000";
    const reservationCode = `VIP-${Date.now().toString(36).toUpperCase()}-${phoneSuffix}`;

    let allocatedSeats = validated.data.seatsList;
    if (!allocatedSeats || allocatedSeats.length === 0) {
      allocatedSeats = Array.from(
        { length: seatsCount },
        (_, i) => `VIP-A${i + 1}`
      );
    }

    const newRsvp = await VipRsvp.create({
      movieTitle,
      guestName,
      phoneNumber,
      seatsCount,
      seatsList: allocatedSeats,
      reservationCode,
      status: "confirmed",
      notes,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newRsvp._id.toString(),
        movieTitle: newRsvp.movieTitle,
        guestName: newRsvp.guestName,
        phoneNumber: newRsvp.phoneNumber,
        seatsCount: newRsvp.seatsCount,
        seatsList: newRsvp.seatsList,
        reservationCode: newRsvp.reservationCode,
        status: newRsvp.status,
      },
    });
  } catch (error) {
    console.error("API VIP RSVP error:", error);
    return NextResponse.json(
      { success: false, error: "שגיאה בשמירת אישור ההגעה" },
      { status: 500 }
    );
  }
}
