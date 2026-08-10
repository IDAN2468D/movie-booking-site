import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGroupMember {
  userId: string;
  userName: string;
  preferredGenres: string[];
  dislikedGenres?: string[];
}

export interface IGroupMatch extends Document {
  groupId: string;
  groupName: string;
  members: IGroupMember[];
  targetMovieId?: string;
  compatibilityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const GroupMatchSchema: Schema = new Schema<IGroupMatch>(
  {
    groupId: { type: String, required: true, index: true },
    groupName: { type: String, required: true },
    members: [
      {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        preferredGenres: [{ type: String }],
        dislikedGenres: [{ type: String }],
      },
    ],
    targetMovieId: { type: String },
    compatibilityScore: { type: Number, default: 85 },
  },
  { timestamps: true }
);

export const GroupMatch: Model<IGroupMatch> =
  mongoose.models.GroupMatch ||
  mongoose.model<IGroupMatch>("GroupMatch", GroupMatchSchema);
