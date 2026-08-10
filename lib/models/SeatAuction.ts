import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISeatAuction extends Document {
  auctionId: string;
  seatNumber: string;
  movieId: string;
  showtime: string;
  startingPriceILS: number;
  currentBidILS: number;
  currentBidderId?: string;
  loyaltyPointsPrice: number;
  expiresAt: Date;
  status: "active" | "ended" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const SeatAuctionSchema: Schema = new Schema<ISeatAuction>(
  {
    auctionId: { type: String, required: true, index: true },
    seatNumber: { type: String, required: true },
    movieId: { type: String, required: true },
    showtime: { type: String, required: true },
    startingPriceILS: { type: Number, required: true },
    currentBidILS: { type: Number, required: true },
    currentBidderId: { type: String },
    loyaltyPointsPrice: { type: Number, default: 500 },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ["active", "ended", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

export const SeatAuction: Model<ISeatAuction> =
  mongoose.models.SeatAuction ||
  mongoose.model<ISeatAuction>("SeatAuction", SeatAuctionSchema);
