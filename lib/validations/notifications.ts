import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  severity: z.enum(["INFO", "SYSTEM_ALERT", "VIP_AUCTION_OUTBID"]),
  isRead: z.boolean(),
  timestamp: z.coerce.date(),
});

export type NotificationInput = z.infer<typeof notificationSchema>;
