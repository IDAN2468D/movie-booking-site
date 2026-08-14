import mongoose, { Schema, Document, models } from "mongoose";

export interface IVipRsvp extends Document {
  movieTitle: string;
  guestName: string;
  phoneNumber: string;
  seatsCount: number;
  seatsList: string[];
  reservationCode: string;
  status: "confirmed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VipRsvpSchema = new Schema<IVipRsvp>(
  {
    movieTitle: { type: String, required: true, index: true },
    guestName: { type: String, required: true },
    phoneNumber: { type: String, required: true, index: true },
    seatsCount: { type: Number, required: true, default: 1 },
    seatsList: { type: [String], default: [] },
    reservationCode: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

export const VipRsvp = models.VipRsvp || mongoose.model<IVipRsvp>("VipRsvp", VipRsvpSchema);
