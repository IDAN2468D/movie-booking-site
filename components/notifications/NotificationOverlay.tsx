"use client";

import React, { useEffect, useOptimistic, startTransition, useTransition, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import {
  useNotifications,
  useSetNotifications,
  useMarkAsRead,
  useDismissNotification,
} from "@/lib/store/notificationStore";
import {
  getNotificationsAction,
  markAsReadAction,
  dismissNotificationAction,
} from "@/app/actions/notificationActions";
import { NotificationItem } from "./NotificationItem";
import { NotificationGlow } from "./NotificationGlow";

interface NotificationOverlayProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationOverlay: React.FC<NotificationOverlayProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const storeNotifications = useNotifications();
  const setNotifications = useSetNotifications();
  const markAsReadStore = useMarkAsRead();
  const dismissNotificationStore = useDismissNotification();
  const [, startActionTransition] = useTransition();

  const [optimisticNotifications, setOptimisticNotifications] = useOptimistic(
    storeNotifications,
    (state, action: { type: "READ" | "DISMISS"; id: string }) => {
      if (action.type === "READ") {
        return state.map((n) => (n.id === action.id ? { ...n, isRead: true } : n));
      }
      if (action.type === "DISMISS") {
        return state.filter((n) => n.id !== action.id);
      }
      return state;
    }
  );

  useEffect(() => {
    if (!userId) return;
    getNotificationsAction(userId).then((res) => {
      if (res.success && res.data) setNotifications(res.data);
    });
  }, [userId, setNotifications]);

  const handleMarkAsRead = (id: string) => {
    startTransition(() => setOptimisticNotifications({ type: "READ", id }));
    startActionTransition(async () => {
      const res = await markAsReadAction(id);
      if (res.success) markAsReadStore(id);
    });
  };

  const handleDismiss = (id: string) => {
    startTransition(() => setOptimisticNotifications({ type: "DISMISS", id }));
    startActionTransition(async () => {
      const res = await dismissNotificationAction(id);
      if (res.success) dismissNotificationStore(id);
    });
  };

  const highestSeverity = useMemo(() => {
    const unread = optimisticNotifications.filter((n) => !n.isRead);
    if (unread.some((n) => n.severity === "VIP_AUCTION_OUTBID")) return "VIP_AUCTION_OUTBID";
    if (unread.some((n) => n.severity === "SYSTEM_ALERT")) return "SYSTEM_ALERT";
    return "INFO";
  }, [optimisticNotifications]);

  const hasUnread = optimisticNotifications.some((n) => !n.isRead);
  const getBorderColor = () => {
    if (highestSeverity === "VIP_AUCTION_OUTBID") return "rgba(168,85,247,0.8)";
    if (highestSeverity === "SYSTEM_ALERT") return "rgba(245,158,11,0.8)";
    return "rgba(56,189,248,0.8)";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, rotateX: 4, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, rotateX: -4, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          style={{ perspective: "1200px", transformStyle: "preserve-3d", willChange: "transform, opacity" }}
          className="absolute left-0 mt-3 w-[420px] z-50 rounded-[28px] overflow-hidden"
          dir="rtl"
        >
          {/* Volumetric Mesh behind */}
          <NotificationGlow severity={highestSeverity} />

          {/* Kinetic Conic Border (Chroma Border Trail) */}
          {hasUnread && (
            <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px]">
              <div 
                className="absolute inset-[-50%] w-[200%] h-[200%] animate-spin origin-center opacity-70" 
                style={{ 
                  animationDuration: '3s', 
                  background: `conic-gradient(from 0deg, transparent 0%, transparent 75%, ${getBorderColor()} 100%)` 
                }} 
              />
            </div>
          )}

          {/* Liquid Glass Base */}
          <div className="relative z-10 m-[1px] h-[calc(100%-2px)] rounded-[27px] backdrop-blur-[40px] saturate-[250%] bg-neutral-950/60 p-5 shadow-2xl border border-white/10 flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <Bell className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                </div>
                <div>
                  <h2 className="font-black text-white text-base tracking-tight font-outfit leading-none">התראות מערכת</h2>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">Real-time Stream</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar relative z-10" style={{ transformStyle: "preserve-3d" }}>
              <AnimatePresence mode="popLayout">
                {optimisticNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 text-white/40 text-sm font-medium"
                  >
                    אין התראות חדשות
                  </motion.div>
                ) : (
                  optimisticNotifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkAsRead={handleMarkAsRead}
                      onDismiss={handleDismiss}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
