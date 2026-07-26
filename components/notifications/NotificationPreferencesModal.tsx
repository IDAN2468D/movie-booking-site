'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, BellRing, Mail, Sparkles, Check } from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notification-store';
import { useAcousticFeedback } from '@/hooks/useAcousticFeedback';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const soundEnabled = useNotificationStore((state) => state.soundEnabled);
  const toggleSound = useNotificationStore((state) => state.toggleSound);
  const { playTick } = useAcousticFeedback();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailSync, setEmailSync] = useState(false);
  const [aiDigestEnabled, setAiDigestEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg p-6 md:p-8 rounded-[36px] border border-white/10 bg-neutral-950/80 backdrop-blur-3xl saturate-[200%] text-right z-10 space-y-6"
          dir="rtl"
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-black text-white font-outfit">הגדרות התראה מותאמות</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">התאם אישית את ערוצי ההתראות והשמע</p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Preferences Toggles */}
          <div className="space-y-4">
            {/* Sound Toggle */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
                  <Volume2 size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">אפקטים קוליים (Web Audio)</div>
                  <div className="text-[11px] text-slate-400">אקוסטיקה היקפית בלחיצה ועדכונים</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playTick();
                  toggleSound();
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
                  soundEnabled ? 'bg-[#FF1464] justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Push Notifications Toggle */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                  <BellRing size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">התראות Push בדיפדוף</div>
                  <div className="text-[11px] text-slate-400">קבלת עדכוני סרטים בזמן אמת בדפדפן</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (soundEnabled) playTick();
                  setPushEnabled(!pushEnabled);
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
                  pushEnabled ? 'bg-[#FF1464] justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* AI Digest Toggle */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF1464]/10 text-[#FF1464] rounded-xl">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">תקציר AI אוטומטי</div>
                  <div className="text-[11px] text-slate-400">יצירת סיכומים מנהליים מבוססי AI</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (soundEnabled) playTick();
                  setAiDigestEnabled(!aiDigestEnabled);
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
                  aiDigestEnabled ? 'bg-[#FF1464] justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Email Sync Toggle */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">סנכרון אימייל שבועי</div>
                  <div className="text-[11px] text-slate-400">קבלה במייל של סיכום קבלות וכרטיסים</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (soundEnabled) playTick();
                  setEmailSync(!emailSync);
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
                  emailSync ? 'bg-[#FF1464] justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>

          {/* Footer Save */}
          <button
            onClick={() => {
              if (soundEnabled) playTick();
              onClose();
            }}
            className="w-full py-3.5 bg-white text-black font-black rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors shadow-xl"
          >
            <Check size={16} />
            <span>שמור הגדרות</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
