'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Film, ArrowLeft, Zap, Heart, Compass, Smile, Eye } from 'lucide-react';
import { useAudioContextManager } from '@/hooks/useAudioContextManager';

interface MoodOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  desc: string;
  recommended: string[];
}

const MOODS: MoodOption[] = [
  {
    id: 'action',
    label: 'אקשן ואדרנלין',
    icon: Zap,
    accent: 'from-amber-500/20 to-rose-500/30 text-amber-400 border-amber-500/40',
    desc: 'קצב דופק מהיר, פיצוצים וסאונד היקפי ב-4K',
    recommended: ['חולית: חלק 2', 'דדפול & וולברין'],
  },
  {
    id: 'romance',
    label: 'דייט ורומנטיקה',
    icon: Heart,
    accent: 'from-pink-500/20 to-rose-500/30 text-pink-400 border-pink-500/40',
    desc: 'חוויה זוגית עוטפת, מושבי VIP ואווירה אינטימית',
    recommended: ['רק לא אתה', 'לה לה לנד'],
  },
  {
    id: 'scifi',
    label: 'מד"ב וחלל עמוק',
    icon: Compass,
    accent: 'from-cyan-500/20 to-blue-500/30 text-cyan-400 border-cyan-500/40',
    desc: 'מסע בין ממדים, ויזואליה עוצרת נשימה והרמוניות סאב-באס',
    recommended: ['בין כוכבים', 'מטריקס: התחייה'],
  },
  {
    id: 'thriller',
    label: 'מתח ומסתורין',
    icon: Eye,
    accent: 'from-purple-500/20 to-indigo-500/30 text-purple-400 border-purple-500/40',
    desc: 'תעלומות מפותלות, סצנות חשוכות ועצירת נשימה',
    recommended: ['אופנהיימר', 'שאטר איילנד'],
  },
  {
    id: 'comedy',
    label: 'צחוק וקלילות',
    icon: Smile,
    accent: 'from-emerald-500/20 to-teal-500/30 text-emerald-400 border-emerald-500/40',
    desc: 'הומור משחרר, פופקורן ענק ומצב רוח מרומם',
    recommended: ['הקול בראש 2', 'קונג פו פנדה 4'],
  },
];

interface OrbMoodPickerProps {
  onClose?: () => void;
}

export const OrbMoodPicker: React.FC<OrbMoodPickerProps> = ({ onClose }) => {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const { playChime, playHapticBass } = useAudioContextManager();

  const handleSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
    playChime(640, 0.25);
    playHapticBass(55, 0.15);
  };

  return (
    <div className="flex flex-col gap-4 text-white font-sans text-right" dir="rtl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/15">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-outfit tracking-wide">CinePulse AI Concierge</h3>
            <p className="text-xs text-white/50">מה הווייב הקולנועי שלך להיום?</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedMood ? (
          <motion.div
            key="mood-list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto scrollbar-hide pe-1"
          >
            {MOODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className={`flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 group text-right ${m.accent}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">{m.label}</span>
                      <span className="text-[10px] text-white/45 line-clamp-1">{m.desc}</span>
                    </div>
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:-translate-x-1 transition-all duration-200" />
                </button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="mood-recommendation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-3"
          >
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${selectedMood.accent} border backdrop-blur-md`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold text-white font-outfit">התאמת AI מדויקת ל-{selectedMood.label}</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mb-3">{selectedMood.desc}</p>
              
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-white/60 block">סרטים מומלצים באולמות כעת:</span>
                {selectedMood.recommended.map((title, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-black/30 border border-white/10">
                    <Film className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-medium text-white">{title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => setSelectedMood(null)}
                className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                בחר מצב רוח אחר
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                >
                  הבנתי, סגור
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
