'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Volume2, Smartphone, Sparkles } from 'lucide-react';
import { processHapticAudioSync } from '@/app/actions/hapticAudioActions';

export function HapticWavefrontModulator() {
  const [active, setActive] = useState(false);
  const [freq, setFreq] = useState(40);
  const [status, setStatus] = useState<string>('מוכן לסנכרון');

  const handleToggleSync = async () => {
    if (active) {
      setActive(false);
      setStatus('הסנכרון הופסק');
      return;
    }

    setStatus('מסנכרן תדרים...');
    const res = await processHapticAudioSync({
      frequencyHz: freq,
      intensity: 0.85,
      pattern: [120, 60, 180, 60],
    });

    if (res.success && res.data) {
      setActive(true);
      setStatus('סנכרון Tactile Haptic 120Hz פעיל');

      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(res.data.config.pattern);
      }

      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch {
        // Audio fallback
      }
    } else {
      setStatus(res.error || 'שגיאה בסנכרון');
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl p-6 rounded-2xl bg-neutral-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl text-right">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              סנכרון תדרי תנודה רטוטים (Haptic Sub-Bass)
            </h3>
            <p className="text-xs text-neutral-400">
              Web Audio 35Hz-50Hz & Tactile Vibration Modulator
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          120Hz GPU
        </span>
      </div>

      <div className="space-y-4 my-4">
        <div>
          <div className="flex justify-between text-xs text-neutral-300 mb-1">
            <span>תדר בס (Hz): {freq}Hz</span>
            <span>35Hz - 50Hz Sub-Bass</span>
          </div>
          <input
            type="range"
            min={30}
            max={60}
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/50 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-neutral-300">תדר אקוסטי סביבתי</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/50 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-neutral-300">Haptics Engine פעיל</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
        <span className="text-xs text-cyan-400/90 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {status}
        </span>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleToggleSync}
          className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg ${
            active
              ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-rose-950/50'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-950/50'
          }`}
        >
          {active ? 'הפסק סנכרון רטט' : 'הפעל סנכרון בס אקוסטי'}
        </motion.button>
      </div>
    </div>
  );
}
