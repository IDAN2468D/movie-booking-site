import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStoryNode extends Document {
  nodeId: string;
  movieId: string;
  title: string;
  choiceText: string;
  consequenceSummary: string;
  parentId?: string | null;
  childNodeIds: string[];
  aiConfidenceScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const StoryNodeSchema: Schema = new Schema<IStoryNode>(
  {
    nodeId: { type: String, required: true, index: true },
    movieId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    choiceText: { type: String, required: true },
    consequenceSummary: { type: String, required: true },
    parentId: { type: String, default: null },
    childNodeIds: [{ type: String }],
    aiConfidenceScore: { type: Number, default: 90 },
  },
  { timestamps: true }
);

export const StoryNode: Model<IStoryNode> =
  mongoose.models.StoryNode ||
  mongoose.model<IStoryNode>("StoryNode", StoryNodeSchema);
