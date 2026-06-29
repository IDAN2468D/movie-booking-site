import mongoose, { Schema, Document, Model } from "mongoose";

export interface INeuralDiscovery extends Document {
  userId: string;
  queries: string[];
  lastMood: string;
  totalSearches: number;
}

const NeuralDiscoverySchema = new Schema<INeuralDiscovery>(
  {
    userId: { type: String, required: true, unique: true },
    queries: { type: [String], default: [] },
    lastMood: { type: String, default: "" },
    totalSearches: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// HMR Overwrite Prevention
export const NeuralDiscovery =
  (mongoose.models.NeuralDiscovery as Model<INeuralDiscovery>) ||
  mongoose.model<INeuralDiscovery>("NeuralDiscovery", NeuralDiscoverySchema);
