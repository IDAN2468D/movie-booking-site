import mongoose, { Schema, Document, models } from "mongoose";

export interface ICineSyncRoom extends Document {
  roomId: string;
  movieId: string;
  showtime: string;
  date: string;
  branchId: string;
  hostId: string;
  participants: {
    userId: string;
    name: string;
    cursorX: number;
    cursorY: number;
    selectedSeat: string | null;
    isReady: boolean;
    lastActive: Date;
  }[];
  createdAt: Date;
}

const CineSyncRoomSchema = new Schema({
  roomId: { type: String, required: true, unique: true, index: true },
  movieId: { type: String, required: true },
  showtime: { type: String, required: true },
  date: { type: String, required: true },
  branchId: { type: String, required: true },
  hostId: { type: String, required: true },
  participants: [{
    userId: { type: String, required: true },
    name: { type: String, required: true },
    cursorX: { type: Number, default: 0 },
    cursorY: { type: Number, default: 0 },
    selectedSeat: { type: String, default: null },
    isReady: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-destruct after 1 hour (TTL index)
});

// Avoid OverwriteModelError in Next.js development
const CineSyncRoom = models.CineSyncRoom || mongoose.model<ICineSyncRoom>("CineSyncRoom", CineSyncRoomSchema);

export default CineSyncRoom;
