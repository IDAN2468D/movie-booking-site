import mongoose, { Schema, Document, models } from "mongoose";

export interface IStory extends Document {
  movieId: string;
  title: string;
  posterUrl: string;
  duration: number; // in milliseconds
  viewedBy: string[]; // array of user emails or IDs
  createdAt: Date;
}

const StorySchema = new Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  posterUrl: { type: String, required: true },
  duration: { type: Number, default: 5000 },
  viewedBy: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

// Avoid OverwriteModelError in Next.js development
const Story = models.Story || mongoose.model<IStory>("Story", StorySchema);

export default Story;
