'use client';

import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Bell, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notification-store';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCard } from '@/components/notifications/NotificationCard';

export default function NotificationsPage() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen pb-32 px-4 md:px-10 pt-10 text-right overflow-x-hidden bg-[#05070B]" dir="rtl">
      {/* Header Section - Premium Glass Container */}
      <div className="mb-12 max-w-4xl mx-auto relative p-8 md:p-10 rounded-[40px] border border-white/[0.06] backdrop-blur-3xl saturate-[200%] brightness-110 bg-white/[0.02]"
           style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3 justify-start">
               <div className="p-2.5 bg-[#FF1464]/10 rounded-xl border border-[#FF1464]/20 text-[#FF1464]">
                  <Bell size={20} className="animate-pulse" />
               </div>
               <p className="text-[9px] md:text-xs text-[#FF1464] font-black uppercase tracking-[0.3em]">Stay Synchronized</p>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2 font-outfit">
              מרכז <span className="text-[#FF1464] drop-shadow-[0_0_20px_rgba(255,20,100,0.4)] font-display">התראות</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium max-w-md">
               עדכונים חיים על ההקרנות שלך, הטבות בלעדיות והזמנות אוכל שנשלחו למנוע ה-AI.
            </p>
          </div>

          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="px-6 py-3.5 bg-white/5 hover:bg-[#FF1464]/10 hover:text-[#FF1464] hover:border-[#FF1464]/30 border border-white/10 rounded-2xl text-[10px] font-black text-white/80 transition-all uppercase tracking-[0.15em] active:scale-95 shadow-xl flex items-center justify-center gap-2 group font-outfit"
            >
               <span>סמן הכל כנקרא</span>
               <CheckCircle2 size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </motion.div>
        
        {/* Decorative background glow */}
        {/* Decorative background glow - ULTRA VISUAL SPEC */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-[#FF1464]/10 via-transparent to-purple-600/10 blur-[100px] rounded-full pointer-events-none -z-10 mix-blend-screen"
        />
      </div>

      {/* Notifications List Container */}
      <div className="space-y-4 max-w-4xl mx-auto" style={{ perspective: "1200px" }}>
        <AnimatePresence mode="popLayout">
          {notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkAsRead={markAsRead}
            />
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mb-6 border border-white/10 relative group">
              <Bell className="w-8 h-8 text-slate-600 group-hover:text-[#FF1464] transition-colors duration-500" />
              <motion.div 
                animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.25, 0.1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-[#FF1464]/10 rounded-[32px]"
              />
              <Sparkles className="absolute -top-2 -right-2 text-[#FF1464]/30 w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tighter font-outfit">שקט תעשייתי</h2>
            <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">הכל מעודכן במערכת. כשיהיו לנו חדשות קולנועיות מרעישות עבורך, הן יופיעו כאן מייד.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
