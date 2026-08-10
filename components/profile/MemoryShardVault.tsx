"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, Play, Share2, Award } from "lucide-react";
import { getUserMemoryShards } from "@/lib/actions/collectibleActions";

interface Shard {
  shardId: string;
  movieTitle: string;
  screeningDate: string;
  iconicQuote: string;
  hmacSignature: string;
  rarityTier: "common" | "rare" | "legendary" | "mythic";
}

export const MemoryShardVault: React.FC = () => {
  const [shards, setShards] = useState<Shard[]>([]);
  const [activeShard, setActiveShard] = useState<Shard | null>(null);

  useEffect(() => {
    getUserMemoryShards("user_me").then((res) => {
      if (res.success && res.data) {
        setShards(res.data);
        setActiveShard(res.data[0]);
      }
    });
  }, []);

  const playAudioFeedback = () => {
    if (typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl text-white" dir="rtl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-outfit">כספת זיכרונות הקולנוע הדיגיטלית (Memory Shards)</h3>
            <p className="text-xs text-slate-400">קלפי אספנות דיגיטליים חתומים קריפטוגרפית (HMAC SHA-256)</p>
          </div>
        </div>
        <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400 block">אוסף ה-Shards שלך</label>
          <div className="space-y-2">
            {shards.map((s) => (
              <motion.div
                key={s.shardId}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setActiveShard(s);
                  playAudioFeedback();
                }}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  activeShard?.shardId === s.shardId
                    ? "border-cyan-500 bg-cyan-950/40 shadow-lg shadow-cyan-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{s.movieTitle}</span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                      s.rarityTier === "mythic"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {s.rarityTier}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">{s.screeningDate}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {activeShard && (
          <div className="flex flex-col items-center justify-center">
            <motion.div
              whileHover={{ rotateY: 12, rotateX: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-xs rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/60 via-slate-900 to-purple-950/60 p-6 shadow-2xl backdrop-blur-2xl text-center"
            >
              <div className="absolute top-3 right-3 text-cyan-400">
                <Shield className="h-4 w-4" />
              </div>
              <div className="my-4 rounded-xl border border-cyan-400/20 bg-black/40 p-4">
                <p className="italic text-xs text-cyan-200 font-serif leading-relaxed font-medium">
                  "{activeShard.iconicQuote}"
                </p>
              </div>

              <h4 className="font-bold text-base font-outfit text-white">{activeShard.movieTitle}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">צולם והונפק ב-{activeShard.screeningDate}</p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono">HMAC: {activeShard.hmacSignature.slice(0, 10)}...</span>
                <button className="flex items-center gap-1 text-cyan-400 font-bold hover:underline">
                  <Share2 className="h-3 w-3" /> שייר Shard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
