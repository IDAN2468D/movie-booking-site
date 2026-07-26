'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Volume2, VolumeX, Settings, Sparkles } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notification-store';
import { useAcousticFeedback } from '@/hooks/useAcousticFeedback';

interface NotificationHeaderProps {
  onOpenSettings: () => void;
  showAiDigest: boolean;
  onToggleAiDigest: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onOpenSettings,
  showAiDigest,
  onToggleAiDigest,
}) => {
  const notifications = useNotificationStore((state) => state.notifications);
  const soundEnabled = useNotificationStore((state) => state.soundEnabled);
  const toggleSound = useNotificationStore((state) => state.toggleSound);
  const { playTick } = useAcousticFeedback();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSoundToggle = () => {
    if (soundEnabled) playTick();
    toggleSound();
  };

  return (
    <div
      className="mb-8 max-w-4xl mx-auto relative p-6 md:p-8 rounded-[36px] border border-white/[0.08] backdrop-blur-3xl saturate-[200%] brightness-110 bg-white/[0.02]"
      style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10"
      >
        <div>
          <div className="flex items-center gap-3 mb-2 justify-start">
            <div className="p-2.5 bg-[#FF1464]/10 rounded-2xl border border-[#FF1464]/20 text-[#FF1464]">
              <Bell size={20} className="animate-pulse" />
            </div>
            <p className="text-[10px] md:text-xs text-[#FF1464] font-black uppercase tracking-[0.25em]">
              Neural Command Hub
            </p>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF1464] text-white text-[10px] font-black animate-pulse">
                {unreadCount} חדשות
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2 font-outfit">
            מרכז <span className="text-[#FF1464] drop-shadow-[0_0_25px_rgba(255,20,100,0.5)]">התראות</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium max-w-md leading-relaxed">
            מרכז ניהול חכם ופרודוקטיבי עבור ההקרנות, המבצעים והזמנות האוכל שלך בזמן אמת.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* AI Digest Toggle */}
          <button
            onClick={() => {
              if (soundEnabled) playTick();
              onToggleAiDigest();
            }}
            className={`px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border font-outfit ${
              showAiDigest
                ? 'bg-[#FF1464] text-white border-[#FF1464] shadow-[0_0_20px_rgba(255,20,100,0.4)]'
                : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
            }`}
          >
            <Sparkles size={16} />
            <span>תקציר AI</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={handleSoundToggle}
            className={`p-3 rounded-2xl border transition-all ${
              soundEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
            }`}
            title={soundEnabled ? 'צלילים פעילים' : 'צלילים מושתקים'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Preferences Settings Modal trigger */}
          <button
            onClick={() => {
              if (soundEnabled) playTick();
              onOpenSettings();
            }}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 hover:text-white transition-all"
            title="הגדרות התראה"
          >
            <Settings size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
