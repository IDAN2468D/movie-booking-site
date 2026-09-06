'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clapperboard, Utensils, Ticket, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { useUIStore } from '@/lib/store/ui-store';

const triggerHaptic = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(12);
    } catch {
      // Ignore vibration errors
    }
  }
};

export default function MobileNav() {
  const pathname = usePathname();
  const { selectedMovie } = useBookingStore();
  const { setMobileBookingOpen, setMobileHubOpen, isMobileHubOpen } = useUIStore();

  const handleCenterAction = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic();
    setMobileBookingOpen(true);
  };

  const handleHubToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic();
    setMobileHubOpen(!isMobileHubOpen);
  };

  return (
    <div 
      style={{ transform: 'translate3d(0, 0, 0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
      className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none transform-gpu"
    >
      {/* Dynamic Ambient Blur Backdrop */}
      <div className="pointer-events-auto relative w-full bg-[#07090E]/90 backdrop-blur-xl saturate-[180%] border-t border-white/10 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 px-3">
        {/* Subtle Top Gradient Line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <nav aria-label="ניווט ראשי במובייל" className="relative flex items-center justify-between h-16 max-w-lg mx-auto">
          {/* 1. דף הבית */}
          <Link
            href="/"
            onClick={triggerHaptic}
            aria-label="דף הבית"
            className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center group"
          >
            {pathname === '/' && (
              <motion.div
                layoutId="mobileActiveTab"
                className="absolute inset-x-2 inset-y-1 bg-white/[0.06] border border-white/10 rounded-2xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Home
              size={20}
              className={`relative z-10 transition-transform duration-300 ${
                pathname === '/' ? 'text-primary scale-110' : 'text-slate-400 group-hover:text-white'
              }`}
            />
            <span className={`relative z-10 text-[10px] font-black mt-1 transition-colors ${
              pathname === '/' ? 'text-primary' : 'text-slate-400'
            }`}>
              בית
            </span>
          </Link>

          {/* 2. קטלוג ומאצ'ר סרטים */}
          <Link
            href="/showcase"
            onClick={triggerHaptic}
            aria-label="סרטים ומאצ׳ר"
            className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center group"
          >
            {pathname?.startsWith('/showcase') && (
              <motion.div
                layoutId="mobileActiveTab"
                className="absolute inset-x-2 inset-y-1 bg-white/[0.06] border border-white/10 rounded-2xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Clapperboard
              size={20}
              className={`relative z-10 transition-transform duration-300 ${
                pathname?.startsWith('/showcase') ? 'text-primary scale-110' : 'text-slate-400 group-hover:text-white'
              }`}
            />
            <span className={`relative z-10 text-[10px] font-black mt-1 transition-colors ${
              pathname?.startsWith('/showcase') ? 'text-primary' : 'text-slate-400'
            }`}>
              סרטים
            </span>
          </Link>

          {/* 3. כפתור הזמנה חי מרכזי (Action Hub) */}
          <div className="relative flex items-center justify-center flex-1 -mt-4">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleCenterAction}
              aria-label={selectedMovie ? `הזמן כרטיס לסרט ${selectedMovie.displayTitle}` : 'הזמנת כרטיסים מהירה'}
              className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-primary via-[#FF1464] to-amber-400 p-[2px] shadow-[0_0_25px_rgba(255,20,100,0.6)] flex items-center justify-center group"
            >
              <div className="w-full h-full rounded-full bg-[#0A0A0A] flex flex-col items-center justify-center group-hover:bg-[#111] transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent opacity-80" />
                <Ticket size={22} className="text-white relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="text-[8px] font-black uppercase text-amber-300 relative z-10 mt-0.5 tracking-tighter">
                  {selectedMovie ? 'הזמן' : 'כרטיס'}
                </span>
              </div>
              {selectedMovie && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 border-2 border-black rounded-full animate-pulse" />
              )}
            </motion.button>
          </div>

          {/* 4. מזנון ואוכל */}
          <Link
            href="/food"
            onClick={triggerHaptic}
            aria-label="מזנון ואוכל"
            className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center group"
          >
            {pathname === '/food' && (
              <motion.div
                layoutId="mobileActiveTab"
                className="absolute inset-x-2 inset-y-1 bg-white/[0.06] border border-white/10 rounded-2xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Utensils
              size={20}
              className={`relative z-10 transition-transform duration-300 ${
                pathname === '/food' ? 'text-primary scale-110' : 'text-slate-400 group-hover:text-white'
              }`}
            />
            <span className={`relative z-10 text-[10px] font-black mt-1 transition-colors ${
              pathname === '/food' ? 'text-primary' : 'text-slate-400'
            }`}>
              אוכל
            </span>
          </Link>

          {/* 5. מרכז פעולות / תפריט מלא */}
          <button
            onClick={handleHubToggle}
            aria-label="תפריט מלא ופעולות מהירות"
            className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center group"
          >
            {isMobileHubOpen && (
              <motion.div
                layoutId="mobileActiveTab"
                className="absolute inset-x-2 inset-y-1 bg-primary/20 border border-primary/40 rounded-2xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <LayoutGrid
              size={20}
              className={`relative z-10 transition-transform duration-300 ${
                isMobileHubOpen ? 'text-primary scale-110' : 'text-slate-400 group-hover:text-white'
              }`}
            />
            <span className={`relative z-10 text-[10px] font-black mt-1 transition-colors ${
              isMobileHubOpen ? 'text-primary' : 'text-slate-400'
            }`}>
              תפריט
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
