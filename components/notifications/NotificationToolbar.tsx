'use client';

import React from 'react';
import { Search, CheckCircle2, Trash2, PlusCircle, Filter } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notification-store';
import { useAcousticFeedback } from '@/hooks/useAcousticFeedback';

interface NotificationToolbarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadOnly: boolean;
  onToggleUnreadOnly: () => void;
}

const categories = [
  { id: 'all', label: 'הכל' },
  { id: 'booking', label: 'הזמנות וסרטים' },
  { id: 'offer', label: 'מבצעים' },
  { id: 'food', label: 'אוכל' },
  { id: 'urgent', label: 'דחוף / VIP' },
];

export const NotificationToolbar: React.FC<NotificationToolbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  unreadOnly,
  onToggleUnreadOnly,
}) => {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearRead = useNotificationStore((state) => state.clearRead);
  const addSimulatedNotification = useNotificationStore((state) => state.addSimulatedNotification);
  const soundEnabled = useNotificationStore((state) => state.soundEnabled);
  const { playTick, playBassDrop } = useAcousticFeedback();

  const unreadCount = notifications.filter((n) => n.unread).length;
  const readCount = notifications.filter((n) => !n.unread).length;

  const handleMarkAll = () => {
    if (soundEnabled) playBassDrop();
    markAllAsRead();
  };

  const handleClearRead = () => {
    if (soundEnabled) playBassDrop();
    clearRead();
  };

  const handleSimulate = () => {
    if (soundEnabled) playBassDrop();
    addSimulatedNotification();
  };

  return (
    <div className="max-w-4xl mx-auto mb-6 space-y-4">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="חפש בהתראות..."
            className="w-full pr-11 pl-4 py-3 bg-white/[0.03] border border-white/10 focus:border-[#FF1464]/50 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {/* Unread Only Toggle */}
          <button
            onClick={() => {
              if (soundEnabled) playTick();
              onToggleUnreadOnly();
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
              unreadOnly
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
            }`}
          >
            <Filter size={14} />
            <span>שלא נקראו ({unreadCount})</span>
          </button>

          {/* Mark all as read */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="px-3.5 py-2.5 bg-white/5 hover:bg-[#FF1464]/20 hover:text-[#FF1464] border border-white/10 hover:border-[#FF1464]/40 rounded-xl text-xs font-black text-white/80 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>סמן הכל</span>
            </button>
          )}

          {/* Clear read */}
          {readCount > 0 && (
            <button
              onClick={handleClearRead}
              className="px-3.5 py-2.5 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 rounded-xl text-xs font-black text-white/70 transition-all flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>נקה נקראו</span>
            </button>
          )}

          {/* Simulate Live Notification */}
          <button
            onClick={handleSimulate}
            className="px-3.5 py-2.5 bg-[#FF1464]/10 hover:bg-[#FF1464] text-[#FF1464] hover:text-white border border-[#FF1464]/30 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            <span>סימולציה</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (soundEnabled) playTick();
                onSelectCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
