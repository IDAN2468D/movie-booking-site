"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { actionOptimizeConcessionCombo } from "@/lib/actions/bio-concession-actions";

type Vibe = "Chill" | "Hyper" | "Cinematic" | "Focused" | "Ethereal";

export function BioAcousticConcessionContainer() {
  const [selectedVibe, setSelectedVibe] = useState<Vibe>("Cinematic");
  const [comboResult, setComboResult] = useState<{ combo: string; discount: string } | null>(null);

  const triggerSubBass = (hz: number) => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(hz, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.75);
    } catch {
      // Audio fallback
    }
  };

  const handleVibeSelect = async (vibe: Vibe) => {
    setSelectedVibe(vibe);
    triggerSubBass(35);

    const res = await actionOptimizeConcessionCombo({
      energyVibe: vibe,
      preferredCategory: "Combo",
      subBassSensitivity: 80,
    });

    if (res.success && res.data) {
      setComboResult({
        combo: res.data.recommendation.combo,
        discount: res.data.recommendation.discount,
      });
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] text-white font-['Outfit']">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200">
          🍿 עוזר מזנון ביו-אקוסטי (Bio-Acoustic Combo)
        </h3>
        <span className="px-3 py-1 rounded-full text-xs font-mono border border-amber-500/40 bg-amber-500/10 text-amber-300">
          SUB-BASS 35Hz
        </span>
      </div>

      <p className="text-xs text-neutral-400 mb-6 font-['Inter']">
        בחר את תדר האנרגיה שלך לקבלת המלצת קומבו מושלמת המלווה בהרטבת תת-בס 35Hz.
      </p>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {(["Chill", "Hyper", "Cinematic", "Focused", "Ethereal"] as Vibe[]).map((vibe) => (
          <motion.button
            key={vibe}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleVibeSelect(vibe)}
            className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
              selectedVibe === vibe
                ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20"
                : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/20"
            }`}
          >
            {vibe}
          </motion.button>
        ))}
      </div>

      {comboResult ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between font-['Inter']"
        >
          <div>
            <span className="text-xs text-amber-300 block mb-1">המלצת הקומבו שלך:</span>
            <span className="text-sm font-semibold text-white">{comboResult.combo}</span>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono">
            הנחה: {comboResult.discount}
          </span>
        </motion.div>
      ) : (
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-xs text-neutral-400 font-['Inter']">
          לחץ על אנרגיה לקבלת הקומבו המושלם
        </div>
      )}
    </div>
  );
}
