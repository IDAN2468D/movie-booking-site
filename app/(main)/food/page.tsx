'use client';

import React, { useState } from 'react';
import { VisualCateringGrid } from "@/components/catering/VisualCateringGrid";
import { HolographicArMenu } from "@/components/concessions/HolographicArMenu";
import { useBookingStore } from "@/lib/store";

export default function FoodPage() {
  const [viewMode, setViewMode] = useState<'holographic' | 'grid'>('holographic');
  const selectedFood = useBookingStore((state) => state.selectedFood);
  const updateFoodQuantity = useBookingStore((state) => state.updateFoodQuantity);

  return (
    <main className="fixed inset-0 bg-neutral-950 pt-16 px-4 md:px-8 pb-4 overflow-y-auto flex flex-col z-40">
      {/* Volumetric background ambient beam effect */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none transform-gpu" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-4 relative z-10 min-h-0 pb-16" dir="rtl">
        {/* Section Premium Typography Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 shrink-0">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-outfit text-white tracking-tight flex items-center gap-2">
              <span>🍿</span> המזנון הסינמטי המשודרג
            </h1>
            <p className="text-neutral-400 font-inter text-xs md:text-sm max-w-2xl hidden sm:block">
              חוויה קולינרית רפרקטיבית הולוגרפית המותאמת אישית לז'אנר הסרט ומצב הרוח הסינמטי שלך.
            </p>
          </div>

          {/* View Mode Toggle Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('holographic')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-outfit font-medium transition-all ${
                viewMode === 'holographic'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ✨ תפריט AR הולוגרפי 3D
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-outfit font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              🍱 תצוגת גריד קלאסית
            </button>
          </div>
        </div>

        {/* View Selection Content */}
        {viewMode === 'holographic' ? (
          <HolographicArMenu />
        ) : (
          <VisualCateringGrid selectedFood={selectedFood} updateFoodQuantity={updateFoodQuantity} />
        )}
      </div>
    </main>
  );
}
