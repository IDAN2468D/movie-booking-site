import mongoose, { Schema, Document, models } from "mongoose";

export interface IPledge {
  userId: string;
  userName: string;
  userAvatar?: string;
  seatsCount: number;
  paymentIntentId: string;
  pledgedAt: Date;
}

export interface ICrowdScreening extends Document {
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieBackdrop?: string;
  genre: string;
  durationMinutes: number;
  branchId: string;
  branchName: string;
  targetDate: Date;
  minThreshold: number;
  currentBackers: number;
  totalSeatsPledged: number;
  ticketPrice: number;
  status: 'funding' | 'confirmed' | 'cancelled';
  creatorUserId: string;
  creatorName: string;
  pledges: IPledge[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PledgeSchema = new Schema<IPledge>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, required: false },
  seatsCount: { type: Number, required: true, min: 1 },
  paymentIntentId: { type: String, required: true },
  pledgedAt: { type: Date, default: Date.now },
});

const CrowdScreeningSchema = new Schema<ICrowdScreening>({
  movieId: { type: String, required: true, index: true },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String, required: true },
  movieBackdrop: { type: String, required: false },
  genre: { type: String, required: true },
  durationMinutes: { type: Number, default: 120 },
  branchId: { type: String, required: true, index: true },
  branchName: { type: String, required: true },
  targetDate: { type: Date, required: true },
  minThreshold: { type: Number, required: true, default: 50 },
  currentBackers: { type: Number, default: 0 },
  totalSeatsPledged: { type: Number, default: 0 },
  ticketPrice: { type: Number, required: true, default: 45 },
  status: { type: String, enum: ['funding', 'confirmed', 'cancelled'], default: 'funding', index: true },
  creatorUserId: { type: String, required: true },
  creatorName: { type: String, required: true },
  pledges: { type: [PledgeSchema], default: [] },
  expiresAt: { type: Date, required: true, index: true },
}, { timestamps: true });

export const CrowdScreening = models.CrowdScreening || mongoose.model<ICrowdScreening>("CrowdScreening", CrowdScreeningSchema);
