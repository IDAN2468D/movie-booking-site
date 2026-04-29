'use client';

import React from 'react';
import { MarkerHighlight } from '@/components/fx/MarkerHighlight';
import { EffectIDChip } from '@/components/effects/EffectIDChip';
import { motion } from 'framer-motion';

export default function TestMarkersPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAF7] p-20 flex flex-col items-center justify-center gap-16">
      <div className="max-w-2xl text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-6xl font-black font-outfit uppercase tracking-tighter">
            Design <MarkerHighlight delay={0.8}>System</MarkerHighlight>
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            תצוגה מקדימה של רכיבי העיצוב החדשים מתוך <span className="text-[#FF1464] font-black italic">yuv-design</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Card 1: Marker Demo */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-black uppercase tracking-widest text-primary">Markers</h3>
              <EffectIDChip id="marker.highlight" />
            </div>
            <div className="space-y-4">
              <p className="text-2xl font-bold leading-relaxed">
                We make things <MarkerHighlight delay={1.2}>pop</MarkerHighlight> with cinematic highlights.
              </p>
              <p className="text-2xl font-bold leading-relaxed" dir="rtl">
                אנחנו גורמים לדברים <MarkerHighlight delay={1.8} color="#FF1464">לבלוט</MarkerHighlight> עם הדגשות קולנועיות.
              </p>
            </div>
          </div>

          {/* Card 2: Technical Info */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl space-y-6">
            <h3 className="text-xl font-black uppercase tracking-widest text-primary">Implementation</h3>
            <ul className="space-y-3 text-slate-400 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5FF00]" />
                SVG Path Animation (Framer Motion)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5FF00]" />
                Standardized Effect ID Chips
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5FF00]" />
                Bilingual (LTR/RTL) Support
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5FF00]" />
                Liquid Glass Integration
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
