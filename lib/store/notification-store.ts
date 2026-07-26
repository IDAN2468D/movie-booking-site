import { create } from 'zustand';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'offer' | 'food' | 'info' | 'urgent';
  priority?: 'urgent' | 'high' | 'normal';
  unread: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationState {
  notifications: Notification[];
  soundEnabled: boolean;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: number) => void;
  clearRead: () => void;
  toggleSound: () => void;
  addNotification: (notif: Omit<Notification, 'id' | 'unread'>) => void;
  addSimulatedNotification: () => void;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'הקרנת VIP בעוד 45 דקות!',
    message: 'הכרטיס שלך ל\'הקול בראש 2\' (אולם IMAX 4) אושר. המושבים VIP חוממו עבורך.',
    time: 'לפני 2 דקות',
    type: 'booking',
    priority: 'urgent',
    unread: true,
    actionUrl: '/tickets',
    actionLabel: 'הצג כרטיס VIP',
  },
  {
    id: 2,
    title: 'הטבה בלעדית לחברי פרימיום',
    message: 'קבל 25% הנחה על קומבו פופקורן כמהין גדול + שתייה קרה. בתוקף להיום בלבד!',
    time: 'לפני 45 דקות',
    type: 'offer',
    priority: 'high',
    unread: true,
    actionUrl: '/concession',
    actionLabel: 'ממש הטבה',
  },
  {
    id: 3,
    title: 'הזמנת האוכל יצאה למטבח',
    message: 'מנוע ה-AI הכין את הנשנושים שלך. ההזמנה תוגש ישירות למושב עם תחילת הסרט.',
    time: 'לפני 2 שעות',
    type: 'food',
    priority: 'normal',
    unread: true,
    actionUrl: '/concession',
    actionLabel: 'עקוב אחר הזמנה',
  },
  {
    id: 4,
    title: 'עדכון מערכת סאונד IMAX',
    message: 'כיול 120Hz וסאונד היקפי Dolby Atmos שודרגו באולם 4 לציפיות סאונד מירביות.',
    time: 'אתמול',
    type: 'info',
    priority: 'normal',
    unread: false,
  },
  {
    id: 5,
    title: 'אזהרת עומס בכניסה למתחם',
    message: 'צפוי עומס בחניון המרכזי בעוד שעה. מומלץ להגיע 15 דקות מוקדם יותר.',
    time: 'אתמול',
    type: 'urgent',
    priority: 'urgent',
    unread: false,
  },
];

const mockTitles = [
  'הטבת יום הולדת VIP חינם!',
  'שינוי בזמן הקרנה: אולם 2',
  'נקודות פולס חדשות בחשבון',
  'נפתח שדרוג מושבים חינם'
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: initialNotifications,
  soundEnabled: true,

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, unread: false } : n
    )
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, unread: false }))
  })),

  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),

  clearRead: () => set((state) => ({
    notifications: state.notifications.filter((n) => n.unread)
  })),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

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

  addSimulatedNotification: () => {
    const randomTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)];
    const newNotif: Omit<Notification, 'id' | 'unread'> = {
      title: randomTitle,
      message: 'עדכון אוטומטי שנוצר בזמן אמת על ידי מנוע ההתראות החכם.',
      time: 'עכשיו',
      type: 'urgent',
      priority: 'high',
      actionUrl: '/movies',
      actionLabel: 'לפרטים נוספים',
    };
    get().addNotification(newNotif);
  },
}));
