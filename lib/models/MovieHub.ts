import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMovieHub extends Document {
  userId: string;
  bookmarkedMovies: string[];
  watchHistory: string[];
  likedMovies: string[];
}

const MovieHubSchema = new Schema<IMovieHub>(
  {
    userId: { type: String, required: true, unique: true },
    bookmarkedMovies: { type: [String], default: [] },
    watchHistory: { type: [String], default: [] },
    likedMovies: { type: [String], default: [] },
  },
  { timestamps: true }
);

// HMR Overwrite Prevention as per rules
export const MovieHub =
  (mongoose.models.MovieHub as Model<IMovieHub>) ||
  mongoose.model<IMovieHub>("MovieHub", MovieHubSchema);
