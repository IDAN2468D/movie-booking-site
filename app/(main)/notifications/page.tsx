'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sparkles } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notification-store';
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationAiDigest } from '@/components/notifications/NotificationAiDigest';
import { NotificationToolbar } from '@/components/notifications/NotificationToolbar';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationPreferencesModal } from '@/components/notifications/NotificationPreferencesModal';

export default function NotificationsPage() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [showAiDigest, setShowAiDigest] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Filtered notifications logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'urgent' && notif.priority !== 'urgent' && notif.type !== 'urgent') {
          return false;
        }
        if (activeCategory !== 'urgent' && notif.type !== activeCategory) {
          return false;
        }
      }
      // Unread only filter
      if (unreadOnly && !notif.unread) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = notif.title.toLowerCase().includes(q);
        const msgMatch = notif.message.toLowerCase().includes(q);
        if (!titleMatch && !msgMatch) return false;
      }
      return true;
    });
  }, [notifications, activeCategory, unreadOnly, searchQuery]);

  return (
    <div className="min-h-screen pb-32 px-4 md:px-10 pt-8 text-right overflow-x-hidden bg-[#05070B]" dir="rtl">
      {/* Dynamic Background Mesh Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#FF1464]/10 via-purple-600/10 to-cyan-500/10 blur-[140px] rounded-full mix-blend-screen opacity-50" />
      </div>

      {/* Page Header */}
      <NotificationHeader
        onOpenSettings={() => setIsSettingsOpen(true)}
        showAiDigest={showAiDigest}
        onToggleAiDigest={() => setShowAiDigest(!showAiDigest)}
      />

      {/* AI Digest Card (Collapsible) */}
      <AnimatePresence>
        {showAiDigest && <NotificationAiDigest key="ai-digest" />}
      </AnimatePresence>

      {/* Productive Toolbar */}
      <NotificationToolbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadOnly={unreadOnly}
        onToggleUnreadOnly={() => setUnreadOnly(!unreadOnly)}
      />

      {/* Notifications List Section */}
      <div className="space-y-4 max-w-4xl mx-auto" style={{ perspective: '1200px' }}>
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkAsRead={markAsRead}
            />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mb-6 border border-white/10 relative group shadow-[0_0_30px_rgba(255,20,100,0.1)]">
              <Bell className="w-8 h-8 text-slate-500 group-hover:text-[#FF1464] transition-colors duration-500" />
              <Sparkles className="absolute -top-2 -right-2 text-[#FF1464]/60 w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tighter font-outfit">
              שקט תעשייתי
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
              לא נמצאו התראות תואמות לסינון הנוכחי. כשיגיעו עדכונים חדשים, הם יופיעו כאן מייד.
            </p>
          </motion.div>
        )}
      </div>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
