"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import CineSyncRoom from "@/lib/models/CineSyncRoom";
import { CreateRoomSchema, UpdateSyncSchema } from "@/types/cinesync";
import { revalidatePath } from "next/cache";

// Helper to standardise action result wrapper
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Generates a unique 6-character lounge room code.
 */
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * 🎫 Server Action: Create a CineSync Lounge Room
 */
export async function createLoungeRoom(rawData: unknown): Promise<Result<{ roomId: string; userId: string; name: string }>> {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    const parsed = CreateRoomSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { movieId, showtime, date, branchId } = parsed.data;

    // Determine host details
    const userId = session?.user?.id || session?.user?.email || "guest_" + Math.random().toString(36).substring(2, 9);
    const name = session?.user?.name || "אורח_" + Math.random().toString(36).substring(2, 6);

    const roomId = generateRoomId();

    const room = new CineSyncRoom({
      roomId,
      movieId,
      showtime,
      date,
      branchId,
      hostId: userId,
      participants: [{
        userId,
        name,
        cursorX: 0,
        cursorY: 0,
        selectedSeat: null,
        isReady: false,
        lastActive: new Date()
      }]
    });

    await room.save();

    return { 
      success: true, 
      data: { 
        roomId, 
        userId, 
        name 
      } 
    };
  } catch (error: unknown) {
    console.error("Failed to create lounge room:", error);
    return { success: false, error: error instanceof Error ? error.message : "Server error" };
  }
}

/**
 * 🎫 Server Action: Join an existing CineSync Room
 */
export async function joinLoungeRoom(
  roomId: string, 
  clientGuestId?: string, 
  clientGuestName?: string
): Promise<Result<{ roomId: string; userId: string; name: string; movieId: string; showtime: string; date: string; branchId: string }>> {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    const room = await CineSyncRoom.findOne({ roomId: roomId.toUpperCase() });
    if (!room) {
      return { success: false, error: "החדר לא נמצא או שפג תוקפו" };
    }

    // Resolve user details
    const userId = session?.user?.id || session?.user?.email || clientGuestId || "guest_" + Math.random().toString(36).substring(2, 9);
    const name = session?.user?.name || clientGuestName || "אורח_" + Math.random().toString(36).substring(2, 6);

    // Check if participant already exists in the room
    const isParticipant = room.participants.some((p: any) => p.userId === userId);

    if (!isParticipant) {
      room.participants.push({
        userId,
        name,
        cursorX: 0,
        cursorY: 0,
        selectedSeat: null,
        isReady: false,
        lastActive: new Date()
      });
      await room.save();
    }

    return {
      success: true,
      data: {
        roomId: room.roomId,
        userId,
        name,
        movieId: room.movieId,
        showtime: room.showtime,
        date: room.date,
        branchId: room.branchId
      }
    };
  } catch (error: unknown) {
    console.error("Failed to join lounge room:", error);
    return { success: false, error: error instanceof Error ? error.message : "Server error" };
  }
}

/**
 * 🎫 Server Action: Synchronise coordinate details and fetch active participants
 */
export async function updateLoungeSync(rawData: unknown): Promise<Result<{ participants: any[] }>> {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    const parsed = UpdateSyncSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { roomId, cursorX, cursorY, selectedSeat, isReady, guestId, guestName } = parsed.data;

    // Resolve user details
    const userId = session?.user?.id || session?.user?.email || guestId;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const name = session?.user?.name || guestName || "אורח";

    const room = await CineSyncRoom.findOne({ roomId: roomId.toUpperCase() });
    if (!room) {
      return { success: false, error: "Room not found" };
    }

    // 10-second heartbeat check: filter out inactive users
    const now = Date.now();
    const inactiveThreshold = new Date(now - 12000); // 12 seconds backoff

    // Update current participant, or add if missing
    let found = false;
    room.participants = room.participants.map((p: any) => {
      if (p.userId === userId) {
        found = true;
        return {
          ...p.toObject(),
          cursorX,
          cursorY,
          selectedSeat,
          isReady,
          lastActive: new Date()
        };
      }
      return p;
    });

    if (!found) {
      room.participants.push({
        userId,
        name,
        cursorX,
        cursorY,
        selectedSeat,
        isReady,
        lastActive: new Date()
      });
    }

    // Filter out inactive users (except the host or the current updating user)
    room.participants = room.participants.filter((p: any) => 
      p.userId === userId || p.userId === room.hostId || p.lastActive > inactiveThreshold
    );

    await room.save();

    return {
      success: true,
      data: {
        participants: room.participants.map((p: any) => ({
          userId: p.userId,
          name: p.name,
          cursorX: p.cursorX,
          cursorY: p.cursorY,
          selectedSeat: p.selectedSeat,
          isReady: p.isReady,
          lastActive: p.lastActive.toISOString()
        }))
      }
    };
  } catch (error: unknown) {
    console.error("Failed to sync lounge room state:", error);
    return { success: false, error: error instanceof Error ? error.message : "Server error" };
  }
}

/**
 * 🎫 Server Action: Leave CineSync Lounge
 */
export async function leaveLoungeRoom(roomId: string, userId: string): Promise<Result<{ left: boolean }>> {
  try {
    await connectToDatabase();
    const room = await CineSyncRoom.findOne({ roomId: roomId.toUpperCase() });
    if (!room) {
      return { success: true, data: { left: true } };
    }

    // Filter out the user leaving
    room.participants = room.participants.filter((p: any) => p.userId !== userId);

    if (room.participants.length === 0) {
      await CineSyncRoom.deleteOne({ _id: room._id });
    } else {
      await room.save();
    }

    return { success: true, data: { left: true } };
  } catch (error: unknown) {
    console.error("Failed to leave room:", error);
    return { success: false, error: error instanceof Error ? error.message : "Server error" };
  }
}
