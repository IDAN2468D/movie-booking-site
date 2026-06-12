'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function TextScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll relative to this component's viewport position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"]
  });

  const text = "ברוכים הבאים לדור הבא של הקולנוע. חוויית ה-Liquid Glass משלבת מקרני לייזר 4K מתקדמים, סאונד Dolby Atmos היקפי ב-360 מעלות, ומושבי VIP יוקרתיים מתכווננים חשמלית עם שירות הזמנת כיבוד גורמה ישירות למושב שלכם. הכל מנוהל על ידי בינה מלאכותית המתאימה את ההמלצות והסרטים בדיוק לטעם שלכם.";
  const words = text.split(" ");

  return (
    <section 
      ref={containerRef} 
      className="py-32 px-6 flex items-center justify-center relative min-h-[50vh] bg-gradient-to-b from-black/0 via-primary/5 to-black/0 border-y border-white/5 overflow-hidden"
    >
      {/* Background soft glowing blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl text-center relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 inline-block mb-8"
        >
          החזון הסינמטי שלנו
        </motion.span>
        
        <p className="text-xl md:text-4xl font-extrabold text-white/20 flex flex-wrap justify-center gap-x-2.5 gap-y-3 leading-relaxed font-display text-center" dir="rtl">
          {words.map((word, i) => {
            // Distribute word reveals across the scroll timeline
            const start = i / words.length;
            const end = (i + 1) / words.length;
            
            // Map scroll progress to opacity and white text color glow
            const opacity = useTransform(scrollYProgress, [start * 0.8, end * 0.8 + 0.15], [0.15, 1]);
            const color = useTransform(scrollYProgress, [start * 0.8, end * 0.8 + 0.15], ["rgba(255,255,255,0.15)", "#ffffff"]);
            
            return (
              <motion.span
                key={i}
                style={{ 
                  opacity, 
                  color,
                  willChange: 'opacity, color'
                }}
                className="inline-block transition-shadow duration-300"
              >
                {word}
              </motion.span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
