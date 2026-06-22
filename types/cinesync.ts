import { z } from 'zod';

export const CreateRoomSchema = z.object({
  movieId: z.string().min(1, "Movie identifier is required"),
  showtime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  date: z.string().min(1, "Date is required"),
  branchId: z.string().min(1, "Branch identifier is required"),
});

export const UpdateSyncSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  cursorX: z.number(),
  cursorY: z.number(),
  selectedSeat: z.string().nullable(),
  isReady: z.boolean(),
  guestId: z.string().optional(),
  guestName: z.string().optional(),
});

export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
export type UpdateSyncInput = z.infer<typeof UpdateSyncSchema>;

export interface CineSyncParticipant {
  userId: string;
  name: string;
  cursorX: number;
  cursorY: number;
  selectedSeat: string | null;
  isReady: boolean;
  lastActive: string; // ISO String
}

export interface CineSyncRoomData {
  roomId: string;
  movieId: string;
  showtime: string;
  date: string;
  branchId: string;
  hostId: string;
  participants: CineSyncParticipant[];
  createdAt: string; // ISO String
}
