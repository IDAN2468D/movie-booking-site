'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, BadgePercent, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useAcousticFeedback } from '@/hooks/useAcousticFeedback';

export function DirectSavingsCalculator() {
  const [moviesCount, setMoviesCount] = useState(4);
  const { playTick, playBassDrop } = useAcousticFeedback();

  // Calculations for DTC Calculator
  const directBookingFeeSaved = moviesCount * 15; // 15 NIS saved per ticket
  const pointsEarned = moviesCount * 120; // 120 points per movie
  const unlockedTiers = pointsEarned >= 1000 ? 'כרטיס שני חינם' : pointsEarned >= 500 ? 'פופקורן גדול חינם' : 'שתייה קרה חינם';

  // Sound feedback on changes
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMoviesCount(value);
    
    // Play a tick for every slider increment
    playTick();
  };

  // Play bass drop when reaching maximum (10) or crossing milestone threshold (5)
  useEffect(() => {
    if (moviesCount === 10 || moviesCount === 5) {
      playBassDrop();
    }
  }, [moviesCount, playBassDrop]);

  return (
    <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-24 border-t border-white/5" dir="rtl">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full inline-block font-sans">
          מחשבון חיסכון ישיר
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mt-3 mb-4 tracking-tight font-outfit">
          3. מחשבון החיסכון והטבות <span className="text-primary font-outfit">DTC</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans">
          כשאתה מזמין ישירות (Direct-to-Consumer) באתר שלנו, אתה חוסך עמלות כרטוס וצובר נקודות VIP. הזז את הסליידר כדי לחשב כמה תרוויח בחודש!
        </p>
      </div>

      <ScrollReveal>
        <div className="rounded-[40px] p-8 md:p-12 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 bg-neutral-950/40 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_0_0_40px_rgba(0,0,0,0.5),_inset_0_0_0_1px_rgba(255,255,255,0.15)] relative overflow-hidden">
          {/* Shimmer element */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Left Side: Calculations display */}
            <div className="space-y-8 order-2 lg:order-1">
              
              {/* Points bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs md:text-sm font-bold flex-row font-sans">
                  <span className="text-amber-400 flex items-center gap-1">
                    <Coins size={14} />
                    {pointsEarned} PTS
                  </span>
                  <span className="text-slate-300">נקודות שתצברו בחודש</span>
                </div>
                <div className="h-3 w-full bg-slate-800/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((pointsEarned / 1200) * 100, 100)}%` }}
                    className="h-full bg-gradient-to-l from-amber-400 to-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  />
                </div>
              </div>

              {/* Savings bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs md:text-sm font-bold flex-row font-sans">
                  <span className="text-primary flex items-center gap-1">
                    <BadgePercent size={14} />
                    ₪{directBookingFeeSaved}
                  </span>
                  <span className="text-slate-300">חיסכון בעמלות כרטוס</span>
                </div>
                <div className="h-3 w-full bg-slate-800/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(moviesCount / 10) * 100}%` }}
                    className="h-full bg-gradient-to-l from-primary to-rose-600 rounded-full shadow-[0_0_10px_rgba(255,20,100,0.5)]"
                  />
                </div>
              </div>

              {/* Status card inside calculator */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center justify-between flex-row font-sans">
                <span className="text-xs font-black text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full">
                  {unlockedTiers}
                </span>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">הטבת חינם שתקבלו</p>
                  <p className="text-xs md:text-sm text-white font-bold">הטבת מדרגת מועדון פתוחה</p>
                </div>
              </div>
            </div>

            {/* Right Side: Slider controls */}
            <div className="space-y-8 order-1 lg:order-2 text-right">
              <div>
                <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] font-sans">בקרת סליידר</span>
                <h3 className="text-xl md:text-2xl font-black text-white mt-1 font-outfit">כמה סרטים אתה רואה בחודש?</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center flex-row font-sans">
                  <span className="text-3xl font-black text-white font-mono">{moviesCount}</span>
                  <span className="text-slate-400 text-xs">בחירת כמות כרטיסים בחודש</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={moviesCount} 
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary border border-white/5 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold flex-row font-sans">
                  <span>10 כרטיסים</span>
                  <span>5 כרטיסים</span>
                  <span>1 כרטיס</span>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 justify-end items-start text-right font-sans">
                <p className="text-xs text-slate-300 font-medium leading-relaxed flex-1">
                  הזמנה ישירה באתר Liquid Glass מקנה לך את העמלות הנמוכות ביותר, צבירת נקודות מועדון 120pts לכרטיס וניהול הזמנות חכם.
                </p>
                <Sparkles className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
