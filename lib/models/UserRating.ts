import mongoose, { Schema, Document, models } from "mongoose";

export interface IUserRating extends Document {
  userId: string;
  movieId: string;
  rating: number;
  mood?: string;
  pointsAwarded: number;
}

const UserRatingSchema = new Schema<IUserRating>(
  {
    userId: { type: String, required: true, index: true },
    movieId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    mood: { type: String, required: false },
    pointsAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Unique compound index — one rating per user per movie
UserRatingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const UserRating =
  models.UserRating ||
  mongoose.model<IUserRating>("UserRating", UserRatingSchema);
