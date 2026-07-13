"use server";

import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/lib/models/Notification";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getNotificationsAction(userId: string): Promise<ActionResult> {
  try {
    await connectToDatabase();
    const list = await Notification.find({ userId }).sort({ timestamp: -1 });
    const formatted = list.map((n) => ({
      id: n._id.toString(),
      userId: n.userId,
      title: n.title,
      message: n.message,
      severity: n.severity,
      isRead: n.isRead,
      timestamp: n.timestamp,
    }));
    return { success: true, data: formatted };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch notifications" };
  }
}

export async function markAsReadAction(id: string): Promise<ActionResult> {
  try {
    await connectToDatabase();
    
    // Atomic update using MongoDB modifier
    const result = await Notification.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true }
    );
    
    if (!result) {
      return { success: false, error: "Notification not found" };
    }
    
    return {
      success: true,
      data: {
        id: result._id.toString(),
        userId: result.userId,
        title: result.title,
        message: result.message,
        severity: result.severity,
        isRead: result.isRead,
        timestamp: result.timestamp,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to mark notification as read" };
  }
}

export async function dismissNotificationAction(id: string): Promise<ActionResult> {
  try {
    await connectToDatabase();
    
    // Atomic delete
    const result = await Notification.findByIdAndDelete(id);
    
    if (!result) {
      return { success: false, error: "Notification not found" };
    }
    
    return {
      success: true,
      data: { id },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to dismiss notification" };
  }
}
