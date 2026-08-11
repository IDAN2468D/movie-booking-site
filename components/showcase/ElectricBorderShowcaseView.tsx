'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Bell, ArrowRight, Sliders, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import ElectricSmartPickCard from '@/components/home/ElectricSmartPickCard';
import LoadingIndicator, { LoadingIndicatorVariant } from '@/components/ui/LoadingIndicator';
import { AIRecommendation } from '@/types/ai';

const SAMPLE_RECS: AIRecommendation[] = [
  {
    movieId: 'rec-1',
    title: 'סופרגירל',
    bestFormat: 'אימקס',
    reason: 'מתאים לאהבה שלך ל-פעולה, מדע בדיוני',
    availabilityBadge: 'נותרו 12 מושבים ל-22:05',
    savingsTip: 'חינם עם מנוי ה-MovieBook שלך',
  },
  {
    movieId: 'rec-2',
    title: 'ספיידרמן: אין דרך הביתה',
    bestFormat: 'אימקס',
    reason: 'מתאים לאהבה שלך ל-פעולה, מדע בדיוני',
    availabilityBadge: 'נותרו 12 מושבים ל-22:05',
    savingsTip: 'חינם עם מנוי ה-MovieBook שלך',
  },
  {
    movieId: 'rec-3',
    title: 'ספיידרמן: יום חדש',
    bestFormat: 'אימקס',
    reason: 'מתאים לאהבה שלך ל-מדע בדיוני, פעולה',
    availabilityBadge: 'נותרו 12 מושבים ל-22:05',
    savingsTip: 'חינם עם מנוי ה-MovieBook שלך',
  },
];

export default function ElectricBorderShowcaseView() {
  const [selectedCard, setSelectedCard] = useState<string>('rec-1');
  const [activeVariant, setActiveVariant] = useState<LoadingIndicatorVariant>('orbit');
  const [indicatorColor, setIndicatorColor] = useState<string>('#ff4500');
  const [indicatorSize, setIndicatorSize] = useState<number>(48);

  return (
    <div className="max-w-6xl mx-auto space-y-12 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[32px] bg-[#11090d]/80 border border-orange-500/20 backdrop-blur-3xl shadow-[0_0_30px_rgba(255,69,0,0.15)]">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#ff4500] text-white rounded-2xl shadow-[0_0_20px_rgba(255,69,0,0.5)]">
            <Zap className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ff8800] bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                PRO FEATURE
              </span>
              <h1 className="text-3xl font-black text-white font-outfit">סטודיו גבול חשמלי & אינדיקטורים</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">מנוע אנימציות ניאון מואצות GPU ב-120Hz ואינדיקטורי טעינה היפר-מודרניים</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#ff4500]/20 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <Bell size={14} />
            <span>מרכז התראות</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff4500] text-black font-black text-xs hover:bg-[#ff8800] transition-colors shadow-[0_0_15px_rgba(255,69,0,0.4)]"
          >
            <span>לדף הבית</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Section 1: Live Electric Movie Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff4500]" />
            <h2 className="text-xl font-black text-white font-outfit">כרטיסיות MovieBook עם גבול מסתובב</h2>
          </div>
          <span className="text-xs text-slate-400">לחצו על כרטיסייה להפעלת מצב בחירה</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_RECS.map((rec, index) => (
            <ElectricSmartPickCard
              key={rec.movieId}
              rec={rec}
              index={index}
              isSelected={selectedCard === rec.movieId}
              onClick={() => setSelectedCard(rec.movieId)}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Loading Indicator Generator Studio */}
      <section className="p-8 rounded-[32px] bg-[#0d0910]/90 border border-white/10 backdrop-blur-3xl space-y-8">
        <div className="flex items-center gap-3">
          <Sliders className="w-6 h-6 text-[#00f0ff]" />
          <div>
            <h2 className="text-xl font-black text-white font-outfit">מעבדת אינדיקטורי טעינה (GPU 60/120 FPS)</h2>
            <p className="text-xs text-slate-400">אנימציות מבוססות Transform/Opacity ללא Layout Reflows</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Live Preview Box */}
          <div className="h-64 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff4500]/5 via-transparent to-[#00f0ff]/5 pointer-events-none" />
            <LoadingIndicator
              variant={activeVariant}
              size={indicatorSize}
              color={indicatorColor}
              label="הדגמת אינדיקטור פעיל"
            />
            <span className="text-xs text-slate-400 font-mono mt-6">
              Variant: {activeVariant} | Size: {indicatorSize}px
            </span>
          </div>

          {/* Controls */}
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">סגנון אנימציה (Variant):</label>
              <div className="grid grid-cols-4 gap-2">
                {(['orbit', 'spinner', 'pulse', 'dots'] as LoadingIndicatorVariant[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVariant(v)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      activeVariant === v
                        ? 'bg-[#ff4500] text-white shadow-[0_0_12px_rgba(255,69,0,0.5)]'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">צבע ראשי:</label>
              <div className="flex items-center gap-3">
                {['#ff4500', '#ff0055', '#00f0ff', '#a855f7', '#22c55e', '#ffaa00'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setIndicatorColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform ${indicatorColor === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>גודל פיקסלים: {indicatorSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="80"
                value={indicatorSize}
                onChange={(e) => setIndicatorSize(Number(e.target.value))}
                className="w-full accent-[#ff4500] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
