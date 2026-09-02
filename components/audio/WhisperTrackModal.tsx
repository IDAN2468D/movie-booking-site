'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Headphones, Sliders, Volume2, Radio, Check, Sparkles } from 'lucide-react';
import { WhisperChannel, WhisperEqPreset } from '@/lib/audio/whisperTrackEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  channel: WhisperChannel;
  volume: number;
  latencyOffsetMs: number;
  eqPreset: WhisperEqPreset;
  togglePlay: () => void;
  selectChannel: (channel: WhisperChannel) => void;
  changeVolume: (volume: number) => void;
  changeLatency: (offsetMs: number) => void;
  changeEq: (preset: WhisperEqPreset) => void;
}

export const WhisperTrackModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isPlaying,
  channel,
  volume,
  latencyOffsetMs,
  eqPreset,
  togglePlay,
  selectChannel,
  changeVolume,
  changeLatency,
  changeEq,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl text-right space-y-6"
        >
          <button onClick={onClose} className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5">
            <X className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30 w-fit mb-2">
              <Headphones className="w-3.5 h-3.5" /> אולפן שמע אישי באולם
            </div>
            <h2 className="text-2xl font-black text-white font-outfit">
              כיול ערוץ WhisperTrack™
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              הזרמת שמע ברזולוציה גבוהה ישירות לאוזניות האישיות עם כיול סנכרון ואקולייזר מותאם.
            </p>
          </div>

          {/* Channel Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 block">בחירת ערוץ שידור חי באולם:</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'dialogue_boost', label: 'הגברת דיאלוג ממוקדת (Dialogue Clarity)', desc: 'מחדד דיבור ומנמיך רעשי פיצוצים לסובלים מקשיי שמיעה' },
                { id: 'directors_commentary', label: 'פרשנות במאי ויוצרים בזמן אמת', desc: 'ערוץ מאחורי הקלעים מסונכרן להקרנה' },
                { id: 'original_audio', label: 'שפת מקור באוזניות ללא דיבוב', desc: 'שמע קולנועי נקי באנגלית/שפת המקור' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectChannel(c.id as WhisperChannel)}
                  className={`p-3 rounded-2xl text-right transition-all border ${
                    channel === c.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-outfit">{c.label}</span>
                    {channel === c.id && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Latency Calibration Slider */}
          <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-bold">כיול סנכרון לשפתיים (Latency Offset):</span>
              <span className="text-cyan-400 font-mono font-bold">{latencyOffsetMs > 0 ? `+${latencyOffsetMs}` : latencyOffsetMs}ms</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="5"
              value={latencyOffsetMs}
              onChange={(e) => changeLatency(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>-100ms (הקדמה)</span>
              <span>סנכרון מושלם (0ms)</span>
              <span>+100ms (עיכוב)</span>
            </div>
          </div>

          {/* EQ Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 block">פרופיל אקולייזר (Dynamic EQ):</label>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { id: 'clear_voice', label: 'קול צלול 🗣️' },
                { id: 'commentary_focus', label: 'פוקוס במאי 🎙️' },
                { id: 'night_isolation', label: 'בידוד לילה 🌙' },
              ].map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => changeEq(eq.id as WhisperEqPreset)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    eqPreset === eq.id
                      ? 'bg-white text-zinc-950 font-black'
                      : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {eq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Master Play Button */}
          <button
            onClick={togglePlay}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
              isPlaying
                ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Headphones className="w-4 h-4" />
            {isPlaying ? 'הזרמת שמע פעילה (לחץ להשהיה)' : 'הפעל שידור באוזניות עכשיו'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
