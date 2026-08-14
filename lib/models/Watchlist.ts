import mongoose, { Schema, Document, models } from "mongoose";

export interface IWatchlistItem extends Document {
  userId: string;
  movieId: string;
  title: string;
  posterPath: string;
  releaseDate?: string;
  voteAverage?: number;
  genres?: string[];
  notifyOnRelease?: boolean;
  addedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlistItem>(
  {
    userId: { type: String, required: true, index: true },
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    posterPath: { type: String, required: true },
    releaseDate: { type: String, default: "" },
    voteAverage: { type: Number, default: 0 },
    genres: { type: [String], default: [] },
    notifyOnRelease: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound unique index — one entry per user per movie
WatchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Watchlist =
  models.Watchlist ||
  mongoose.model<IWatchlistItem>("Watchlist", WatchlistSchema);
