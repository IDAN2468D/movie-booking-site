'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Sparkles, Volume2, ShieldCheck, Flame } from 'lucide-react';

// Steps data for Scrollytelling
const STEPS = [
  {
    id: 1,
    badge: 'דולבי אטמוס & מקרן לייזר 4K',
    title: 'סאונד ותמונה מהעתיד',
    desc: 'התנסה במקרני הלייזר הציאניים המתקדמים ביותר בעולם בשילוב סאונד Dolby Atmos היקפי ב-360 מעלות. כל לחישה, כל פיצוץ וכל תו מוזיקלי מורגשים פיזית בחלל ומעניקים מימד חדש לחלוטין לצפייה בסרט.',
    color: 'from-primary/20 to-cyan-500/20',
  },
  {
    id: 2,
    badge: 'מערכת שריון תלת-ממד',
    title: 'מושבי VIP בהתאמה אישית',
    desc: 'מפת המושבים הדינמית שלנו מאפשרת לך לבחור את המקום המושלם עבורך. מושבי ה-VIP שלנו כוללים משענות גב מתכווננות חשמלית, חימום מובנה, ומטען אלחוטי לטלפון שלכם, לצד מרווח רגליים מקסימלי.',
    color: 'from-amber-500/20 to-primary/20',
  },
  {
    id: 3,
    badge: 'שירות VIP אישי',
    title: 'כיבוד פרימיום ישירות למושב',
    desc: 'אין צורך לעמוד בתורים יותר. הזמינו פופקורן גורמה חם, נאצ\'וס פריך, קוקטיילים מעוצבים או משקאות קלים היישר מהאפליקציה. הכיבוד ימתין לכם במושב או יוגש לכם באופן אישי במהלך ההקרנה.',
    color: 'from-cyan-500/20 to-indigo-500/20',
  }
];

export default function CinemaExperienceScrolly() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position of the entire component to animate overall elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Example scroll-linked values
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);
  const rotateGlow = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full bg-black/60 border-t border-white/5 overflow-hidden"
    >
      {/* Background Atmosphere Glows */}
      <motion.div 
        style={{ opacity: bgOpacity, rotate: rotateGlow }}
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[150px] pointer-events-none"
      />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[180px] pointer-events-none" />

      {/* Main Title Section */}
      <div className="pt-20 pb-8 px-4 text-center relative z-20">
        <span className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block mb-3">
          החוויה הקולנועית החדשה
        </span>
        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter font-outfit max-w-3xl mx-auto leading-tight">
          למה לבחור ב-<span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-cyan-400">Liquid Glass</span>?
        </h2>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed-hebrew font-medium">
          גלול מטה כדי לראות כיצד שינינו את חוויית הזמנת הכרטיסים והצפייה בסרט מהקצה אל הקצה.
        </p>
      </div>

      <div className="relative flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 md:px-8">
        
        {/* LEFT SIDE: Sticky Interactive Visual Display (Pinned on Desktop) */}
        <div className="md:sticky md:top-0 md:h-screen w-full md:w-1/2 flex items-center justify-center py-6 md:py-0 order-1 md:order-1 z-30">
          <div className="relative w-full aspect-[4/3] md:h-[60vh] max-w-md rounded-[32px] liquid-glass p-1 border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Interactive screen gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/30 pointer-events-none z-10" />

            {/* Dynamic backdrop glows matched to current step */}
            <div className="absolute inset-0 transition-all duration-1000 ease-out pointer-events-none">
              <div className={`absolute inset-0 opacity-40 blur-3xl bg-gradient-to-br ${STEPS[activeStep].color}`} />
            </div>

            {/* SCENE 0: Dolby Sound & Projector */}
            {activeStep === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Simulated Projector Ray */}
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent origin-top transform rotate-12 blur-md" />
                
                {/* Audio Pulse Circles */}
                <div className="flex items-center justify-center relative w-full h-full">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.8, scale: 0.6 }}
                      animate={{ 
                        opacity: 0, 
                        scale: 2.2,
                        borderColor: i === 0 ? 'rgba(255, 20, 100, 0.4)' : 'rgba(10, 239, 255, 0.3)'
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3, 
                        delay: i * 1,
                        ease: "easeOut"
                      }}
                      className="absolute w-32 h-32 rounded-full border-2 border-primary/40 pointer-events-none"
                    />
                  ))}
                  
                  {/* central speaker icon floating */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-[24px] bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center z-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                  >
                    <Volume2 className="text-primary w-10 h-10 drop-shadow-[0_0_15px_rgba(255,20,100,0.5)]" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* SCENE 1: 3D VIP Seats Layout */}
            {activeStep === 1 && (
              <motion.div 
                initial={{ opacity: 0, rotateX: 30 }}
                animate={{ opacity: 1, rotateX: 15, rotateY: -10 }}
                transition={{ duration: 0.6 }}
                style={{ transformPerspective: 1000 }}
                className="relative w-full h-full flex flex-col items-center justify-center p-8"
              >
                {/* Simulated cinema screen at top */}
                <div className="w-4/5 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full blur-[1px] shadow-[0_4px_20px_rgba(10,239,255,0.8)] mb-12 relative">
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-cyan-400 tracking-[0.2em]">SCREEN</span>
                </div>

                {/* Seat Grid */}
                <div className="grid grid-cols-5 gap-3 max-w-[280px] w-full">
                  {[...Array(15)].map((_, i) => {
                    const isVIP = i === 7; // Highlight middle seat as VIP
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className={`aspect-square rounded-lg border flex items-center justify-center relative ${
                          isVIP 
                            ? 'bg-primary border-primary shadow-[0_0_20px_rgba(255,20,100,0.6)] cursor-pointer text-black font-black' 
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white/40'
                        }`}
                      >
                        {isVIP ? (
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Sparkles size={14} className="text-white" />
                          </motion.div>
                        ) : (
                          <span className="text-[8px] font-mono">{i+1}</span>
                        )}
                        
                        {isVIP && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[8px] px-2 py-0.5 rounded-md whitespace-nowrap shadow-xl">
                            מושב VIP שלכם
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* SCENE 2: Pre-order Snack Bar (Popcorn & Soda) */}
            {activeStep === 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-full flex flex-col items-center justify-center"
              >
                {/* Floating glass tray */}
                <motion.div 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="w-72 h-48 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl p-6 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/5 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 shimmer" />

                  {/* Popcorn bucket (SVG) */}
                  <div className="flex flex-col items-center gap-2 z-10">
                    <svg className="w-16 h-20 filter drop-shadow-[0_4px_10px_rgba(255,20,100,0.3)]" viewBox="0 0 60 80" fill="none">
                      {/* Bucket base */}
                      <path d="M10 20 L15 75 C15.5 78 18 80 21 80 L39 80 C42 80 44.5 78 45 75 L50 20 Z" fill="url(#popcornGrad)" />
                      {/* Stripes */}
                      <path d="M22 20 L24 80 M30 20 L30 80 M38 20 L36 80" stroke="white" strokeWidth="2.5" strokeOpacity="0.2" />
                      {/* Popcorn top pieces */}
                      <circle cx="20" cy="15" r="7" fill="#FF1464" />
                      <circle cx="30" cy="12" r="8" fill="#FAFAF7" />
                      <circle cx="40" cy="16" r="7" fill="#E5FF00" />
                      <circle cx="25" cy="18" r="6" fill="#FAFAF7" />
                      <circle cx="35" cy="18" r="6" fill="#FF1464" />
                      
                      <defs>
                        <linearGradient id="popcornGrad" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FF1464" />
                          <stop offset="1" stopColor="#3A0014" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-[10px] font-bold text-white/60">גורמה פופקורן</span>
                  </div>

                  {/* Cup Soda (SVG) */}
                  <div className="flex flex-col items-center gap-2 z-10">
                    <svg className="w-12 h-20 filter drop-shadow-[0_4px_10px_rgba(10,239,255,0.3)]" viewBox="0 0 50 80" fill="none">
                      {/* Straw */}
                      <path d="M28 5 L28 15 L38 5" stroke="#0AEFFF" strokeWidth="3" strokeLinecap="round" />
                      {/* Lid */}
                      <rect x="8" y="15" width="34" height="4" rx="2" fill="#FAFAF7" />
                      {/* Cup */}
                      <path d="M10 20 L14 72 C14.5 76 17 78 20 78 L30 78 C33 78 35.5 76 36 72 L40 20 Z" fill="url(#sodaGrad)" />
                      
                      <defs>
                        <linearGradient id="sodaGrad" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#0AEFFF" />
                          <stop offset="1" stopColor="#002E3A" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-[10px] font-bold text-white/60">קוקטייל VIP</span>
                  </div>
                </motion.div>
                
                {/* Real-time Badge */}
                <div className="mt-6 flex items-center gap-2 text-cyan-400 text-xs font-bold bg-cyan-950/30 border border-cyan-800/40 px-4 py-1.5 rounded-full backdrop-blur-md">
                  <ShieldCheck size={14} />
                  <span>שירות משלוח אקטיבי למושב שלכם</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Scrollable Text Steps (Triggers state change) */}
        <div className="w-full md:w-1/2 px-4 md:px-12 py-12 md:py-32 flex flex-col gap-[35vh] md:gap-[50vh] order-2 md:order-2">
          {STEPS.map((step, idx) => (
            <ScrollStepTrigger 
              key={step.id} 
              index={idx} 
              onVisible={setActiveStep}
            >
              <div className="relative text-right group">
                {/* Active side highlighter bar */}
                <div className="absolute top-0 -right-6 bottom-0 w-[3px] bg-slate-800 rounded-full transition-colors duration-500 overflow-hidden">
                  <motion.div 
                    animate={{ height: activeStep === idx ? '100%' : '0%' }}
                    className="w-full bg-primary"
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="flex items-center gap-2 justify-end mb-3">
                  <span className="text-[10px] md:text-xs text-primary font-black uppercase tracking-wider bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    {step.badge}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                </div>
                
                <h3 className="font-display text-2xl md:text-4xl font-black text-off-white mb-4 transition-colors duration-300 group-hover:text-primary">
                  {step.title}
                </h3>
                
                <p className="text-slate-400 text-sm md:text-base leading-relaxed-hebrew font-medium max-w-lg ml-auto">
                  {step.desc}
                </p>

                {/* Mobile visualization block (only shows when step is active, on small screens) */}
                <div className="md:hidden mt-6 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-4 text-xs text-slate-500">
                  {idx === 0 && (
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} className="text-primary" />
                      <span>שילוב Dolby Atmos & מקרן לייזר 4K מופעל</span>
                    </div>
                  )}
                  {idx === 1 && (
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" />
                      <span>שריון המושב מבוצע בהדמיית 3D מלאה</span>
                    </div>
                  )}
                  {idx === 2 && (
                    <div className="flex items-center gap-2">
                      <Flame size={16} className="text-primary" />
                      <span>חטיפי הגורמה מוגשים חמים לכיסא שלך</span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollStepTrigger>
          ))}
          {/* Scroll padding block at the very bottom */}
          <div className="h-[10vh] md:h-[15vh]" />
        </div>

      </div>
    </div>
  );
}

// Helper Sub-component to trigger step activation as the content scrolls into viewport
interface ScrollStepTriggerProps {
  children: React.ReactNode;
  index: number;
  onVisible: (index: number) => void;
}

function ScrollStepTrigger({ children, index, onVisible }: ScrollStepTriggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Trigger when block is in the middle of viewport
  const isInView = useInView(ref, { 
    margin: '-45% 0px -45% 0px',
  });

  useEffect(() => {
    if (isInView) {
      onVisible(index);
    }
  }, [isInView, index, onVisible]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 transform translate-x-0' : 'opacity-20 transform translate-x-2'
      }`}
    >
      {children}
    </div>
  );
}
