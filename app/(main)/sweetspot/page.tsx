'use client';

import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { AcousticSweetspotSimulator } from '@/components/sweetspot/AcousticSweetspotSimulator';

export default function SweetSpotPage() {
  return (
    <div className="min-h-screen px-4 md:px-12 py-8 space-y-8 text-right" dir="rtl">
      {/* Hero Header */}
      <div className="p-6 md:p-10 rounded-[40px] bg-black/60 backdrop-blur-3xl border border-amber-500/25 shadow-[0_25px_80px_rgba(255,159,10,0.2)] space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
          <Volume2 size={16} />
          <span>Acoustic Sweet-Spot 3D Simulator • Web Audio Spatial Array</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white font-rubik">
          סימולטור נקודת הזהב האקוסטית
        </h1>
        <p className="text-sm text-off-white/70 max-w-2xl">
          בדוק את חוויית השמע המדויקת של מושב הקולנוע שלך לפני ההזמנה. סימולציית תלת-ממד של Dolby Atmos, עקומות תדרים וסאב-באס 35Hz.
        </p>
      </div>

      <AcousticSweetspotSimulator />
    </div>
  );
}
