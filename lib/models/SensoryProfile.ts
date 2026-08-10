import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISensoryProfile extends Document {
  seatId: string;
  movieId: string;
  hapticIntensity: number;
  subBassFrequency: number;
  ambientLightingColor: string;
  pulsePattern: "soft" | "rhythmic" | "intense" | "sub-bass-heavy";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SensoryProfileSchema: Schema = new Schema<ISensoryProfile>(
  {
    seatId: { type: String, required: true, index: true },
    movieId: { type: String, required: true, index: true },
    hapticIntensity: { type: Number, default: 75, min: 0, max: 100 },
    subBassFrequency: { type: Number, default: 45, min: 20, max: 120 },
    ambientLightingColor: { type: String, default: "#8B5CF6" },
    pulsePattern: {
      type: String,
      enum: ["soft", "rhythmic", "intense", "sub-bass-heavy"],
      default: "rhythmic",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SensoryProfile: Model<ISensoryProfile> =
  mongoose.models.SensoryProfile ||
  mongoose.model<ISensoryProfile>("SensoryProfile", SensoryProfileSchema);
