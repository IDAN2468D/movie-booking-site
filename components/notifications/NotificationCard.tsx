'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Gift, Utensils, Info, AlertTriangle, CheckCircle2, Clock, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useNotificationStore, Notification } from '@/lib/store/notification-store';
import { useAcousticFeedback } from '@/hooks/useAcousticFeedback';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification: n,
  onMarkAsRead,
}) => {
  const dismissNotification = useNotificationStore((state) => state.dismissNotification);
  const soundEnabled = useNotificationStore((state) => state.soundEnabled);
  const { playTick } = useAcousticFeedback();

  const getStyle = () => {
    switch (n.type) {
      case 'urgent':
        return {
          bg: 'bg-[#FF1464]/10 border-[#FF1464]/40 text-[#FF1464]',
          glow: 'from-[#FF1464]/40 to-transparent',
          icon: AlertTriangle,
          badge: 'bg-[#FF1464] text-white',
          badgeText: 'דחוף',
        };
      case 'offer':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          glow: 'from-purple-500/30 to-transparent',
          icon: Gift,
          badge: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
          badgeText: 'הטבה',
        };
      case 'booking':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          glow: 'from-emerald-500/30 to-transparent',
          icon: Ticket,
          badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          badgeText: 'הזמנה',
        };
      case 'food':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          glow: 'from-cyan-500/30 to-transparent',
          icon: Utensils,
          badge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
          badgeText: 'אוכל',
        };
      default:
        return {
          bg: 'bg-sky-400/10 border-sky-400/30 text-sky-400',
          glow: 'from-sky-400/20 to-transparent',
          icon: Info,
          badge: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
          badgeText: 'עדכון',
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) playTick();
    dismissNotification(n.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: n.unread ? 1 : 0.65, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -30 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="group relative p-5 md:p-6 rounded-[28px] border border-white/10 bg-black/40 flex items-start gap-4 md:gap-5 overflow-hidden backdrop-blur-md cursor-pointer text-right"
      onClick={() => {
        if (n.unread) {
          if (soundEnabled) playTick();
          onMarkAsRead(n.id);
        }
      }}
    >
      {/* Liquid Glass Hover Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-l ${style.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform-gpu`}
      />

      {/* Unread Chroma Trail */}
      {n.unread && (
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF1464] to-transparent opacity-80 animate-pulse" />
      )}

      {/* Icon container */}
      <div className={`p-3.5 rounded-2xl border shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110 ${style.bg}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${style.badge}`}>
              {style.badgeText}
            </span>
            <div className="text-sm md:text-base font-black text-white font-outfit leading-tight drop-shadow-md truncate">
              {n.title}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-white/40 tracking-wider shrink-0">
            <Clock className="w-3 h-3" />
            {n.time}
          </div>
        </div>

        <div className="text-xs md:text-sm font-medium text-slate-300 leading-relaxed mt-1.5">
          {n.message}
        </div>

        {/* Action Link Button if provided */}
        {n.actionUrl && (
          <div className="mt-3">
            <Link
              href={n.actionUrl}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#FF1464] text-white text-xs font-black transition-colors"
            >
              <span>{n.actionLabel || 'עבור לפרטים'}</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        )}
      </div>

      {/* Action Controls (Dismiss / Mark as read) */}
      <div className="shrink-0 relative z-10 flex flex-col items-end gap-2 self-center">
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
          title="מחק התראה"
        >
          <X size={14} />
        </button>

        {/* Read / Unread Status */}
        {n.unread ? (
          <div className="w-3 h-3 rounded-full bg-[#FF1464] border border-black shadow-[0_0_10px_#FF1464] animate-pulse" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-green-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
