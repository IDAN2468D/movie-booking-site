'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const text = "ברוכים הבאים לדור הבא של הקולנוע. חוויית ה-Liquid Glass משלבת מקרני לייזר 4K מתקדמים, סאונד Dolby Atmos היקפי ב-360 מעלות, ומושבי VIP יוקרתיים מתכווננים חשמלית עם שירות הזמנת כיבוד גורמה ישירות למושב שלכם. הכל מנוהל על ידי בינה מלאכותית המתאימה את ההמלצות והסרטים בדיוק לטעם שלכם.";
  const words = text.split(" ");

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const scrollerEl = document.querySelector('main');
    if (!scrollerEl) return;

    const ctx = gsap.context(() => {
      const wordSpans = textRef.current?.querySelectorAll('.reveal-word');
      if (!wordSpans || wordSpans.length === 0) return;

      // Animate the text reveal words on scroll using safe DOM element reference
      gsap.fromTo(
        wordSpans,
        { opacity: 0.15, color: "rgba(255, 255, 255, 0.15)" },
        {
          opacity: 1,
          color: "#ffffff",
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: scrollerEl,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-32 px-6 flex items-center justify-center relative min-h-[50vh] bg-gradient-to-b from-black/0 via-primary/5 to-black/0 border-y border-white/5 overflow-hidden"
    >
      {/* Background soft glowing blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl text-center relative z-10">
        <span className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 inline-block mb-8">
          החזון הסינמטי שלנו
        </span>

        <p
          ref={textRef}
          className="text-xl md:text-4xl font-extrabold text-white/20 flex flex-wrap justify-center gap-x-2.5 gap-y-3 leading-relaxed font-display text-center"
          dir="rtl"
        >
          {words.map((word, i) => (
            <span
              key={i}
              className="reveal-word inline-block transition-shadow duration-300"
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
