'use client';

import React, { useOptimistic, useActionState, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2 } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notification-store';
import { NotificationCard } from './NotificationCard';
import { markAsReadAction, markAllAsReadAction } from '@/lib/actions/notification-actions';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const storeNotifications = useNotificationStore((state) => state.notifications);
  const markAsReadStore = useNotificationStore((state) => state.markAsRead);
  const markAllAsReadStore = useNotificationStore((state) => state.markAllAsRead);

  // React 19 Optimistic state for notifications stream
  const [optimisticNotifications, setOptimisticNotifications] = useOptimistic(
    storeNotifications,
    (state, action: { type: 'READ_ONE'; id: number } | { type: 'READ_ALL' }) => {
      if (action.type === 'READ_ONE') {
        return state.map((n) => (n.id === action.id ? { ...n, unread: false } : n));
      }
      return state.map((n) => ({ ...n, unread: false }));
    }
  );

  // Form action to mark a single notification as read
  const [, markAsReadFormAction] = useActionState(async (prevState: any, formData: FormData) => {
    const rawId = formData.get('id');
    if (!rawId) return null;
    const id = Number(rawId);
    
    startTransition(() => {
      setOptimisticNotifications({ type: 'READ_ONE', id });
    });

    const res = await markAsReadAction(null, formData);
    if (res.success && res.data) {
      markAsReadStore(res.data.id);
    }
    return res;
  }, null);

  // Form action to mark all notifications as read
  const [, markAllAsReadFormAction] = useActionState(async () => {
    startTransition(() => {
      setOptimisticNotifications({ type: 'READ_ALL' });
    });

    const res = await markAllAsReadAction(null);
    if (res.success) {
      markAllAsReadStore();
    }
    return res;
  }, null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            style={{
              boxShadow: '0 0 50px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.15)'
            }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[5001] backdrop-blur-3xl saturate-[200%] brightness-110 bg-black/40 border-l border-white/10 flex flex-col"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF1464]/10 rounded-xl border border-[#FF1464]/20 text-[#FF1464]">
                  <Bell size={20} />
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-black text-white font-outfit leading-none">התראות פרימיום</h2>
                  <p className="text-[8px] text-[#FF1464] font-black uppercase tracking-[0.3em] mt-1">Stay Synchronized</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              <AnimatePresence initial={false}>
                {optimisticNotifications.map((notif) => (
                  <form key={notif.id} action={markAsReadFormAction}>
                    <input type="hidden" name="id" value={notif.id} />
                    <button type="submit" className="w-full text-right block">
                      <NotificationCard notification={notif} onMarkAsRead={() => {}} />
                    </button>
                  </form>
                ))}
              </AnimatePresence>

              {optimisticNotifications.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                  <p className="text-sm font-bold">אין התראות חדשות</p>
                </div>
              )}
            </div>

            {/* Footer Settle Actions */}
            {optimisticNotifications.some(n => n.unread) && (
              <div className="p-6 border-t border-white/10 bg-black/20">
                <form action={markAllAsReadFormAction}>
                  <button
                    type="submit"
                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-xs font-black text-white tracking-[0.1em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
                  >
                    <span>סמן הכל כנקרא</span>
                    <CheckCircle2 size={16} className="opacity-60" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
