"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { actionDecryptTelepathicPass } from "@/lib/actions/telepathic-vault-actions";

export function HapticTelepathicVaultContainer() {
  const [holding, setHolding] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [decryptedKey, setDecryptedKey] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startHold = () => {
    setHolding(true);
    setProgress(0);
    setDecryptedKey(null);

    if (navigator.vibrate) {
      navigator.vibrate([30, 50, 30, 50, 30]);
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio fallback silent
    }

    let current = 0;
    timerRef.current = setInterval(async () => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setHolding(false);

        if (navigator.vibrate) {
          navigator.vibrate([100, 30, 200]);
        }

        const res = await actionDecryptTelepathicPass({
          passId: "PASS-VIP-99",
          fingerprintHoldDurationMs: 1200,
          heartbeatBpm: 72,
          biometricToken: "TOKEN-TELEPATHIC-CRYPT",
        });

        if (res.success && res.data) {
          setDecryptedKey(res.data.decryptedSignature);
        }
      }
    }, 120);
  };

  const endHold = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setHolding(false);
    setProgress(0);
  };

  return (
    <div dir="rtl" className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] text-white font-['Outfit']">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
          🔑 כספת כרטיסי VIP טלפתית-הפטית
        </h3>
        <span className="px-3 py-1 rounded-full text-xs font-mono border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
          HEARTBEAT 50Hz
        </span>
      </div>

      <p className="text-xs text-neutral-400 mb-6 font-['Inter']">
        לחץ והחזק את הסורק הביומטרי לקבלת משוב הפטי מרטיט ופענוח קוד הכספת המוצפן.
      </p>

      <div className="flex flex-col items-center justify-center my-6">
        <motion.button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-28 h-28 rounded-full border-2 border-emerald-400/50 bg-gradient-to-br from-emerald-500/20 to-teal-900/40 flex items-center justify-center cursor-pointer overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          <motion.div
            className="absolute bottom-0 w-full bg-emerald-400/30 backdrop-blur-sm"
            style={{ height: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
          <span className="relative z-10 text-3xl">🖐️</span>
        </motion.button>
        <span className="text-xs text-neutral-400 mt-3 font-['Inter']">
          {holding ? `סורק תדר ביומטרי... ${progress}%` : "לחץ והחזק לזיהוי הפטי"}
        </span>
      </div>

      {decryptedKey && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center font-mono text-xs text-emerald-300 tracking-wider"
        >
          ✅ מפתח פוענח בהצלחה: {decryptedKey}
        </motion.div>
      )}
    </div>
  );
}
