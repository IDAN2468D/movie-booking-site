'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Ticket, Calendar, Clock } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import { getImageUrl } from '@/lib/tmdb';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BookingSummarySidebarProps {
  onCheckout: () => void;
}

export default function BookingSummarySidebar({ onCheckout }: BookingSummarySidebarProps) {
  // Zustand State - Strict Selectors
  const selectedMovie = useBookingStore((state) => state.selectedMovie);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedShowtime = useBookingStore((state) => state.selectedShowtime);
  const selectedHall = useBookingStore((state) => state.selectedHall);

  const ticketPrice = 45;
  const totalPrice = selectedSeats.length * ticketPrice;

  useEffect(() => {
    const scrollerEl = document.querySelector('main');
    if (!scrollerEl) return;

    // ScrollTrigger to fade/scale in the summary poster as user scrolls down from hero
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-poster-target',
        { opacity: 0, scale: 0.7, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#hero-trigger',
            scroller: scrollerEl,
            start: 'bottom 80%',
            end: 'bottom 20%',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  if (!selectedMovie) return null;

  return (
    <div className="sticky top-28 w-full" dir="rtl">
      <div className="relative p-6 rounded-[36px] bg-white/[0.02] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden group">
        {/* Optical Depth Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-colors duration-500" />
        
        {/* Header with target morphed poster */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-5 mb-5">
          <div className="hero-poster-target w-[64px] h-[96px] rounded-xl overflow-hidden border border-white/15 relative shrink-0 shadow-lg bg-white/5">
            <Image
              src={getImageUrl(selectedMovie.poster_path, 'w500')}
              alt={selectedMovie.displayTitle}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="text-right">
            <span className="text-[10px] text-primary font-black uppercase tracking-wider block mb-1">סיכום הזמנה</span>
            <h3 className="text-lg font-black text-white leading-tight font-display uppercase">{selectedMovie.displayTitle}</h3>
          </div>
        </div>

        {/* Selection Details */}
        <div className="space-y-4 text-xs font-bold text-slate-400 mb-6">
          <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
            <Calendar size={14} className="text-slate-500 shrink-0" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">תאריך הקרנה</span>
              <span className="text-white font-black">{selectedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
            <Clock size={14} className="text-slate-500 shrink-0" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">שעה ואולם</span>
              <span className="text-white font-black">{selectedShowtime} • {selectedHall || 'Standard'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <Ticket size={14} className="text-slate-500 shrink-0" />
              <div className="flex flex-col text-right">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider">מושבים שנבחרו</span>
                <span className="text-white font-black">
                  {selectedSeats.length > 0 ? `${selectedSeats.length} כרטיסים` : 'טרם נבחרו מושבים'}
                </span>
              </div>
            </div>
            
            {selectedSeats.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5 mt-1.5">
                {selectedSeats.map((id) => (
                  <span
                    key={id}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-white shrink-0"
                  >
                    {id.replace('s-', '')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-white/5 pt-4 mb-6 space-y-2.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-400">
            <span>מחיר לכרטיס</span>
            <span className="font-bold text-white">₪{ticketPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-black text-white pt-1">
            <span>סה&quot;כ</span>
            <span className="text-2xl font-black text-primary text-glow">₪{totalPrice}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={selectedSeats.length === 0}
          onClick={onCheckout}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 ${
            selectedSeats.length > 0
              ? 'bg-primary text-black hover:scale-[1.02] hover:shadow-[0_12px_25px_rgba(255,20,100,0.3)] active:scale-95'
              : 'bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          <span>המשך לתשלום</span>
          <ArrowRight size={14} className="rotate-180" />
        </button>

        <p className="text-center mt-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest block">
          הזמנה מאובטחת • ללא עמלות נוספות
        </p>
      </div>
    </div>
  );
}
