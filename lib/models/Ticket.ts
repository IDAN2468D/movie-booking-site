import mongoose, { Schema, Document, models } from "mongoose";

export interface ITicket extends Document {
  userId: string;
  showtimeId: string;
  seatIds: string[];
  bookingReference: string;
  qrHash: string;
  status: 'active' | 'used' | 'cancelled';
  acquiredVia: 'standard' | 'flash_offer' | 'concierge';
  pulsePointsEarned: number;
  discountType?: string;
  discountValue?: number;
  finalPricePaid?: number;
}

const TicketSchema = new Schema<ITicket>({
  userId: { type: String, required: true, index: true },
  showtimeId: { type: String, required: true },
  seatIds: { type: [String], required: true },
  bookingReference: { type: String, required: true, unique: true },
  qrHash: { type: String, required: true },
  status: { type: String, enum: ['active', 'used', 'cancelled'], default: 'active' },
  acquiredVia: { type: String, enum: ['standard', 'flash_offer', 'concierge'], default: 'standard' },
  pulsePointsEarned: { type: Number, default: 0 },
  discountType: { type: String, required: false },
  discountValue: { type: Number, required: false },
  finalPricePaid: { type: Number, required: false },
}, { timestamps: true });

export const Ticket = models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
