import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISwipe {
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  direction: 'like' | 'dislike';
  timestamp: Date;
}

export interface ISwipeSession extends Document {
  sessionId: string;
  hostUserId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  sessionStatus: 'active' | 'matched' | 'expired';
  catalogFilters?: {
    genres?: string[];
    date?: Date;
  };
  swipes: ISwipe[];
  matchedMovieId?: mongoose.Types.ObjectId | null;
}

const SwipeSchema = new Schema<ISwipe>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    movieId: { type: Schema.Types.ObjectId, required: true },
    direction: { type: String, enum: ['like', 'dislike'], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false } // Avoid creating _id for subdocuments unless necessary
);

const SwipeSessionSchema = new Schema<ISwipeSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-zA-Z0-9]{6}$/, 'Session ID must be exactly 6 alphanumeric characters'],
    },
    hostUserId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    sessionStatus: {
      type: String,
      enum: ['active', 'matched', 'expired'],
      default: 'active',
      required: true,
    },
    catalogFilters: {
      genres: [{ type: String }],
      date: { type: Date },
    },
    swipes: [SwipeSchema],
    matchedMovieId: { type: Schema.Types.ObjectId, ref: 'Movie', default: null },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Optimized indexing for fast querying and aggregation boundary matches
SwipeSessionSchema.index({ sessionId: 1 }, { unique: true });
SwipeSessionSchema.index({ sessionStatus: 1 });
SwipeSessionSchema.index({ 'swipes.userId': 1, 'swipes.movieId': 1 });

const SwipeSession: Model<ISwipeSession> =
  mongoose.models.SwipeSession || mongoose.model<ISwipeSession>('SwipeSession', SwipeSessionSchema);

export default SwipeSession;
