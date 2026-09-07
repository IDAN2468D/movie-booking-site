'use client';

import React, { useState } from 'react';
import { ConcessionTelemetryBar } from '@/components/concessions/productive/ConcessionTelemetryBar';
import { ConcessionExpressBar } from '@/components/concessions/productive/ConcessionExpressBar';
import { ConcessionProductiveGrid } from '@/components/concessions/productive/ConcessionProductiveGrid';
import { ConcessionCustomizerModal } from '@/components/concessions/productive/ConcessionCustomizerModal';
import { ConcessionStickyTray } from '@/components/concessions/productive/ConcessionStickyTray';
import { HolographicArMenu } from '@/components/concessions/HolographicArMenu';
import { VisualCateringGrid } from '@/components/catering/VisualCateringGrid';
import AiComboPairingWidget from '@/components/food/AiComboPairingWidget';
import { useBookingStore } from '@/lib/store';

type ViewMode = 'express' | 'holographic' | 'grid';

export default function FoodPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('express');
  const selectedFood = useBookingStore((state) => state.selectedFood);
  const updateFoodQuantity = useBookingStore((state) => state.updateFoodQuantity);

  return (
    <main className="fixed inset-0 bg-neutral-950 pt-16 px-4 md:px-8 pb-4 overflow-y-auto flex flex-col z-40">
      {/* Ambient Volumetric Lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none transform-gpu" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none transform-gpu" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-5 relative z-10 min-h-0 pb-28" dir="rtl">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 shrink-0">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black font-outfit text-white tracking-tight flex items-center gap-2">
              <span>🍿</span> המזנון הסינמטי הפרודוקטיבי
            </h1>
            <p className="text-neutral-400 font-inter text-xs md:text-sm max-w-2xl hidden sm:block">
              מערכת הזמנות מהירה ונטולת חיכוך עם מארזי בזק בלחיצה אחת, סנכרון זמני מטבח ומשלוח למושב.
            </p>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('express')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-outfit font-bold transition-all ${
                viewMode === 'express'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ⚡ מזנון אקספרס
            </button>
            <button
              type="button"
              onClick={() => setViewMode('holographic')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-outfit font-medium transition-all ${
                viewMode === 'holographic'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ✨ תפריט 3D AR
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-outfit font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🍱 גריד קינטי
            </button>
          </div>
        </header>

        {/* Telemetry and Movie Countdown */}
        <ConcessionTelemetryBar />

        {/* 1-Tap Express Bundles */}
        <ConcessionExpressBar />

        {/* AI Combo Pairing Integration */}
        <AiComboPairingWidget />

        {/* Dynamic View Mode Content */}
        {viewMode === 'express' && <ConcessionProductiveGrid />}
        {viewMode === 'holographic' && <HolographicArMenu />}
        {viewMode === 'grid' && (
          <VisualCateringGrid
            selectedFood={selectedFood}
            updateFoodQuantity={updateFoodQuantity}
          />
        )}
      </div>

      {/* Global Modals and Sticky Floating Tray */}
      <ConcessionCustomizerModal />
      <ConcessionStickyTray />
    </main>
  );
}
