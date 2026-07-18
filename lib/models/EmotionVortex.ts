import mongoose, { Schema, Document } from "mongoose";

export interface IEmotionVortex extends Document {
  movieId: string;
  emotions: Record<string, number>;
}

const EmotionVortexSchema = new Schema<IEmotionVortex>({
  movieId: { type: String, required: true, unique: true },
  emotions: {
    type: Map,
    of: Number,
    default: {},
  },
});

export const EmotionVortex =
  mongoose.models.EmotionVortex ||
  mongoose.model<IEmotionVortex>("EmotionVortex", EmotionVortexSchema);
