'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Gift, Utensils, Info, CheckCircle2, Clock } from 'lucide-react';
import { SeverityGlow } from './SeverityGlow';

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'offer' | 'food' | 'info';
  unread: boolean;
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'booking': return Ticket;
      case 'offer': return Gift;
      case 'food': return Utensils;
      default: return Info;
    }
  };

  const getThemeColors = () => {
    switch (notification.type) {
      case 'booking': return { text: 'text-green-400', border: 'border-green-400/20', bg: 'bg-green-400/10' };
      case 'offer': return { text: 'text-[#FF1464]', border: 'border-[#FF1464]/20', bg: 'bg-[#FF1464]/10' };
      case 'food': return { text: 'text-cyan-400', border: 'border-cyan-400/20', bg: 'bg-cyan-400/10' };
      default: return { text: 'text-slate-400', border: 'border-slate-400/20', bg: 'bg-slate-400/10' };
    }
  };

  const Icon = getIcon();
  const colors = getThemeColors();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onClick={() => onMarkAsRead(notification.id)}
      style={{
        boxShadow: '0 4px 30px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)'
      }}
      className={`group relative flex items-start gap-4 p-5 rounded-[24px] border cursor-pointer flex-row-reverse overflow-hidden transition-all duration-300 ${
        notification.unread 
          ? 'bg-white/5 border-white/10 saturate-[1.2]' 
          : 'bg-transparent border-white/5 hover:bg-white/[0.02] opacity-60 hover:opacity-100'
      }`}
    >
      {/* Background Severity light well */}
      {notification.unread && <SeverityGlow type={notification.type} />}

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border relative z-10 transition-transform duration-500 group-hover:scale-105 ${colors.bg} ${colors.border} ${colors.text}`}>
        <Icon className="w-5 h-5" />
        {notification.unread ? (
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FF1464] rounded-full shadow-[0_0_10px_#FF1464] border border-black" />
        ) : (
          <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-green-500 rounded-full border border-black flex items-center justify-center">
            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 text-right relative z-10 min-w-0">
        <h3 className={`font-black tracking-tight font-outfit truncate ${notification.unread ? 'text-white text-sm' : 'text-slate-400 text-xs'}`}>
          {notification.title}
        </h3>
        <p className={`font-medium text-xs leading-relaxed mt-1 mb-2 ${notification.unread ? 'text-slate-300' : 'text-slate-500'}`}>
          {notification.message}
        </p>
        <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 uppercase tracking-widest justify-end opacity-60">
          {notification.time}
          <Clock className="w-2.5 h-2.5" />
        </div>
      </div>
    </motion.div>
  );
};
