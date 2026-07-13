"use client";

import React from "react";
import { motion } from "framer-motion";
import { Ticket, Gift, Utensils, Info, CheckCircle2, Clock } from "lucide-react";

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

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification: n,
  onMarkAsRead,
}) => {
  const getStyle = () => {
    switch (n.type) {
      case 'offer':
        return {
          bg: "bg-[#FF1464]/10 border-[#FF1464]/30 text-[#FF1464]",
          glow: "from-[#FF1464]/40 to-transparent",
          icon: Gift
        };
      case 'booking':
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          glow: "from-emerald-500/30 to-transparent",
          icon: Ticket
        };
      case 'food':
        return {
          bg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
          glow: "from-cyan-500/30 to-transparent",
          icon: Utensils
        };
      default:
        return {
          bg: "bg-sky-400/10 border-sky-400/30 text-sky-400",
          glow: "from-sky-400/20 to-transparent",
          icon: Info
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, z: 0 }}
      animate={{ opacity: n.unread ? 1 : 0.4, scale: 1, z: 0 }}
      exit={{ opacity: 0, scale: 0.9, z: -20 }}
      whileHover={{ scale: 1.02, z: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
      className="group relative p-5 rounded-[24px] border border-white/10 bg-black/40 flex items-start gap-5 overflow-hidden backdrop-blur-md cursor-pointer"
      onClick={() => {
        if (n.unread) onMarkAsRead(n.id);
      }}
    >
      {/* Liquid Glass Hover Glow using mix-blend-plus-lighter */}
      <div
        className={`absolute inset-0 bg-gradient-to-l ${style.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-plus-lighter pointer-events-none transform-gpu`}
      />

      {/* Kinetic Conic Border (Chroma Border Trail for Unread items) */}
      {n.unread && (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[24px]">
          <div 
            className="absolute inset-[-50%] w-[200%] h-[200%] animate-spin origin-center opacity-40 mix-blend-screen" 
            style={{ 
              animationDuration: '3s', 
              background: `conic-gradient(from 0deg, transparent 0%, transparent 75%, currentColor 100%)`,
              color: n.type === 'offer' ? '#FF1464' : n.type === 'booking' ? '#10b981' : '#0ea5e9'
            }} 
          />
        </div>
      )}

      {/* Icon container */}
      <div className={`p-3 rounded-xl border shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110 ${style.bg}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="text-sm font-black text-white truncate font-outfit leading-tight drop-shadow-md">
          {n.title}
        </div>
        <div className="text-xs font-medium text-white/70 mt-1.5 leading-relaxed">
          {n.message}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 mt-2.5 tracking-wider uppercase opacity-80">
          <Clock className="w-3 h-3" />
          {n.time}
        </div>
      </div>

      {/* Unread dot / Checked icon */}
      <div className="shrink-0 relative z-10 self-center">
        {n.unread ? (
          <div className={`w-3 h-3 rounded-full border border-black shadow-[0_0_10px_currentColor] ${style.bg.split(' ')[0].replace('/10', '')}`} />
        ) : (
          <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-green-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
