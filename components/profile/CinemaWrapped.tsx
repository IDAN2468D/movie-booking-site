"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Film, Clock, Share2, Sparkles } from "lucide-react";
import { getCinemaWrappedAction, CinemaWrappedData } from "@/app/actions/cinemaWrappedActions";

export function CinemaWrapped() {
  const [data, setData] = useState<CinemaWrappedData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getCinemaWrappedAction().then((res) => {
      if (res.success && res.data) {
        setData(res.data);
      }
    });
  }, []);

  const handleShare = () => {
    if (!data) return;
    navigator.clipboard.writeText(`צפיתי ב-${data.totalMoviesWatched} סרטים ב-${data.totalCinemaHours} שעות קולנוע השנה! 🎬`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto my-6 p-6 bg-gradient-to-br from-purple-950/80 via-neutral-950/90 to-cyan-950/80 backdrop-blur-2xl border border-purple-500/30 rounded-3xl shadow-[0_20px_50px_rgba(124,58,237,0.3)] relative overflow-hidden"
      dir="rtl"
    >
      <div className="absolute top-0 right-0 p-8 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div>
          <span className="text-xs text-purple-400 font-bold font-mono">CINEMA WRAPPED {data.year}</span>
          <h3 className="font-outfit text-2xl font-bold text-white">סיכום החוויה הקולנועית שלך</h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
          <Trophy className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
          <Film className="w-5 h-5 text-cyan-400 mb-2" />
          <span className="text-2xl font-bold font-mono text-white block">{data.totalMoviesWatched}</span>
          <span className="text-xs text-white/50">סרטים שנצפו</span>
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
          <Clock className="w-5 h-5 text-amber-400 mb-2" />
          <span className="text-2xl font-bold font-mono text-white block">{data.totalCinemaHours} שעות</span>
          <span className="text-xs text-white/50">זמן באולם הקולנוע</span>
        </div>
      </div>

      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl mb-6 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/60">ז'אנר מוביל:</span>
          <span className="text-purple-300 font-bold">{data.topGenre}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/60">סטטוס VIP:</span>
          <span className="text-amber-300 font-bold">{data.vipLevel}</span>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2"
      >
        {copied ? <Sparkles className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        {copied ? "הועתק ללוח!" : "שתף את כרטיסיית ה-Wrapped שלך"}
      </button>
    </motion.div>
  );
}
