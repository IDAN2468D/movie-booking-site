"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { ShowtimeSeats, ISeat } from "@/lib/models/ShowtimeSeats";
import { seatActionSchema, SeatActionInput } from "@/lib/validations/seats";

export async function seedShowtimeSeats(showtimeId: string) {
  await connectToDatabase();
  
  const existing = await ShowtimeSeats.findOne({ showtimeId });
  if (existing) return { success: true, data: JSON.parse(JSON.stringify(existing)) };

  // Create mock seats for the Liquid Glass 3.0 UI showcase
  const seats: ISeat[] = [];
  const rows = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז'];
  const cols = 12;

  for (let r = 0; r < rows.length; r++) {
    for (let c = 1; c <= cols; c++) {
      const isVip = rows[r] === 'ה' || rows[r] === 'ו'; 
      // Randomly occupy some seats to simulate traffic
      const isOccupied = Math.random() > 0.85;
      
      seats.push({
        seatId: `${rows[r]}-${c}`,
        row: rows[r],
        col: c,
        type: isVip ? 'vip' : 'standard',
        status: isOccupied ? 'occupied' : 'available',
        lockedBy: null,
        lockedAt: null
      });
    }
  }

  const newShowtime = await ShowtimeSeats.create({ showtimeId, seats });
  return { success: true, data: JSON.parse(JSON.stringify(newShowtime)) };
}

export async function lockSeatAction(payload: SeatActionInput) {
  try {
    await connectToDatabase();
    const validated = seatActionSchema.parse(payload);
    const { showtimeId, seatId, userId } = validated;

    // Atomic update to eliminate race conditions
    const result = await ShowtimeSeats.findOneAndUpdate(
      {
        showtimeId,
        seats: {
          $elemMatch: {
            seatId,
            $or: [
              { status: 'available' },
              { status: 'locked', lockedBy: userId }
            ]
          }
        }
      },
      {
        $set: {
          "seats.$.status": "locked",
          "seats.$.lockedBy": userId,
          "seats.$.lockedAt": new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return { success: false, error: "מושב זה נתפס על ידי משתמש אחר, אנא בחר מושב חלופי" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.issues?.[0]?.message || error.message };
    }
    return { success: false, error: "שגיאה בנעילת המושב" };
  }
}

export async function releaseSeatAction(payload: SeatActionInput) {
  try {
    await connectToDatabase();
    const validated = seatActionSchema.parse(payload);
    const { showtimeId, seatId, userId } = validated;

    const result = await ShowtimeSeats.findOneAndUpdate(
      {
        showtimeId,
        seats: {
          $elemMatch: {
            seatId,
            lockedBy: userId
          }
        }
      },
      {
        $set: {
          "seats.$.status": "available",
          "seats.$.lockedBy": null,
          "seats.$.lockedAt": null
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return { success: false, error: "לא ניתן לשחרר מושב זה" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, error: error.issues?.[0]?.message || error.message };
    }
    return { success: false, error: "שגיאה בשחרור המושב" };
  }
}
