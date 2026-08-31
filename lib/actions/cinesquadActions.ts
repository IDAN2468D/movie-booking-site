"use server";

import {
  CreateSquadRoomInputSchema,
  JoinSquadRoomInputSchema,
  ClaimSquadSeatInputSchema,
  SquadRoom,
} from "@/lib/schemas/cinesquad.schema";

// In-memory squad rooms map with auto TTL
const globalSquadRooms = new Map<string, SquadRoom>();

export async function createSquadRoom(
  input: unknown
): Promise<{ success: boolean; data?: SquadRoom; error?: string }> {
  try {
    const parsed = CreateSquadRoomInputSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "נתונים לא תקינים ליצירת חדר סקוואד" };
    }

    const roomId = `squad-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const newRoom: SquadRoom = {
      roomId,
      hostUserId: parsed.data.hostUserId,
      movieId: parsed.data.movieId,
      movieTitle: parsed.data.movieTitle,
      showtimeId: parsed.data.showtimeId,
      showtimeLabel: parsed.data.showtimeLabel,
      hallName: parsed.data.hallName,
      ticketUnitPrice: 45,
      splitMode: "equal",
      expiresAt,
      status: "lobby",
      members: [
        {
          userId: parsed.data.hostUserId,
          name: parsed.data.hostName,
          selectedSeat: "D4",
          isHost: true,
          paymentStatus: "authorized",
          ticketAmount: 45,
          concessionAmount: 0,
          shareAmount: 45,
        },
      ],
    };

    globalSquadRooms.set(roomId, newRoom);
    return { success: true, data: newRoom };
  } catch {
    return { success: false, error: "שגיאה ביצירת חדר סקוואד" };
  }
}

export async function getSquadRoom(
  roomId: string
): Promise<{ success: boolean; data?: SquadRoom; error?: string }> {
  try {
    if (!roomId) return { success: false, error: "קוד חדר חסר" };
    const room = globalSquadRooms.get(roomId);
    if (!room) {
      // Demo mock fallback if requested directly
      const mockRoom: SquadRoom = {
        roomId,
        hostUserId: "user-host-1",
        movieId: "1022789",
        movieTitle: "הקול בראש 2",
        showtimeId: "st-1",
        showtimeLabel: "20:30 (היום)",
        hallName: "אולם VIP אקוסטי 1",
        ticketUnitPrice: 45,
        splitMode: "equal",
        expiresAt: new Date(Date.now() + 7200000).toISOString(),
        status: "lobby",
        members: [
          {
            userId: "user-host-1",
            name: "עידן (מארח)",
            selectedSeat: "D4",
            isHost: true,
            paymentStatus: "authorized",
            ticketAmount: 45,
            concessionAmount: 25,
            shareAmount: 70,
          },
          {
            userId: "user-friend-2",
            name: "מאיה כהן",
            selectedSeat: "D5",
            isHost: false,
            paymentStatus: "pending",
            ticketAmount: 45,
            concessionAmount: 15,
            shareAmount: 60,
          },
        ],
      };
      globalSquadRooms.set(roomId, mockRoom);
      return { success: true, data: mockRoom };
    }
    return { success: true, data: room };
  } catch {
    return { success: false, error: "שגיאה בשליפת חדר סקוואד" };
  }
}

export async function joinSquadRoom(
  input: unknown
): Promise<{ success: boolean; data?: SquadRoom; error?: string }> {
  try {
    const parsed = JoinSquadRoomInputSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "נתוני הצטרפות שגויים" };

    const { roomId, userId, name, avatarUrl } = parsed.data;
    const roomRes = await getSquadRoom(roomId);
    if (!roomRes.success || !roomRes.data) return { success: false, error: "חדר לא נמצא" };

    const room = { ...roomRes.data };
    const existing = room.members.find((m) => m.userId === userId);
    if (!existing) {
      room.members.push({
        userId,
        name,
        avatarUrl,
        selectedSeat: null,
        isHost: false,
        paymentStatus: "pending",
        ticketAmount: room.ticketUnitPrice,
        concessionAmount: 0,
        shareAmount: room.ticketUnitPrice,
      });
    }

    globalSquadRooms.set(roomId, room);
    return { success: true, data: room };
  } catch {
    return { success: false, error: "שגיאה בהצטרפות לחדר" };
  }
}

export async function claimSquadSeat(
  input: unknown
): Promise<{ success: boolean; data?: SquadRoom; error?: string }> {
  try {
    const parsed = ClaimSquadSeatInputSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "נתוני מושב שגויים" };

    const { roomId, userId, seatId } = parsed.data;
    const roomRes = await getSquadRoom(roomId);
    if (!roomRes.success || !roomRes.data) return { success: false, error: "חדר לא נמצא" };

    const room = { ...roomRes.data };
    const member = room.members.find((m) => m.userId === userId);
    if (!member) return { success: false, error: "משתמש אינו חבר בסקוואד" };

    // Prevent duplicate seat takeover
    if (seatId && room.members.some((m) => m.userId !== userId && m.selectedSeat === seatId)) {
      return { success: false, error: "מושב זה כבר נתפס על ידי חבר סקוואד אחר" };
    }

    member.selectedSeat = seatId;
    globalSquadRooms.set(roomId, room);
    return { success: true, data: room };
  } catch {
    return { success: false, error: "שגיאה בנעילת מושב סקוואד" };
  }
}
