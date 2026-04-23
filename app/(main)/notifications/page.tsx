'use client';

import React from 'react';
import { Bell, Ticket, Gift, Utensils, Info, CheckCircle2, Clock } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notification-store';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return Ticket;
      case 'offer': return Gift;
      case 'food': return Utensils;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'booking': return 'text-green-400';
      case 'offer': return 'text-primary';
      case 'food': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-green-400/10';
      case 'offer': return 'bg-primary/10';
      case 'food': return 'bg-blue-400/10';
      default: return 'bg-white/5';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'booking': return 'הזמנה';
      case 'offer': return 'מבצע';
      case 'food': return 'אוכל';
      default: return 'מידע';
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto pb-20 text-right">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-12 flex-row-reverse"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            ההתראות <span className="text-primary">שלי</span>
          </h1>
          <p className="text-slate-400 font-medium">הישאר מעודכן בהזמנות ובמבצעים שלך</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="px-6 py-3 bg-white/5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-white/5 rounded-2xl text-[10px] font-black text-slate-300 transition-all uppercase tracking-widest active:scale-95"
        >
          סמן הכל כנקרא
        </button>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif, index) => {
            const Icon = getIcon(notif.type);
            return (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markAsRead(notif.id)}
                className={`group relative flex items-start gap-6 p-6 rounded-[32px] border transition-all duration-500 cursor-pointer flex-row-reverse ${
                  notif.unread 
                    ? 'bg-white/5 border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
                    : 'bg-transparent border-white/5 hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                {notif.unread && (
                  <motion.div 
                    layoutId={`unread-${notif.id}`}
                    className="absolute top-6 left-6 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_#FF9F0A]" 
                  />
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getBg(notif.type)} ${getColor(notif.type)} border border-white/5 group-hover:scale-110 transition-all duration-500`}>
                  <Icon className="w-7 h-7" />
                </div>

                <div className="flex-1 text-right">
                  <div className="flex items-center gap-3 mb-1 justify-end">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                      {getTypeLabel(notif.type)}
                    </span>
                    <h3 className={`font-bold tracking-tight transition-colors duration-300 ${notif.unread ? 'text-white text-lg' : 'text-slate-400'}`}>
                      {notif.title}
                    </h3>
                  </div>
                  <p className={`font-medium mb-3 leading-relaxed transition-colors duration-300 ${notif.unread ? 'text-slate-300' : 'text-slate-500'}`}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest justify-end">
                    {notif.time}
                    <Clock className="w-3 h-3" />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${notif.unread ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                   <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                     <CheckCircle2 className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {notifications.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 relative">
            <Bell className="w-10 h-10 text-slate-700" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-primary/5 rounded-full"
            />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">הכל מעודכן!</h2>
          <p className="text-slate-500 max-w-xs font-medium">אין לך התראות חדשות כרגע. נעדכן אותך כשיקרה משהו מעניין.</p>
        </motion.div>
      )}
    </div>
  );
}

