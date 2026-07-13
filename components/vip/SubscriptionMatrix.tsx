'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame } from 'lucide-react';
import Link from 'next/link';
import { SUBSCRIPTION_TIERS } from '@/constants/vip-data';
import { ScrollReveal } from './ScrollReveal';
import { useAcousticFeedback } from '@/hooks/useAcousticFeedback';

export function SubscriptionMatrix() {
  const { playBassDrop } = useAcousticFeedback();

  return (
    <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-white/5" dir="rtl">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full inline-block font-sans">
          מנוי VIP חודשי
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mt-3 mb-4 tracking-tight font-outfit">
          2. השוואת חבילות מנויי <span className="text-primary font-outfit">VIP</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans">
          בחר את המסלול המתאים לך ביותר. כל מנוי כולל כרטיסים מוזלים, צבירת נקודות מוגברת וכיבוד מפנק.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {SUBSCRIPTION_TIERS.map((tier, idx) => (
          <ScrollReveal key={tier.id} delay={idx * 0.15}>
            <div 
              className={`relative h-full flex flex-col justify-between rounded-[32px] p-8 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.15)] hover:scale-[1.02] transition-all duration-500 overflow-hidden group ${
                tier.popular ? 'border-primary shadow-[0_25px_50px_-12px_rgba(255,20,100,0.4),_0_0_40px_rgba(255,20,100,0.2),_inset_0_0_0_1px_rgba(255,255,255,0.2)]' : ''
              }`}
            >
              {/* Glow Backdrop */}
              <div 
                style={{ background: `radial-gradient(circle, ${tier.glowColor} 0%, transparent 70%)` }}
                className="absolute top-0 right-0 w-64 h-64 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all group-hover:scale-110"
              />

              {tier.popular && (
                <div className="absolute top-4 left-4 bg-primary text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,20,100,0.5)] flex items-center gap-1 font-sans">
                  <Flame size={10} />
                  <span>פופולרי</span>
                </div>
              )}

              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 font-sans">
                  {tier.badge}
                </span>
                <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight font-outfit">{tier.name}</h3>
                
                <div className="flex items-baseline gap-2 mt-4 mb-8 justify-end flex-row font-sans">
                  <span className="text-4xl md:text-5xl font-black text-white font-mono">{tier.price}</span>
                  <span className="text-slate-500 text-xs font-bold">/ {tier.period}</span>
                </div>

                <ul className="space-y-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 justify-end">
                      <span className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed font-sans">{feature}</span>
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} className="text-cyan-400" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Link 
                  href="/vip/liquid-capital"
                  onClick={() => playBassDrop()}
                  className={`block text-center w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all duration-300 cursor-pointer font-sans ${
                    tier.popular
                      ? 'bg-primary text-background hover:bg-white hover:text-black shadow-[0_15px_30px_rgba(255,20,100,0.35)]'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black hover:border-white'
                  }`}
                >
                  הירשם עכשיו
                </Link>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
