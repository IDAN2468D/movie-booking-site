'use client';

import React from 'react';
import { Headphones, Clapperboard } from 'lucide-react';
import { DirectorsCutPlayer } from '@/components/directors-cut/DirectorsCutPlayer';

export default function DirectorsCutPage() {
  return (
    <div className="min-h-screen px-4 md:px-12 py-8 space-y-8 text-right" dir="rtl">
      {/* Hero Header */}
      <div className="p-6 md:p-10 rounded-[40px] bg-black/60 backdrop-blur-3xl border border-cyan-500/25 shadow-[0_25px_80px_rgba(6,182,212,0.2)] space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-black">
          <Headphones size={16} />
          <span>Director&apos;s Cut Audio AI Companion • Gemini Multi-Track</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white font-rubik">
          מרכז פרשנות הבמאי והסודות הקולנועיים
        </h1>
        <p className="text-sm text-off-white/70 max-w-2xl">
          האזן לרצועות פרשנות חכמות בזמן אמת: חזון הבמאי, סודות צילום ועדשות, ניתוח ביקורתי עמוק וציד רמזים ו-Easter Eggs המופקים ע״י Gemini AI.
        </p>
      </div>

      <DirectorsCutPlayer movieId="693134" movieTitle="חולית: חלק 2" />
    </div>
  );
}
