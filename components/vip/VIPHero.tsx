'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export function VIPHero() {
  return (
    <div className="relative pt-16 pb-20 px-6 text-center max-w-4xl mx-auto z-10" dir="rtl">
      <span className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.25em] bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full inline-block mb-4 font-sans">
        מועדון ה-VIP של LIQUID GLASS
      </span>
      <h1 className="font-display text-4xl md:text-7xl font-black text-white leading-none tracking-tighter font-outfit">
        החופש להזמין <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-cyan-400">ישירות מהקולנוע</span>
      </h1>
      <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium font-sans">
        הצטרפו לחוויית הקולנוע האינטראקטיבית הטובה ביותר בארץ. גלול למטה כדי לגלות את הטבות המועדון, להשוות מסלולי מנוי VIP ולחשב כמה נקודות תצברו ישירות אצלנו.
      </p>
      <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs animate-bounce font-sans">
        <span>גלול למטה כדי להתחיל בסיור</span>
        <ChevronDown size={14} />
      </div>
    </div>
  );
}
