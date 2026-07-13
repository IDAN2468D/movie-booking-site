"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Check, Info, Sparkles, Trash2 } from "lucide-react";
import { NotificationInput } from "@/lib/validations/notifications";

interface NotificationItemProps {
  notification: NotificationInput & { id: string };
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification: n,
  onMarkAsRead,
  onDismiss,
}) => {
  const getSeverityStyle = (severity: NotificationInput["severity"]) => {
    switch (severity) {
      case "SYSTEM_ALERT":
        return { bg: "bg-amber-500/10 border-amber-500/30 text-amber-400", glow: "from-amber-500/30 to-transparent", icon: AlertCircle };
      case "VIP_AUCTION_OUTBID":
        return { bg: "bg-purple-500/10 border-purple-500/30 text-purple-400", glow: "from-purple-500/40 to-transparent", icon: Sparkles };
      default:
        return { bg: "bg-sky-400/10 border-sky-400/30 text-sky-400", glow: "from-sky-400/20 to-transparent", icon: Info };
    }
  };

  const style = getSeverityStyle(n.severity);
  const Icon = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, z: 0 }}
      animate={{ opacity: n.isRead ? 0.4 : 1, scale: 1, z: 0 }}
      exit={{ opacity: 0, scale: 0.9, z: -20 }}
      whileHover={{ scale: 1.02, z: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
      className={`group relative p-4 rounded-xl border border-white/10 bg-black/40 flex items-start gap-4 overflow-hidden backdrop-blur-md cursor-default`}
    >
      {/* Liquid Glass Hover Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-l ${style.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-plus-lighter pointer-events-none transform-gpu`}
      />

      {/* Icon container */}
      <div className={`p-2.5 rounded-xl border shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110 ${style.bg}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="text-[13px] font-black text-white truncate font-outfit leading-tight">{n.title}</div>
        <div className="text-[11px] font-medium text-white/70 mt-1 leading-relaxed">{n.message}</div>
        <div className="text-[9px] font-bold text-white/40 mt-1.5 tracking-wider uppercase">
          {new Date(n.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 shrink-0 relative z-10">
        {!n.isRead && (
          <button
            onClick={() => onMarkAsRead(n.id)}
            className="p-1.5 hover:bg-emerald-500/20 rounded-lg text-emerald-400/60 hover:text-emerald-400 transition-colors"
            title="סמן כנקרא"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onDismiss(n.id)}
          className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-400/60 hover:text-rose-400 transition-colors"
          title="מחק"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
