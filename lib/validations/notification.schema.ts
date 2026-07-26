import { z } from 'zod';

export const notificationCategorySchema = z.enum([
  'all',
  'booking',
  'offer',
  'food',
  'urgent'
]);

export const notificationPrioritySchema = z.enum(['urgent', 'high', 'normal']);

export const notificationItemSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  message: z.string().min(1),
  time: z.string(),
  type: z.enum(['booking', 'offer', 'food', 'info', 'urgent']),
  priority: notificationPrioritySchema.default('normal'),
  unread: z.boolean(),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
});

export const notificationPreferencesSchema = z.object({
  soundEnabled: z.boolean().default(true),
  pushEnabled: z.boolean().default(true),
  emailSync: z.boolean().default(false),
  aiDigestEnabled: z.boolean().default(true),
  urgencyFilterOnly: z.boolean().default(false),
});

export type NotificationCategory = z.infer<typeof notificationCategorySchema>;
export type NotificationPriority = z.infer<typeof notificationPrioritySchema>;
export type NotificationItem = z.infer<typeof notificationItemSchema>;
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;
