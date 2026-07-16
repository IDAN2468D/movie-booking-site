import mongoose, { Schema, Document, models } from "mongoose";

interface IMission {
  missionId: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  reward: number;
}

export interface IStreakLog extends Document {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  totalCheckIns: number;
  multiplier: number;
  missions: IMission[];
}

const MissionSubSchema = new Schema<IMission>(
  {
    missionId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    target: { type: Number, required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    reward: { type: Number, default: 0 },
  },
  { _id: false }
);

const StreakLogSchema = new Schema<IStreakLog>(
  {
    userId: { type: String, required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCheckIn: { type: Date, default: null },
    totalCheckIns: { type: Number, default: 0 },
    multiplier: { type: Number, default: 1.0 },
    missions: { type: [MissionSubSchema], default: [] },
  },
  { timestamps: true }
);

export const StreakLog =
  models.StreakLog ||
  mongoose.model<IStreakLog>("StreakLog", StreakLogSchema);
