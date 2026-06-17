'use client';

import React, { useEffect, useRef } from 'react';
import SeatMap from '@/components/booking/SeatMap';
import { Ticket } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SeatMapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const scrollerEl = document.querySelector('main');
    if (!scrollerEl) return;

    const ctx = gsap.context(() => {
      // 3D-like entry tilt and scale animation
      gsap.fromTo(
        containerRef.current,
        {
          transformPerspective: 1000,
          rotateX: 25,
          scale: 0.88,
          opacity: 0.6,
        },
        {
          rotateX: 0,
          scale: 1,
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: scrollerEl,
            start: 'top 90%',
            end: 'top 45%',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      id="seat-selection-section"
      className="relative w-full py-16 px-6 bg-[#050505] flex flex-col items-center border-b border-white/5"
      dir="rtl"
    >
      <div className="max-w-xl w-full text-right mb-10">
        <div className="flex items-center gap-3 justify-start">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
            <Ticket className="text-primary w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black font-display text-white tracking-tight">
              בחירת מושבים באולם
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
              בחר את המקומות המועדפים עליך
            </p>
          </div>
        </div>
      </div>

      {/* 3D Transform Container (Animated by GSAP) */}
      <div 
        ref={containerRef} 
        className="w-full max-w-lg origin-bottom transition-all duration-300"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <SeatMap />
      </div>
    </div>
  );
}
