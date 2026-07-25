'use client';

import React from 'react';
import { CineResonanceContainer } from '@/src/components/resonance/CineResonanceContainer';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function PreludePage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden text-right pb-32 pt-20 px-4 md:px-8" dir="rtl">
      {/* Background Specular Glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[180px] pointer-events-none" />

      {/* Page Header fully in Hebrew without developer Phase tags */}
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-sans mb-4">
          <Sparkles size={14} />
          <span>מנוע תהודה אקוסטית קולנועית</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white font-outfit tracking-tight mb-4" style={{ textShadow: '0 0 30px rgba(0, 240, 255, 0.4)' }}>
          כיול צליל קולנועי אישי <span className="text-cyan-400">חווייתי</span>
        </h1>
        <p className="text-sm md:text-base text-neutral-300 font-sans max-w-2xl mx-auto leading-relaxed">
          ממשק זכוכית נוזלית מתקדם לכיול אקוסטי, הדגשת תדרי קול וסנכרון תהודה בזמן אמת בצפיפות 120Hz.
        </p>
      </div>

      {/* Main Hebrew Resonance Container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <CineResonanceContainer />
      </div>

      <div className="mt-16 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-cyan-400" />
        <span>ממשק קולנועי מתקדם • תצוגת 120Hz ללא השהייה • כיול אקוסטי מותאם</span>
      </div>
    </div>
  );
}
