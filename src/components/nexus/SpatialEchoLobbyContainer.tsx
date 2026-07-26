"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { actionBroadcastVibeEcho } from "@/lib/actions/spatial-echo-actions";

export function SpatialEchoLobbyContainer() {
  const [echoText, setEchoText] = useState<string>("הקרנה מרגשת!");
  const [recentEchoes, setRecentEchoes] = useState<Array<{ id: string; msg: string; x: number; y: number }>>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const sendEcho = async () => {
    const x = Math.floor(Math.random() * 160) - 80;
    const y = Math.floor(Math.random() * 160) - 80;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const panner = ctx.createPanner();
      panner.panningModel = "HRTF";
      panner.positionX.setValueAtTime(x / 50, ctx.currentTime);
      panner.positionY.setValueAtTime(y / 50, ctx.currentTime);
      panner.positionZ.setValueAtTime(-1, ctx.currentTime);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(520 + Math.random() * 300, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(panner);
      panner.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.85);

      const res = await actionBroadcastVibeEcho({
        posX: x,
        posY: y,
        posZ: -10,
        vibeMessage: echoText,
        echoFrequency: osc.frequency.value,
      });

      if (res.success && res.data) {
        setRecentEchoes((prev) => [
          { id: res.data.echoId, msg: res.data.message, x, y },
          ...prev.slice(0, 4),
        ]);
      }
    } catch {
      // Audio fallback
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.15)] text-white font-['Outfit']">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300">
          🛰️ לובי שיתופי בתלת-ממד קולי (Spatial Echo)
        </h3>
        <span className="px-3 py-1 rounded-full text-xs font-mono border border-pink-500/40 bg-pink-500/10 text-pink-300">
          PANNER HRTF
        </span>
      </div>

      <p className="text-xs text-neutral-400 mb-4 font-['Inter']">
        שיגר הדהודי אווירה (Vibe Echoes) במרחב הקולנוע התלת-ממדי למשתמשים הממתינים בלובי.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={echoText}
          onChange={(e) => setEchoText(e.target.value)}
          placeholder="כתוב תגובה קצרצרה..."
          className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-400 font-['Inter']"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendEcho}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-sm shadow-lg shadow-pink-500/20"
        >
          שיגור הדהוד 📢
        </motion.button>
      </div>

      <div className="relative w-full h-36 rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
        {recentEchoes.map((echo) => (
          <motion.div
            key={echo.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ transform: `translate(${echo.x}px, ${echo.y}px)` }}
            className="absolute px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-xs font-['Inter'] text-pink-200 backdrop-blur-md shadow-lg"
          >
            {echo.msg}
          </motion.div>
        ))}
        {recentEchoes.length === 0 && (
          <span className="text-xs text-neutral-500 font-['Inter']">עדיין לא שוגרו הדהודים במרחב</span>
        )}
      </div>
    </div>
  );
}
