import mongoose, { Schema, Document } from "mongoose";

export interface ISeatLock extends Document {
  seatId: string;
  showtimeId: string;
  userId: string;
  lockExpiresAt: Date;
  status: 'held' | 'booked';
}

const SeatLockSchema = new Schema(
  {
    seatId: { type: String, required: true },
    showtimeId: { type: String, required: true },
    userId: { type: String, required: true },
    lockExpiresAt: { type: Date, required: true, expires: 600 }, // TTL index: 10 minutes (600 seconds)
    status: { type: String, enum: ['held', 'booked'], default: 'held', required: true },
  },
  { timestamps: true }
);

// Ensure one seat per showtime is held/booked
SeatLockSchema.index({ seatId: 1, showtimeId: 1 }, { unique: true });

const SeatLock = mongoose.models.SeatLock || mongoose.model<ISeatLock>("SeatLock", SeatLockSchema);

export default SeatLock;
