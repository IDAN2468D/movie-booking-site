import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IActor extends Document {
  actorId: string;
  name: string;
  avatarUrl: string;
  age: number;
  birthPlace: string;
  biography: string;
  notableRoles: string[];
  trending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ActorSchema = new Schema<IActor>(
  {
    actorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    age: { type: Number, required: true },
    birthPlace: { type: String, required: true },
    biography: { type: String, required: true },
    notableRoles: { type: [String], default: [] },
    trending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// HMR Overwrite Safeguard
export const Actor: Model<IActor> = mongoose.models.Actor || mongoose.model<IActor>('Actor', ActorSchema);
