'use client';

import React from 'react';
import Link from 'next/link';
import { VIPHero } from '@/components/vip/VIPHero';
import { ScrollytellingTour } from '@/components/vip/ScrollytellingTour';
import { SubscriptionMatrix } from '@/components/vip/SubscriptionMatrix';
import { DirectSavingsCalculator } from '@/components/vip/DirectSavingsCalculator';
import { QuantumStakingContainer } from '@/components/vip/QuantumStakingContainer';
import { BoxOfficePredictionContainer } from '@/src/components/vip/BoxOfficePredictionContainer';
import { VipAnalyticsDashboard } from '@/components/vip/VipAnalyticsDashboard';
import { Award, Zap, TrendingUp, ShieldCheck, Gift } from 'lucide-react';

export default function VipPage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden text-right pb-32" dir="rtl">
      {/* Dynamic Background Glows */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* --- HERO HEADER --- */}
      <VIPHero />

      {/* --- QUICK NAVIGATION BAR --- */}
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3 p-3 rounded-2xl bg-neutral-950/60 backdrop-blur-[30px] border border-white/10 shadow-2xl">
          <a href="#subscriptions" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-['Outfit'] border border-white/10 transition-all">
            <Zap size={14} className="text-primary" />
            מנויי VIP
          </a>
          <a href="#staking-analytics" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-['Outfit'] border border-white/10 transition-all">
            <ShieldCheck size={14} className="text-[#00FFA3]" />
            כספת NFT & אנליטיקה
          </a>
          <a href="#prediction-market" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold font-['Outfit'] border border-white/10 transition-all">
            <TrendingUp size={14} className="text-emerald-400" />
            שוק תחזיות קופות
          </a>
          <Link href="/vip/bonuses" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold font-['Outfit'] border border-primary/30 transition-all shadow-[0_0_15px_rgba(255,20,100,0.3)]">
            <Gift size={14} />
            מימוש הטבות & מתנות
          </Link>
        </div>
      </div>

      {/* --- SECTION 1: LOYALTY TOUR (STICKY SCROLLYTELLING) --- */}
      <ScrollytellingTour />

      {/* --- SECTION 2: CINEMATIC SUBSCRIPTION TIERS --- */}
      <div id="subscriptions">
        <SubscriptionMatrix />
      </div>

      {/* --- SECTION 3: QUANTUM STAKING & VIP ANALYTICS GRID --- */}
      <div id="staking-analytics" className="max-w-7xl mx-auto my-16 px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] text-[#00FFA3] font-bold uppercase tracking-widest bg-[#00FFA3]/10 border border-[#00FFA3]/20 px-3 py-1 rounded-full inline-block font-sans">
            מרכז ניהול VIP קוונטי
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-3 font-outfit">
            כספת <span className="text-[#00FFA3]">NFT הולוגרפית</span> & דשבורד אנליטיקה
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center">
          <div className="w-full">
            <QuantumStakingContainer />
          </div>
          <div className="w-full flex justify-center">
            <VipAnalyticsDashboard userId="user_demo_vip" />
          </div>
        </div>
      </div>

      {/* --- SECTION 4: BOX OFFICE PREDICTION MARKET --- */}
      <div id="prediction-market" className="max-w-5xl mx-auto my-16 px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full inline-block font-sans">
            שוק תחזיות קוונטי
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2 font-outfit">
            המר על <span className="text-emerald-400">להיטי הקופות הבאים</span>
          </h2>
        </div>
        <BoxOfficePredictionContainer />
      </div>

      {/* --- SECTION 5: DTC VALUE CALCULATOR --- */}
      <DirectSavingsCalculator />
    </div>
  );
}
