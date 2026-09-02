import mongoose, { Schema, Document, models } from "mongoose";

export interface ISeatExchangeRequest extends Document {
  showtimeId: string;
  movieId: string;
  movieTitle: string;
  ticketId: string;
  requesterUserId: string;
  requesterName: string;
  requesterAvatar?: string;
  currentSeatId: string;
  desiredTiers: string[];
  desiredRow?: string;
  bidDiffPrice: number;
  status: 'pending' | 'accepted' | 'cancelled' | 'expired';
  matchedTicketId?: string;
  matchedUserId?: string;
  matchedUserName?: string;
  matchedSeatId?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SeatExchangeRequestSchema = new Schema<ISeatExchangeRequest>({
  showtimeId: { type: String, required: true, index: true },
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  ticketId: { type: String, required: true, index: true },
  requesterUserId: { type: String, required: true, index: true },
  requesterName: { type: String, required: true },
  requesterAvatar: { type: String, required: false },
  currentSeatId: { type: String, required: true },
  desiredTiers: { type: [String], default: ['VIP', 'PRIME', 'STANDARD'] },
  desiredRow: { type: String, required: false },
  bidDiffPrice: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'cancelled', 'expired'], 
    default: 'pending', 
    index: true 
  },
  matchedTicketId: { type: String, required: false },
  matchedUserId: { type: String, required: false },
  matchedUserName: { type: String, required: false },
  matchedSeatId: { type: String, required: false },
  expiresAt: { type: Date, required: true, index: true },
}, { timestamps: true });

export const SeatExchangeRequest = models.SeatExchangeRequest || mongoose.model<ISeatExchangeRequest>("SeatExchangeRequest", SeatExchangeRequestSchema);
