"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Star, User, Clock, Wallet, Heart, X,
} from "lucide-react";
import { useWrappedStore } from "@/lib/store/wrappedStore";
import { getCinemaWrappedAction } from "@/app/actions/wrappedActions";
import WrappedStatCard from "./WrappedStatCard";
import WrappedShareButton from "./WrappedShareButton";

const ACCENT_COLORS = [
  "rgba(234, 179, 8, 0.15)",   // gold
  "rgba(139, 92, 246, 0.15)",  // purple
  "rgba(59, 130, 246, 0.15)",  // blue
  "rgba(236, 72, 153, 0.15)",  // pink
  "rgba(34, 197, 94, 0.15)",   // green
  "rgba(249, 115, 22, 0.15)",  // orange
];

export default function WrappedViewer() {
  const data = useWrappedStore((s) => s.wrappedData);
  const isLoading = useWrappedStore((s) => s.isLoading);
  const error = useWrappedStore((s) => s.error);
  const setWrappedData = useWrappedStore((s) => s.setWrappedData);
  const setLoading = useWrappedStore((s) => s.setLoading);
  const setError = useWrappedStore((s) => s.setError);
  const reset = useWrappedStore((s) => s.reset);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getCinemaWrappedAction("demo-user").then((res) => {
      if (res.success && res.data) {
        setWrappedData(res.data);
      } else {
        setError(res.error || "שגיאה");
      }
    });
    return () => reset();
  }, [setWrappedData, setLoading, setError, reset]);

  const playAmbientTone = useCallback((freq: number) => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch { /* silent */ }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/20 border-t-yellow-400 rounded-full"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white/50 font-[Inter]" dir="rtl">
        {error || "אין נתונים זמינים"}
      </div>
    );
  }

  const stats = [
    { label: "סרטים שצפית בהם", value: data.totalMovies, icon: <Film className="w-6 h-6 text-yellow-400" />, subtitle: "השנה" },
    { label: "הז'אנר האהוב עליך", value: data.favoriteGenre, icon: <Heart className="w-6 h-6 text-pink-400" /> },
    { label: "השחקן/ית המובילה", value: data.topActor, icon: <User className="w-6 h-6 text-blue-400" /> },
    { label: "שעת השיא שלך", value: data.peakHour, icon: <Clock className="w-6 h-6 text-purple-400" />, subtitle: "הזמן שאתה הכי אוהב לצפות" },
    { label: "דירוג ממוצע", value: data.avgRating, icon: <Star className="w-6 h-6 text-amber-400" />, subtitle: "מתוך 5 כוכבים" },
    { label: 'סה"כ הוצאה', value: `₪${data.totalSpend}`, icon: <Wallet className="w-6 h-6 text-green-400" />, subtitle: "על חוויות קולנועיות" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-y-auto">
      {/* Ambient background gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.06)_0%,transparent_60%)]" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 flex items-center justify-between p-4
          backdrop-blur-xl bg-neutral-950/80 border-b border-white/5"
        dir="rtl"
      >
        <h1 className="text-lg font-bold text-white font-[Outfit]">
          🎬 הסיכום הקולנועי שלך
        </h1>
        <WrappedShareButton targetRef={contentRef} />
      </motion.div>

      {/* Stats grid */}
      <div
        ref={contentRef}
        className="relative px-4 py-8 flex flex-col items-center gap-6 max-w-lg mx-auto"
      >
        {stats.map((stat, i) => (
          <div key={i} onMouseEnter={() => playAmbientTone(220 + i * 60)}>
            <WrappedStatCard
              label={stat.label}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
              index={i}
            />
          </div>
        ))}

        {/* Mood Journey Section */}
        {data.moodJourney.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-xs p-5 rounded-2xl backdrop-blur-3xl
              saturate-[250%] border border-white/[0.12] bg-neutral-950/40"
            style={{
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)",
            }}
            dir="rtl"
          >
            <h3 className="text-sm font-bold text-white/80 font-[Outfit] mb-3">
              🎭 מסע הרגשות שלך
            </h3>
            <div className="space-y-2">
              {data.moodJourney.map((mood, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-white/60 font-[Inter] w-24 text-right">
                    {mood.mood}
                  </span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${mood.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                  <span className="text-xs text-white/40 font-[Inter] w-8">
                    {mood.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
