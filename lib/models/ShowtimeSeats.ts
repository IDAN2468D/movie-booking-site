import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISeat {
  seatId: string; // e.g., 'A1', 'B2'
  row: string;
  col: number;
  type: 'standard' | 'vip';
  status: 'available' | 'locked' | 'occupied';
  lockedBy?: string | null;
  lockedAt?: Date | null;
}

export interface IShowtimeSeats extends Document {
  showtimeId: string;
  seats: ISeat[];
  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema = new Schema<ISeat>({
  seatId: { type: String, required: true },
  row: { type: String, required: true },
  col: { type: Number, required: true },
  type: { type: String, enum: ['standard', 'vip'], default: 'standard' },
  status: { type: String, enum: ['available', 'locked', 'occupied'], default: 'available' },
  lockedBy: { type: String, default: null },
  lockedAt: { type: Date, default: null }
}, { _id: false });

const ShowtimeSeatsSchema = new Schema<IShowtimeSeats>(
  {
    showtimeId: { type: String, required: true, unique: true },
    seats: { type: [SeatSchema], default: [] }
  },
  { timestamps: true }
);

// HMR compliant compilation
export const ShowtimeSeats: Model<IShowtimeSeats> =
  mongoose.models.ShowtimeSeats || mongoose.model<IShowtimeSeats>('ShowtimeSeats', ShowtimeSeatsSchema);
