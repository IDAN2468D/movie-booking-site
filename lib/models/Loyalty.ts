import mongoose, { Schema, Document, models } from "mongoose";

export interface ILoyaltyUser extends Document {
  userId: string;
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Liquid Elite";
  claimedRewards: string[];
}

const LoyaltyUserSchema = new Schema<ILoyaltyUser>({
  userId: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  tier: { type: String, enum: ["Bronze", "Silver", "Gold", "Liquid Elite"], default: "Bronze" },
  claimedRewards: { type: [String], default: [] },
}, { timestamps: true });

export const LoyaltyUser = models.LoyaltyUser || mongoose.model<ILoyaltyUser>("LoyaltyUser", LoyaltyUserSchema);

export interface IReward extends Document {
  title: string;
  description: string;
  costInPoints: number;
  imageUrl: string;
  type: "Physical" | "Digital";
}

const RewardSchema = new Schema<IReward>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  costInPoints: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ["Physical", "Digital"], required: true },
}, { timestamps: true });

export const Reward = models.Reward || mongoose.model<IReward>("Reward", RewardSchema);
