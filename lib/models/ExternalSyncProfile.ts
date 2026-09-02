import mongoose, { Schema, Document, models } from "mongoose";

export interface IScrobbleLog {
  movieId: string;
  movieTitle: string;
  platform: 'trakt' | 'letterboxd';
  action: 'scrobble' | 'rating' | 'watchlist_sync';
  rating?: number;
  timestamp: Date;
  status: 'success' | 'failed';
  externalId?: string;
}

export interface IExternalSyncProfile extends Document {
  userId: string;
  traktConnected: boolean;
  traktUsername?: string;
  traktAccessToken?: string;
  traktRefreshToken?: string;
  letterboxdConnected: boolean;
  letterboxdUsername?: string;
  letterboxdExportEnabled: boolean;
  autoScrobbleOnTicketScan: boolean;
  syncRatings: boolean;
  lastScrobbledAt?: Date;
  history: IScrobbleLog[];
  createdAt: Date;
  updatedAt: Date;
}

const ScrobbleLogSchema = new Schema<IScrobbleLog>({
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  platform: { type: String, enum: ['trakt', 'letterboxd'], required: true },
  action: { type: String, enum: ['scrobble', 'rating', 'watchlist_sync'], required: true },
  rating: { type: Number, required: false },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  externalId: { type: String, required: false },
});

const ExternalSyncProfileSchema = new Schema<IExternalSyncProfile>({
  userId: { type: String, required: true, unique: true, index: true },
  traktConnected: { type: Boolean, default: false },
  traktUsername: { type: String, required: false },
  traktAccessToken: { type: String, required: false },
  traktRefreshToken: { type: String, required: false },
  letterboxdConnected: { type: Boolean, default: false },
  letterboxdUsername: { type: String, required: false },
  letterboxdExportEnabled: { type: Boolean, default: true },
  autoScrobbleOnTicketScan: { type: Boolean, default: true },
  syncRatings: { type: Boolean, default: true },
  lastScrobbledAt: { type: Date, required: false },
  history: { type: [ScrobbleLogSchema], default: [] },
}, { timestamps: true });

export const ExternalSyncProfile = models.ExternalSyncProfile || mongoose.model<IExternalSyncProfile>("ExternalSyncProfile", ExternalSyncProfileSchema);
