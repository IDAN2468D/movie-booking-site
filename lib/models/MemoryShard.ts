import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMemoryShard extends Document {
  shardId: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  screeningDate: string;
  iconicQuote: string;
  soundtrackSnippetUrl?: string;
  hmacSignature: string;
  rarityTier: "common" | "rare" | "legendary" | "mythic";
  createdAt: Date;
  updatedAt: Date;
}

const MemoryShardSchema: Schema = new Schema<IMemoryShard>(
  {
    shardId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    movieId: { type: String, required: true },
    movieTitle: { type: String, required: true },
    screeningDate: { type: String, required: true },
    iconicQuote: { type: String, required: true },
    soundtrackSnippetUrl: { type: String },
    hmacSignature: { type: String, required: true },
    rarityTier: {
      type: String,
      enum: ["common", "rare", "legendary", "mythic"],
      default: "rare",
    },
  },
  { timestamps: true }
);

export const MemoryShard: Model<IMemoryShard> =
  mongoose.models.MemoryShard ||
  mongoose.model<IMemoryShard>("MemoryShard", MemoryShardSchema);
