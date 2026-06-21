'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Crown, Sparkles, Popcorn, Ticket, BadgePercent, ChevronDown, Check, Coins, Flame } from 'lucide-react';

// 1. Loyalty Tour steps
const LOYALTY_STEPS = [
  {
    id: 0,
    badge: 'הטבה 1: נשנושים ישירות לכיסא',
    title: 'קומבו גורמה בחינם',
    desc: 'הזמן ישירות באפליקציה וקבל פופקורן גורמה חם ושתייה לבחירתך ללא תור. המלצרים שלנו יגישו לכם את הכיבוד החם ישירות למושב עם הגעתכם לאולם.',
  },
  {
    id: 1,
    badge: 'הטבה 2: הקרנות בכורה',
    title: 'כרטיס IMAX שני בחינם',
    desc: 'בכל הזמנת כרטיס לסרטי IMAX, תקבלו כרטיס שני במתנה לחבר או משפחה. אל תפספסו אף סרט ענק על המסכים הגדולים והמתקדמים ביותר.',
  },
  {
    id: 2,
    badge: 'הטבה 3: שדרוג VIP קבוע',
    title: 'גישה בלעדית לטרקליני VIP',
    desc: 'כחברי מועדון, אתם נהנים מאירוח VIP מלא: כניסה ללא תור לטרקליני הזהב, מושבי מסאז\' מתכווננים, בופה חופשי עשיר, וברים איכותיים לפני תחילת ההקרנה.',
  }
];

// 2. Subscriptions Tiers
const SUBSCRIPTION_TIERS = [
  {
    id: 'classic',
    name: 'CLASSIC VIP',
    price: '₪49',
    period: 'חודשי',
    features: ['2 כרטיסי קולנוע בחודש', 'שדרוג פופקורן גדול בכל ביקור', 'צבירת 1.5x נקודות נאמנות', 'הנחה של 10% על כיבוד נוסף'],
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    glowColor: 'rgba(10,239,255,0.4)',
    badge: 'לחובבי קולנוע'
  },
  {
    id: 'imax',
    name: 'IMAX PRO',
    price: '₪79',
    period: 'חודשי',
    features: ['3 כרטיסי IMAX או תלת-ממד בחודש', 'קומבו פרימיום (פופקורן + קולדה) חינם', 'צבירת 2x נקודות נאמנות', 'שירות משלוח VIP למושב ללא עלות'],
    color: 'from-primary/20 to-purple-500/20',
    borderColor: 'border-primary/50',
    glowColor: 'rgba(255,20,100,0.5)',
    badge: 'בחירת הקהל',
    popular: true
  },
  {
    id: 'gold',
    name: 'LIQUID GOLD',
    price: '₪149',
    period: 'חודשי',
    features: ['כרטיסים חופשיים ללא הגבלה', 'כניסה חופשית לטרקלין ה-VIP והבופה', 'צבירת 3x נקודות נאמנות', 'הזמנת מושבים מוקדמת מראש (שבוע לפני כולם)'],
    color: 'from-amber-500/20 to-primary/20',
    borderColor: 'border-amber-500/40',
    glowColor: 'rgba(245,158,11,0.5)',
    badge: 'יוקרתי בלתי מוגבל'
  }
];

export default function VipPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [moviesCount, setMoviesCount] = useState(4); // Slider value
  const containerRef = useRef<HTMLDivElement>(null);



  // Calculations for DTC Calculator
  const directBookingFeeSaved = moviesCount * 15; // 15 NIS saved per ticket
  const pointsEarned = moviesCount * 120; // 120 points per movie
  const unlockedTiers = pointsEarned >= 1000 ? 'כרטיס שני חינם' : pointsEarned >= 500 ? 'פופקורן גדול חינם' : 'שתייה קרה חינם';

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0A0A0A] overflow-hidden text-right pb-32">
      {/* Dynamic Background Glows */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* --- HERO HEADER --- */}
      <div className="relative pt-16 pb-20 px-6 text-center max-w-4xl mx-auto z-10">
        <span className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.25em] bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full inline-block mb-4">
          מועדון ה-VIP של LIQUID GLASS
        </span>
        <h1 className="font-display text-4xl md:text-7xl font-black text-white leading-none tracking-tighter">
          החופש להזמין <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-cyan-400">ישירות מהקולנוע</span>
        </h1>
        <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed-hebrew font-medium">
          הצטרפו לחוויית הקולנוע האינטראקטיבית הטובה ביותר בארץ. גלול למטה כדי לגלות את הטבות המועדון, להשוות מסלולי מנוי VIP ולחשב כמה נקודות תצברו ישירות אצלנו.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs animate-bounce">
          <span>גלול למטה כדי להתחיל בסיור</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* --- SECTION 1: LOYALTY TOUR (STICKY SCROLLYTELLING) --- */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-white/5">
        <h2 className="text-2xl md:text-4xl font-black text-white text-center mb-16 tracking-tight">
          1. סיור מועדון הלקוחות <span className="text-primary font-outfit">VIP</span>
        </h2>

        <div className="flex flex-col md:flex-row w-full gap-8">
          {/* Pinned Visual Display (Left side) */}
          <div className="md:sticky md:top-24 md:h-[70vh] w-full md:w-1/2 flex items-center justify-center order-1 md:order-1 z-20">
            <div className="relative w-full aspect-[4/3] max-w-md rounded-[32px] liquid-glass p-8 border border-white/10 overflow-hidden flex flex-col justify-between shadow-2xl">
              
              {/* Dynamic light streak over card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-black/35 pointer-events-none z-10" />
              
              {/* Animated Holographic Card Glow */}
              <motion.div 
                animate={{ 
                  background: activeStep === 0 
                    ? 'radial-gradient(circle at 10% 10%, rgba(255,20,100,0.15) 0%, transparent 60%)'
                    : activeStep === 1 
                    ? 'radial-gradient(circle at 10% 10%, rgba(10,239,255,0.15) 0%, transparent 60%)'
                    : 'radial-gradient(circle at 10% 10%, rgba(245,158,11,0.2) 0%, transparent 60%)'
                }}
                className="absolute inset-0 transition-colors duration-700 pointer-events-none"
              />

              {/* Top Card Info */}
              <div className="flex justify-between items-start z-10 flex-row">
                <Crown className={`w-8 h-8 transition-colors duration-500 ${
                  activeStep === 0 ? 'text-primary' : activeStep === 1 ? 'text-cyan-400' : 'text-amber-400'
                }`} />
                <div className="text-right">
                  <p className="text-[10px] font-black text-white/40 tracking-[0.2em]">LIQUID MEMBER</p>
                  <p className="text-sm font-bold text-white">אורח VIP</p>
                </div>
              </div>

              {/* Center Card Visuals (Framer Motion reactions based on activeStep) */}
              <div className="flex-1 flex items-center justify-center relative my-6">
                
                {/* Visual Step 0: Popcorn Combo */}
                {activeStep === 0 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,20,100,0.3)]">
                      <Popcorn className="text-primary w-10 h-10 animate-bounce" />
                    </div>
                    <span className="text-xs font-bold text-white text-glow">נפתחה הטבת קומבס</span>
                  </motion.div>
                )}

                {/* Visual Step 1: IMAX Ticket */}
                {activeStep === 1 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-20 h-20 rounded-full bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(10,239,255,0.3)]">
                      <Ticket className="text-cyan-400 w-10 h-10" />
                    </div>
                    <span className="text-xs font-bold text-white text-glow">כרטיס 1+1 חינם</span>
                  </motion.div>
                )}

                {/* Visual Step 2: Gold Lounge Upgrade */}
                {activeStep === 2 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] relative">
                      <Crown className="text-amber-400 w-10 h-10" />
                      <div className="absolute inset-0 rounded-full shimmer" />
                    </div>
                    <span className="text-xs font-bold text-white text-glow">חברות זהב מופעלת</span>
                  </motion.div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="flex justify-between items-end z-10 flex-row">
                <div className="text-right">
                  <p className="text-[8px] text-white/30">נקודות שנצברו</p>
                  <p className="text-xs font-mono font-bold text-white">1,450 PTS</p>
                </div>
                <div className="text-left">
                  <p className="text-[8px] text-white/30">סטטוס מועדון</p>
                  <p className={`text-xs font-black uppercase tracking-wider ${
                    activeStep === 0 ? 'text-primary' : activeStep === 1 ? 'text-cyan-400' : 'text-amber-400'
                  }`}>
                    {activeStep === 0 ? 'Classic' : activeStep === 1 ? 'IMAX Pro' : 'Platinum'}
                  </p>
                </div>
              </div>
            </div>
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

                  <span className={`text-xs font-bold mb-2 inline-block px-3 py-1 rounded-full border ${
                    activeStep === idx 
                      ? 'text-primary bg-primary/10 border-primary/20' 
                      : 'text-slate-500 bg-white/5 border-white/5'
                  }`}>
                    {step.badge}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-black text-white mt-3 mb-4 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed-hebrew font-medium max-w-lg ml-auto">
                    {step.desc}
                  </p>
                </div>
              </ScrollStepTrigger>
            ))}
            <div className="h-[5vh]" />
          </div>
        </div>
      </div>

      {/* --- SECTION 2: CINEMATIC SUBSCRIPTION TIERS --- */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full inline-block">
            מנוי VIP חודשי
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-3 mb-4 tracking-tight">
            2. השוואת חבילות מנויי <span className="text-primary font-outfit">VIP</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            בחר את המסלול המתאים לך ביותר. כל מנוי כולל כרטיסים מוזלים, צבירת נקודות מוגברת וכיבוד מפנק.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {SUBSCRIPTION_TIERS.map((tier, idx) => (
            <ScrollReveal key={tier.id} delay={idx * 0.15}>
              <div 
                className={`relative h-full flex flex-col justify-between rounded-[32px] bg-white/5 border p-8 backdrop-blur-[40px] hover:scale-[1.02] transition-all duration-500 overflow-hidden group ${
                  tier.popular ? 'border-primary shadow-[0_15px_45px_rgba(255,20,100,0.15)]' : 'border-white/10'
                }`}
              >
                {/* Glow Backdrop */}
                <div 
                  style={{ background: `radial-gradient(circle, ${tier.glowColor} 0%, transparent 70%)` }}
                  className="absolute top-0 right-0 w-64 h-64 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all group-hover:scale-110"
                />

                {tier.popular && (
                  <div className="absolute top-4 left-4 bg-primary text-black font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,20,100,0.5)] flex items-center gap-1">
                    <Flame size={10} />
                    <span>פופולרי</span>
                  </div>
                )}

                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    {tier.badge}
                  </span>
                  <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">{tier.name}</h3>
                  
                  <div className="flex items-baseline gap-2 mt-4 mb-8 justify-end flex-row">
                    <span className="text-4xl md:text-5xl font-black text-white">{tier.price}</span>
                    <span className="text-slate-500 text-xs font-bold">/ {tier.period}</span>
                  </div>

                  <ul className="space-y-4">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 justify-end">
                        <span className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed-hebrew">{feature}</span>
                        <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} className="text-cyan-400" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10">
                  <button 
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all duration-300 cursor-pointer ${
                      tier.popular
                        ? 'bg-primary text-background hover:bg-white hover:text-black shadow-[0_15px_30px_rgba(255,20,100,0.35)]'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black hover:border-white'
                    }`}
                  >
                    הירשם עכשיו
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* --- SECTION 3: DTC VALUE CALCULATOR --- */}
      <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-24 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full inline-block">
            מחשבון חיסכון ישיר
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-3 mb-4 tracking-tight">
            3. מחשבון החיסכון והטבות <span className="text-primary font-outfit">DTC</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            כשאתה מזמין ישירות (Direct-to-Consumer) באתר שלנו, אתה חוסך עמלות כרטוס וצובר נקודות VIP. הזז את הסליידר כדי לחשב כמה תרוויח בחודש!
          </p>
        </div>

        <ScrollReveal>
          <div className="rounded-[40px] liquid-glass p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Shimmer element */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 pointer-events-none" />
            <div className="absolute inset-0 shimmer" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              
              {/* Left Side: Calculations display */}
              <div className="space-y-8 order-2 lg:order-1">
                
                {/* Points bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs md:text-sm font-bold flex-row">
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
                  <div className="flex justify-between items-center text-xs md:text-sm font-bold flex-row">
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
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center justify-between flex-row">
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
                  <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">בקרת סליידר</span>
                  <h3 className="text-xl md:text-2xl font-black text-white mt-1">כמה סרטים אתה רואה בחודש?</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-row">
                    <span className="text-3xl font-black text-white font-mono">{moviesCount}</span>
                    <span className="text-slate-400 text-xs">בחירת כמות כרטיסים בחודש</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={moviesCount} 
                    onChange={(e) => setMoviesCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary border border-white/5 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold flex-row">
                    <span>10 כרטיסים</span>
                    <span>5 כרטיסים</span>
                    <span>1 כרטיס</span>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 justify-end items-start text-right">
                  <p className="text-xs text-slate-300 font-medium leading-relaxed-hebrew flex-1">
                    הזמנה ישירה באתר Liquid Glass מקנה לך את העמלות הנמוכות ביותר, צבירת נקודות מועדון 120pts לכרטיס וניהול הזמנות חכם.
                  </p>
                  <Sparkles className="text-primary w-5 h-5 shrink-0 mt-0.5" />
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Sub-components & Helpers

// ScrollStepTrigger to activate scrollytelling index
interface ScrollStepTriggerProps {
  children: React.ReactNode;
  index: number;
  onVisible: (index: number) => void;
}

function ScrollStepTrigger({ children, index, onVisible }: ScrollStepTriggerProps) {
  const ref = useRef<HTMLDivElement>(null);
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
        isInView ? 'opacity-100 transform translate-x-0' : 'opacity-25 transform translate-x-2'
      }`}
    >
      {children}
    </div>
  );
}

// ScrollReveal utility to wrap grids/cards with entry animations
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
