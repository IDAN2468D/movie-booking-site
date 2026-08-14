"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { VipRsvp, IVipRsvp } from "@/lib/models/VipRsvp";
import {
  CreateVipRsvpSchema,
  CreateVipRsvpInput,
} from "@/lib/validations/vipRsvpValidation";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export interface SavedVipRsvpData {
  id: string;
  movieTitle: string;
  guestName: string;
  phoneNumber: string;
  seatsCount: number;
  seatsList: string[];
  reservationCode: string;
  status: string;
  createdAt: string;
}

export async function createVipRsvpAction(
  input: CreateVipRsvpInput
): Promise<ActionResponse<SavedVipRsvpData>> {
  try {
    const validated = CreateVipRsvpSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { movieTitle, guestName, phoneNumber, seatsCount, notes } = validated.data;
    await connectToDatabase();

    // Generate unique VIP reservation code
    const phoneSuffix = phoneNumber.replace(/\D/g, "").slice(-4) || "0000";
    const reservationCode = `VIP-${Date.now().toString(36).toUpperCase()}-${phoneSuffix}`;

    // Auto-allocate VIP lounge seats if not supplied
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

    return {
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
        createdAt: newRsvp.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("createVipRsvpAction error:", error);
    return { success: false, error: "שגיאה בשמירת אישור ההגעה והמושבים" };
  }
}

export async function getVipRsvpAction(
  reservationCode: string
): Promise<ActionResponse<SavedVipRsvpData>> {
  try {
    if (!reservationCode) {
      return { success: false, error: "קוד הזמנה נדרש" };
    }

    await connectToDatabase();
    const doc = (await VipRsvp.findOne({ reservationCode }).lean()) as IVipRsvp | null;

    if (!doc) {
      return { success: false, error: "אישור הגעה לא נמצא" };
    }

    return {
      success: true,
      data: {
        id: doc._id.toString(),
        movieTitle: doc.movieTitle,
        guestName: doc.guestName,
        phoneNumber: doc.phoneNumber,
        seatsCount: doc.seatsCount,
        seatsList: doc.seatsList,
        reservationCode: doc.reservationCode,
        status: doc.status,
        createdAt: doc.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("getVipRsvpAction error:", error);
    return { success: false, error: "שגיאה בטעינת אישור ההגעה" };
  }
}
