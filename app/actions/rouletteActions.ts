"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { ShowtimeSeats } from "@/lib/models/ShowtimeSeats";
import { lockRouletteSeatSchema, LockRouletteSeatInput } from "@/lib/validations/roulette";

export async function lockRouletteSeatAction(payload: LockRouletteSeatInput) {
  try {
    await connectToDatabase();
    
    const validated = lockRouletteSeatSchema.parse(payload);
    const { showtimeId, seatId, userId } = validated;

    // Check if the showtime exists in the database. If not, auto-seed it using the s-X format.
    let showtimeDoc = await ShowtimeSeats.findOne({ showtimeId });
    
    // Self-healing: if document exists but uses old 's-X' format, delete it so we can re-seed
    if (showtimeDoc && showtimeDoc.seats && showtimeDoc.seats.length > 0 && showtimeDoc.seats[0].seatId.startsWith('s-')) {
      await ShowtimeSeats.deleteOne({ showtimeId });
      showtimeDoc = null;
    }

    if (!showtimeDoc) {
      const seats = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const cols = [1, 2, 3, 4, 5, 6];
      
      for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < cols.length; c++) {
          const seatIndex = r * 6 + c;
          const currentSeatId = `${rows[r]}${cols[c]}`;
          const isVip = rows[r] === 'G' || rows[r] === 'H';
          
          seats.push({
            seatId: currentSeatId,
            row: rows[r],
            col: cols[c],
            type: (isVip ? 'vip' : 'standard') as 'standard' | 'vip',
            status: 'available' as 'available' | 'locked' | 'occupied',
            lockedBy: null,
            lockedAt: null
          });
        }
      }
      
      await ShowtimeSeats.create({ showtimeId, seats });
    }

    // Atomic update to prevent race conditions
    const result = await ShowtimeSeats.findOneAndUpdate(
      {
        showtimeId,
        seats: {
          $elemMatch: {
            seatId,
            status: 'available'
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
      return { 
        success: false, 
        error: "מושב זה נתפס כבר או שאינו זמין יותר. אנא נסה שנית." 
      };
    }

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(result)) 
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { 
        success: false, 
        error: error.issues?.[0]?.message || error.message 
      };
    }
    return { 
      success: false, 
      error: "שגיאה בנעילת המושב המיועד" 
    };
  }
}
