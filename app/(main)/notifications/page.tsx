'use client';

import React from 'react';
import { Bell, Ticket, Gift, Utensils, Info, CheckCircle2, Clock, Sparkles } from 'lucide-react';
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
      case 'food': return 'text-cyan-400';
      default: return 'text-slate-400';
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-green-400/10 border-green-400/20';
      case 'offer': return 'bg-primary/10 border-primary/20';
      case 'food': return 'bg-cyan-400/10 border-cyan-400/20';
      default: return 'bg-white/5 border-white/10';
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
    <div className="min-h-screen pb-32 px-4 md:px-10 pt-10 text-right overflow-x-hidden bg-background">
      {/* Header Section - Premium Glass */}
      <div className="mb-12 md:mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10"
        >
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-3 justify-end md:justify-start">
               <div className="p-2.5 bg-primary/20 rounded-xl border border-primary/30">
                  <Bell className="text-primary w-5 h-5" />
               </div>
               <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.4em]">Stay Synchronized</p>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2 font-outfit">
              מרכז <span className="text-primary drop-shadow-[0_0_20px_rgba(255,159,10,0.4)]">התראות</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium max-w-xs md:max-w-md ml-auto md:ml-0">
               עדכונים חיים על ההקרנות שלך, הטבות בלעדיות והזמנות אוכל שנשלחו למנוע ה-AI.
            </p>
          </div>

          <button 
            onClick={markAllAsRead}
            className="order-1 md:order-2 self-start md:self-center px-6 py-3 bg-white/5 backdrop-blur-2xl hover:bg-primary/20 hover:text-primary hover:border-primary/40 border border-white/10 rounded-2xl text-[10px] font-black text-slate-300 transition-all uppercase tracking-[0.2em] active:scale-95 shadow-xl group"
          >
            <span className="flex items-center gap-2">
               סמן הכל כנקרא
               <CheckCircle2 className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
        </motion.div>
        
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="space-y-4 max-w-3xl mx-auto md:mx-0">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif, index) => {
            const Icon = getIcon(notif.type);
            return (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markAsRead(notif.id)}
                className={`group relative flex items-start gap-4 md:gap-6 p-5 md:p-6 rounded-[32px] border transition-all duration-500 cursor-pointer flex-row-reverse overflow-hidden ${
                  notif.unread 
                    ? 'bg-white/5 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] saturate-[1.2]' 
                    : 'bg-transparent border-white/5 hover:bg-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                {/* Holographic background glow for unread */}
                {notif.unread && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 opacity-50 pointer-events-none" />
                )}

                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 border relative z-10 ${getBg(notif.type)} ${getColor(notif.type)} group-hover:scale-110 transition-all duration-700`}>
                  <Icon className="w-6 h-6 md:w-8 md:h-8" />
                  {notif.unread ? (
                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_#FF9F0A] border-2 border-background" />
                  ) : (
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-right relative z-10 min-w-0">
                  <div className="flex flex-col md:flex-row-reverse md:items-center gap-1 md:gap-3 mb-2">
                    <div className="flex items-center gap-2 justify-end">
                       <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${getBg(notif.type)} ${getColor(notif.type)}`}>
                         {getTypeLabel(notif.type)}
                       </span>
                       {notif.type === 'offer' && <Sparkles className="w-3 h-3 text-primary animate-pulse" />}
                    </div>
                    <h3 className={`font-black tracking-tight transition-colors duration-300 font-outfit truncate ${notif.unread ? 'text-white text-lg md:text-xl' : 'text-slate-400 text-base'}`}>
                      {notif.title}
                    </h3>
                  </div>
                  
                  <p className={`font-medium mb-4 leading-relaxed transition-colors duration-300 text-sm md:text-base ${notif.unread ? 'text-slate-300' : 'text-slate-500'}`}>
                    {notif.message}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest justify-end opacity-60">
                    {notif.time}
                    <Clock className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {notifications.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center max-w-sm mx-auto"
        >
          <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/10 relative group">
            <Bell className="w-10 h-10 text-slate-700 group-hover:text-primary transition-colors duration-500" />
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-primary/10 rounded-[32px]"
            />
            {/* Holographic sparkle */}
            <Sparkles className="absolute -top-2 -right-2 text-primary/40 w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter font-outfit">שקט תעשייתי</h2>
          <p className="text-slate-500 font-medium leading-relaxed">הכל מעודכן במערכת. כשיהיו לנו חדשות קולנועיות מרעישות עבורך, הן יופיעו כאן מייד.</p>
        </motion.div>
      )}
    </div>
  );
}
