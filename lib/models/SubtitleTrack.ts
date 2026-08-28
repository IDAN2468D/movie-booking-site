import mongoose, { Schema, Document, models } from "mongoose";
import { SubtitleCue } from "@/lib/schemas/subtitleSync";

export interface ISubtitleTrack extends Document {
  movieId: string;
  sceneTimestampMs: number;
  language: string;
  cues: SubtitleCue[];
  geminiModel: string;
  audioHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubtitleCueSubSchema = new Schema<SubtitleCue>(
  {
    id: { type: String, required: true },
    startTimeMs: { type: Number, required: true },
    endTimeMs: { type: Number, required: true },
    speaker: { type: String, required: true, default: "Speaker 1" },
    speakerColor: { type: String },
    originalText: { type: String, required: true },
    translatedText: { type: String, required: true },
    confidence: { type: Number, default: 0.95 },
    isMusicOrEffect: { type: Boolean, default: false },
  },
  { _id: false }
);

const SubtitleTrackSchema = new Schema<ISubtitleTrack>(
  {
    movieId: { type: String, required: true, index: true },
    sceneTimestampMs: { type: Number, required: true, index: true },
    language: { type: String, required: true, default: "he" },
    cues: [SubtitleCueSubSchema],
    geminiModel: { type: String, default: "gemini-3.5-flash-lite" },
    audioHash: { type: String, index: true },
  },
  { timestamps: true }
);

SubtitleTrackSchema.index({ movieId: 1, sceneTimestampMs: 1, language: 1 });

export const SubtitleTrack =
  models.SubtitleTrack ||
  mongoose.model<ISubtitleTrack>("SubtitleTrack", SubtitleTrackSchema);

export default SubtitleTrack;
