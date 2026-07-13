import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  severity: "INFO" | "SYSTEM_ALERT" | "VIP_AUCTION_OUTBID";
  isRead: boolean;
  timestamp: Date;
}

const NotificationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ["INFO", "SYSTEM_ALERT", "VIP_AUCTION_OUTBID"],
      required: true,
    },
    isRead: { type: Boolean, default: false, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
