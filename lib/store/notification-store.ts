import { create } from 'zustand';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'offer' | 'food' | 'info';
  unread: boolean;
}

interface NotificationState {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<Notification, 'id' | 'unread'>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: 1,
      title: 'הזמנה אושרה!',
      message: 'הכרטיס שלך ל\'הקול בראש 2\' (אולם 4) אושר. תהנה מהסרט!',
      time: 'לפני 2 דקות',
      type: 'booking',
      unread: true,
    },
    {
      id: 2,
      title: 'מבצע קומבו: 20% הנחה',
      message: 'קבל 20% הנחה על קומבו פופקורן גדול + שתייה. תקף להיום בלבד!',
      time: 'לפני שעה',
      type: 'offer',
      unread: true,
    },
    {
      id: 3,
      title: 'הזמן אוכל מראש',
      message: 'דלג על התור! הזמן נשנושים עכשיו וקבל אותם עד למושב.',
      time: 'לפני 3 שעות',
      type: 'food',
      unread: false,
    },
    {
      id: 4,
      title: 'עדכון בטיחות בקולנוע',
      message: 'עדכנו את פרוטוקולי הבטיחות שלנו. בדוק את מערכת הכניסה החדשה ללא מגע.',
      time: 'אתמול',
      type: 'info',
      unread: false,
    },
  ],

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => 
      n.id === id ? { ...n, unread: false } : n
    )
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, unread: false }))
  })),

  addNotification: (notif) => set((state) => ({
    notifications: [
      {
        ...notif,
        id: Math.max(...state.notifications.map(n => n.id), 0) + 1,
        unread: true
      },
      ...state.notifications
    ]
  })),
}));
