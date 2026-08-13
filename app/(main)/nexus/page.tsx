'use client';

import React from 'react';
import { NeuralSyncNexusContainer } from '@/src/components/nexus/NeuralSyncNexusContainer';
import { CineSyncSphere } from '@/components/social/CineSyncSphere';
import { Users, ShieldCheck } from 'lucide-react';

export default function NexusPage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden text-right pb-32 pt-20 px-4 md:px-8" dir="rtl">
      <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-sans mb-4">
          <Users size={14} />
          <span>מרכז הסנכרון הקבוצתי</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white font-outfit tracking-tight mb-4" style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}>
          סנכרון תדרים <span className="text-purple-400">קבוצתי</span>
        </h1>
        <p className="text-sm md:text-base text-neutral-300 font-sans max-w-2xl mx-auto leading-relaxed">
          מרחב זכוכית נוזלית 4.0 למיזוג ספירות הילה אקוסטיות בזמן אמת עם סאונד מרחבי תלת-ממדי בתדר 120Hz.
        </p>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        <CineSyncSphere />
        <NeuralSyncNexusContainer />
      </div>

      <div className="mt-16 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-purple-400" />
        <span>ממשק קבוצתי מתקדם • תצוגת 120Hz ללא השהייה • סאונד מרחבי תלת-ממדי</span>
      </div>
    </div>
  );
}
