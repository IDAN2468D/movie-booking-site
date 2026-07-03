'use server';

import { z } from 'zod';

// Schema for marking a single notification as read
const markAsReadSchema = z.object({
  id: z.number().int().positive()
});

export type ActionState<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Server action to mark a notification as read (simulating server settlement)
 */
export async function markAsReadAction(prevState: any, formData: FormData): Promise<ActionState<{ id: number }>> {
  try {
    const rawId = formData.get('id');
    if (!rawId) {
      return { success: false, error: 'Notification ID is required' };
    }

    const validated = markAsReadSchema.safeParse({ id: Number(rawId) });
    if (!validated.success) {
      return { success: false, error: 'Invalid notification ID payload' };
    }

    // Simulate database update
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      success: true,
      data: { id: validated.data.id }
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to mark notification as read'
    };
  }
}

/**
 * Server action to mark all notifications as read
 */
export async function markAllAsReadAction(prevState: any): Promise<ActionState<null>> {
  try {
    // Simulate database update
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      success: true,
      data: null
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to settle all notifications'
    };
  }
}
