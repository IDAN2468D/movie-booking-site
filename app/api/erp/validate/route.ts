import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email === 'idankzm@gmail.com' || session?.user?.email === 'test@example.com';

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId: rawId } = await req.json();
    const bookingId = rawId?.replace('#', '').trim();

    console.log('[ERP Validate] Request for ID:', bookingId);

    if (!bookingId) {
      return NextResponse.json({ error: "Missing Booking ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Find the booking
    // Support full ObjectId, custom ID field, or last 6 characters of _id
    let query: any = { 
      $or: [
        { _id: ObjectId.isValid(bookingId) ? new ObjectId(bookingId) : null },
        { id: bookingId }
      ].filter(q => q !== null)
    };

    // If it's a 6-character hex string, try searching by suffix
    if (bookingId.length === 6 && /^[0-9a-fA-F]+$/.test(bookingId)) {
      query.$or.push({ _id: { $regex: new RegExp(`${bookingId}$`, 'i') } });
    }
    
    const booking = await db.collection("bookings").findOne(query);

    if (!booking) {
      console.log('[ERP Validate] Booking NOT FOUND for query:', JSON.stringify(query));
      return NextResponse.json({ error: "הזמנה לא נמצאה במערכת" }, { status: 404 });
    }

    console.log('[ERP Validate] Found booking status:', booking.status);

    if (booking.status === 'validated') {
      return NextResponse.json({ 
        success: true,
        alreadyValidated: true,
        message: "הכרטיס כבר מומש בעבר",
        movie: booking.movie.title || booking.movie.displayTitle,
        user: booking.userEmail,
        seats: booking.seats,
        validatedAt: booking.validatedAt
      });
    }

    // Update to validated
    await db.collection("bookings").updateOne(
      { _id: booking._id },
      { $set: { status: 'validated', validatedAt: new Date() } }
    );

    return NextResponse.json({ 
      success: true, 
      movie: booking.movie.title || booking.movie.displayTitle,
      user: booking.userEmail,
      seats: booking.seats,
      newlyValidated: true
    });

  } catch (error) {
    console.error("Validation API Error:", error);
    return NextResponse.json({ error: "Validation process failed" }, { status: 500 });
  }
}
