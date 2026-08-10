"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Activity, Zap, X, ShieldCheck } from "lucide-react";
import { useSensoryStore } from "@/lib/store/sensoryStore";
import { saveSensoryProfile } from "@/lib/actions/sensoryActions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  seatId: string;
  movieId: string;
}

export const SensoryResonatorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  seatId,
  movieId,
}) => {
  const {
    hapticIntensity,
    subBassFrequency,
    ambientLightingColor,
    pulsePattern,
    isResonating,
    setHapticIntensity,
    setSubBassFrequency,
    setPulsePattern,
    setResonating,
  } = useSensoryStore();

  const [saving, setSaving] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerHapticFeedback = () => {
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
  };

  const toggleResonator = () => {
    const nextState = !isResonating;
    setResonating(nextState);
    if (nextState) {
      triggerHapticFeedback();
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(subBassFrequency, ctx.currentTime);
          osc.frequency.setValueAtTime(subBassFrequency, ctx.currentTime);
          osc.connect(filter);
          filter.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
          audioCtxRef.current = ctx;
        }
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await saveSensoryProfile({
      seatId,
      movieId,
      hapticIntensity,
      subBassFrequency,
      ambientLightingColor,
      pulsePattern,
      isActive: true,
    });
    setSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl text-white"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-600/20 p-2.5 text-purple-400">
                <Activity className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-outfit">AI Bio-Sync Haptic Resonator</h3>
                <p className="text-xs text-slate-400">סנכרון תדר רטט ותאורת אווירה למושב {seatId}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>עוצמת רטט Haptic</span>
                <span className="text-purple-400 font-bold">{hapticIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hapticIntensity}
                onChange={(e) => setHapticIntensity(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>תדר Sub-Bass אקוסטי (Hz)</span>
                <span className="text-cyan-400 font-bold">{subBassFrequency} Hz</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                value={subBassFrequency}
                onChange={(e) => setSubBassFrequency(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">דפוס פעימה חכם</label>
              <div className="grid grid-cols-2 gap-2">
                {(["soft", "rhythmic", "intense", "sub-bass-heavy"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPulsePattern(p)}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      pulsePattern === p
                        ? "border-purple-500 bg-purple-500/20 text-purple-200"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {p === "soft" && "רך ועדין"}
                    {p === "rhythmic" && "קצבי ומאוזן"}
                    {p === "intense" && "עוצמתי (120Hz)"}
                    {p === "sub-bass-heavy" && "סאב-באס עמוק"}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={toggleResonator}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                  isResonating
                    ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                }`}
              >
                {isResonating ? <Volume2 className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                {isResonating ? "הפסק פולס אקוסטי" : "הפעל סימולציית תדרים ורטט"}
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
              ביטול
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-all"
            >
              <ShieldCheck className="h-4 w-4" />
              {saving ? "שומר..." : "שמור פרופיל תדרים"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
