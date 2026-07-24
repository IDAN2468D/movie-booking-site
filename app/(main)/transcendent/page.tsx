'use client';

import React from 'react';
import { MoodRefractorContainer } from '@/src/components/discovery/MoodRefractorContainer';
import { TemporalBookingContainer } from '@/src/components/booking/TemporalBookingContainer';
import { AuraSeatMapContainer } from '@/src/components/booking/AuraSeatMapContainer';
import { IntuitionSearchContainer } from '@/src/components/discovery/IntuitionSearchContainer';
import { EtherVoidContainer } from '@/src/components/intermission/EtherVoidContainer';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

export default function TranscendentPage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden text-right pb-32 pt-20 px-4 md:px-8" dir="rtl">
      {/* Glow Effects */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[180px] pointer-events-none" />

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
          <Sparkles size={14} />
          <span>חבילת הקולנוע הטרנסצנדנטלית - חוויה על-חושית</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white font-outfit tracking-tight mb-4" style={{ textShadow: '0 0 30px rgba(0, 240, 255, 0.4)' }}>
          חוויית הקולנוע <span className="text-cyan-400">הטרנסצנדנטלית</span>
        </h1>
        <p className="text-sm md:text-base text-neutral-300 font-sans max-w-2xl mx-auto leading-relaxed">
          ממשק זכוכית נוזלית 4.0 המשלב ניתוח ביומטרי רגשי, זרימת זמן תלת-ממדית, הילת תדרים אנושית, חיפוש סמנטי-מטאפורי ולובי המתנה מרחבי בתדר 120Hz ללא Reflow.
        </p>
      </div>

      {/* Navigation Quick Bar */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3 p-3 rounded-2xl bg-neutral-950/60 backdrop-blur-[30px] border border-white/10 shadow-2xl">
          <a href="#mood" className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-outfit border border-white/10 transition-all">
            <Layers size={14} className="text-cyan-400" />
            מנוע מיפוי סינסתזי
          </a>
          <a href="#temporal" className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-outfit border border-white/10 transition-all">
            <Layers size={14} className="text-amber-400" />
            סרגל זמן טיפוגרפי-נוזלי
          </a>
          <a href="#aura" className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-outfit border border-white/10 transition-all">
            <Layers size={14} className="text-emerald-400" />
            מפת הילה ביומטרית
          </a>
          <a href="#intuition" className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-outfit border border-white/10 transition-all">
            <Layers size={14} className="text-purple-400" />
            חיפוש אינטואיטיבי סמנטי
          </a>
          <a href="#void" className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-outfit border border-white/10 transition-all">
            <Layers size={14} className="text-cyan-300" />
            לובי המתנה קולקטיבי
          </a>
        </div>
      </div>

      {/* Sprints Modules Stack */}
      <div className="flex flex-col gap-16 relative z-10 max-w-5xl mx-auto">
        <section id="mood" className="scroll-mt-24">
          <MoodRefractorContainer />
        </section>

        <section id="temporal" className="scroll-mt-24">
          <TemporalBookingContainer />
        </section>

        <section id="aura" className="scroll-mt-24">
          <AuraSeatMapContainer />
        </section>

        <section id="intuition" className="scroll-mt-24">
          <IntuitionSearchContainer />
        </section>

        <section id="void" className="scroll-mt-24">
          <EtherVoidContainer />
        </section>
      </div>

      <div className="mt-16 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-cyan-400" />
        <span>תקן SDD v9.0 • תצוגת GPU 120Hz ללא Reflow • גבולות מאומתים ב-Zod</span>
      </div>
    </div>
  );
}
