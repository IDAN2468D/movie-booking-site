import mongoose, { Schema, Document, models } from "mongoose";

export interface IMovieReview extends Document {
  movieId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-10
  content: string;
  tags?: string[];
  hasSpoilers: boolean;
  isVerifiedBooking: boolean;
  likesCount: number;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MovieReviewSchema = new Schema<IMovieReview>(
  {
    movieId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 10 },
    content: { type: String, required: true, maxlength: 2000 },
    tags: { type: [String], default: [] },
    hasSpoilers: { type: Boolean, default: false },
    isVerifiedBooking: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
  },
  { timestamps: true }
);

MovieReviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });
MovieReviewSchema.index({ movieId: 1, likesCount: -1 });
MovieReviewSchema.index({ movieId: 1, rating: -1 });

export const MovieReview =
  models.MovieReview ||
  mongoose.model<IMovieReview>("MovieReview", MovieReviewSchema);
