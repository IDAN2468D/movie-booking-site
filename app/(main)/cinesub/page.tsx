"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Sparkles, Film, Play, Download, Clock, Globe } from "lucide-react";
import CineSubTranscriberModal from "@/components/movie/CineSubTranscriberModal";
import CineSubSpectrumVisualizer from "@/components/cinesub/CineSubSpectrumVisualizer";
import FullMovieSubtitlesViewer from "@/components/cinesub/FullMovieSubtitlesViewer";
import { useSubtitleStore } from "@/lib/store/subtitleStore";

export default function CineSubShowcasePage() {
  const [activeTab, setActiveTab] = useState<"full" | "live">("full");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({ id: "693134", title: "חולית: חלק 2 (Dune: Part Two)" });

  return (
    <div className="min-h-screen p-4 md:p-10 max-w-6xl mx-auto space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-indigo-950/60 border border-cyan-500/30 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400" /> CinePulse Subtitles Studio v6.5 Pro
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">CineSub AI Live Studio</h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            תרגום מלא לכל הסרט בשפות מרובות, סנכרון חותמות זמן, תמלול חי מהמיקרופון והורדת קובצי SRT מוכנים.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setIsOpen(true)}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-base shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Mic className="w-5 h-5 animate-pulse" /> פתח תמלול חי ממיקרופון
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("full")}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "full"
              ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25"
              : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          <Film className="w-4 h-4" /> תרגום מלא לכל הסרט (Full Movie Subtitles)
        </button>

        <button
          onClick={() => setActiveTab("live")}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "live"
              ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25"
              : "bg-white/5 text-slate-400 hover:text-white"
          }`}
        >
          <Mic className="w-4 h-4" /> תמלול שמע ומיקרופון חי (Live Stream)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "full" ? (
        <FullMovieSubtitlesViewer movieId={selectedMovie.id} movieTitle={selectedMovie.title} />
      ) : (
        <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Mic className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white">תמלול וסנכרון שמע חי</h3>
            <p className="text-sm text-slate-400">
              דוגם שמע ישירות ממיקרופון הסמארטפון/המחשב, מפריד דוברים ומתרגם בזמן אמת.
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-3.5 rounded-2xl bg-cyan-500 text-black font-extrabold shadow-lg hover:bg-cyan-400 transition-all cursor-pointer"
          >
            פתח חלון כתוביות חי
          </button>
        </div>
      )}

      <CineSubTranscriberModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        movieId={selectedMovie.id}
        movieTitle={selectedMovie.title}
      />
    </div>
  );
}
