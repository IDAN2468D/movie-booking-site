'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LOYALTY_STEPS } from '@/constants/vip-data';
import { ScrollStepTrigger } from './ScrollStepTrigger';
import { HolographicVIPPass } from './HolographicVIPPass';

export function ScrollytellingTour() {
  const [activeStep, setActiveStep] = useState(0);

  // Dynamic values for holographic pass based on current step
  const getPassData = () => {
    switch (activeStep) {
      case 0:
        return {
          tierName: 'CLASSIC VIP',
          points: 450,
          glowColor: 'rgba(10,239,255,0.4)',
          badge: 'נשנושים למושב',
        };
      case 1:
        return {
          tierName: 'IMAX PRO',
          points: 850,
          glowColor: 'rgba(255,20,100,0.5)',
          badge: 'כרטיס 1+1 IMAX',
        };
      default:
        return {
          tierName: 'NEURAL ELITE',
          points: 1450,
          glowColor: 'rgba(0,240,255,0.5)',
          badge: 'גישה לטרקלין הזהב',
        };
    }
  };

  const passData = getPassData();

  return (
    <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-white/5" dir="rtl">
      <h2 className="text-2xl md:text-4xl font-black text-white text-center mb-16 tracking-tight font-outfit">
        1. סיור מועדון הלקוחות <span className="text-primary font-outfit">VIP</span>
      </h2>

      <div className="flex flex-col md:flex-row w-full gap-8">
        {/* Pinned Holographic Pass (Left side) */}
        <div className="md:sticky md:top-24 md:h-[70vh] w-full md:w-1/2 flex items-center justify-center order-1 md:order-1 z-20">
          <HolographicVIPPass 
            tierName={passData.tierName}
            points={passData.points}
            glowColor={passData.glowColor}
            badge={passData.badge}
            activeStep={activeStep}
          />
        </div>

        {/* Scrollable triggers (Right side) */}
        <div className="w-full md:w-1/2 flex flex-col gap-[35vh] py-16 order-2 md:order-2">
          {LOYALTY_STEPS.map((step, idx) => (
            <ScrollStepTrigger key={step.id} index={idx} onVisible={setActiveStep}>
              <div className="relative text-right group">
                <div className="absolute top-0 -right-6 bottom-0 w-[3px] bg-slate-800 rounded-full transition-colors overflow-hidden">
                  <motion.div 
                    animate={{ height: activeStep === idx ? '100%' : '0%' }}
                    className="w-full bg-primary"
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <span className={`text-xs font-bold mb-2 inline-block px-3 py-1 rounded-full border font-sans ${
                  activeStep === idx 
                    ? 'text-primary bg-primary/10 border-primary/20' 
                    : 'text-slate-500 bg-white/5 border-white/5'
                }`}>
                  {step.badge}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-black text-white mt-3 mb-4 group-hover:text-primary transition-colors font-outfit">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium max-w-lg ml-auto font-sans">
                  {step.desc}
                </p>
              </div>
            </ScrollStepTrigger>
          ))}
          <div className="h-[5vh]" />
        </div>
      </div>
    </div>
  );
}
