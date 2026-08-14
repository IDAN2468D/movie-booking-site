'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, Sparkles, Film } from 'lucide-react';

export default function NotFound() {
  const openSpotlight = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-spotlight-search'));
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
      dir="rtl"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 404 Glass Card */}
      <div className="relative z-10 max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl">
        {/* Floating Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
          <Film className="w-10 h-10 text-primary animate-pulse" />
        </div>

        {/* 404 Text */}
        <span className="text-6xl sm:text-7xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-400 to-amber-400 block mb-2 font-outfit">
          404
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white mb-3 font-outfit">
          העמוד שחיפשת לא נמצא
        </h1>
        <p className="text-xs sm:text-sm text-white/50 leading-relaxed mb-8 max-w-md mx-auto">
          נראה שההקרנה באולם זה הסתיימה, הכתובת אינה קיימת או שהועברה למיקום חדש ב-CinePulse.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-600 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-primary/25 active:scale-95 transition-all"
          >
            <Home size={15} />
            <span>חזרה לעמוד הראשי</span>
          </Link>

          <button
            type="button"
            onClick={openSpotlight}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Search size={15} className="text-primary" />
            <span>חיפוש ב-Spotlight</span>
          </button>
        </div>

        {/* Labs Link */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <Link
            href="/showcase/master-suite"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-bold"
          >
            <Sparkles size={13} />
            <span>מעבר לסוויטת CinePulse Labs 🚀</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
