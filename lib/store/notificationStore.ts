import { create } from "zustand";
import { NotificationInput } from "../validations/notifications";

interface NotificationStore {
  notifications: NotificationInput[];
  setNotifications: (notifications: NotificationInput[]) => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export const useNotifications = () => useNotificationStore((state) => state.notifications);
export const useSetNotifications = () => useNotificationStore((state) => state.setNotifications);
export const useMarkAsRead = () => useNotificationStore((state) => state.markAsRead);
export const useDismissNotification = () => useNotificationStore((state) => state.dismissNotification);
