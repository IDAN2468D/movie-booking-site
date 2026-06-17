'use client';

import React, { useEffect, useRef } from 'react';
import { Calendar, Film, CheckCircle2 } from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper to generate next 7 days in Hebrew
const generateDates = () => {
  const dates = [];
  const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayName = i === 0 ? 'היום' : i === 1 ? 'מחר' : `יום ${daysOfWeek[d.getDay()]}`;
    const dateStr = `${d.getDate()} ב${months[d.getMonth()]}`;
    dates.push({
      id: d.toLocaleDateString('he-IL'),
      label: dayName,
      subLabel: dateStr,
    });
  }
  return dates;
};

const halls = [
  { id: 'IMAX', name: 'IMAX 3D', desc: 'מסך ענק ולייזר פורץ דרך', price: '₪75' },
  { id: '4DX', name: '4DX Extreme', desc: 'כיסאות נעים ואפקטים סביבתיים', price: '₪85' },
  { id: 'VIP', name: 'VIP Lounge', desc: 'כורסאות עור ומזנון חופשי', price: '₪120' },
  { id: 'Dolby', name: 'Dolby Cinema', desc: 'סאונד היקפי וניגודיות שיא', price: '₪65' },
  { id: 'Standard', name: 'Standard 2D', desc: 'אולם מרווח ומקרן דיגיטלי', price: '₪45' },
];

export default function HorizontalShowtimes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Zustand State - Strict Selectors
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedHall = useBookingStore((state) => state.selectedHall);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const setSelectedHall = useBookingStore((state) => state.setSelectedHall);

  const dates = generateDates();

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const scrollerEl = document.querySelector('main');
    if (!scrollerEl) return;

    const track = trackRef.current;
    // Calculate total horizontal scroll width minus viewport width
    const getScrollAmount = () => {
      return track.scrollWidth - window.innerWidth;
    };

    const ctx = gsap.context(() => {
      // Pin section and translate track horizontally
      // In RTL (direction: rtl), scrollWidth elements are rendered from right-to-left.
      // To reveal items overflowed to the left, we translate positive (x direction).
      gsap.to(track, {
        x: () => getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: scrollerEl,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          invalidateOnRefresh: true,
        },
      });

      // Stagger fade-in of cards as section enters
      gsap.fromTo(
        '.stagger-card',
        { opacity: 0, scale: 0.85, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: scrollerEl,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      id="horizontal-timeline-section"
      className="relative w-full min-h-screen bg-[#050505] flex flex-col justify-center overflow-hidden border-b border-white/5"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-6 w-full mb-8 relative z-20">
        <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-2 tracking-tight">
          בחר מועד וחווית צפייה
        </h2>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
          גולל אנכית למעבר בין התאריכים והאולמות המיוחדים
        </p>
      </div>

      {/* Horizontal Track Wrapper */}
      <div 
        ref={trackRef} 
        className="flex items-center gap-6 px-12 md:px-24 select-none relative z-10 w-max flex-nowrap"
      >
        {/* Date Selection Label */}
        <div className="stagger-card flex flex-col justify-center min-w-[200px] text-right">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Calendar className="text-primary w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white">תאריך הקרנה</h3>
          <p className="text-slate-500 text-xs font-bold mt-1">מתי תרצו לצפות בסרט?</p>
        </div>

        {/* Date Cards */}
        {dates.map((date) => {
          const isSelected = selectedDate === date.id;
          return (
            <button
              key={date.id}
              onClick={() => setSelectedDate(date.id)}
              className={`stagger-card group flex flex-col justify-between p-6 w-[180px] h-[220px] rounded-[32px] border text-right transition-all duration-500 backdrop-blur-3xl relative overflow-hidden shrink-0 ${
                isSelected
                  ? 'bg-white/10 border-primary shadow-[0_15px_30px_rgba(255,20,100,0.15)] scale-[1.02]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 left-4 text-primary">
                  <CheckCircle2 size={20} className="fill-primary/20" />
                </div>
              )}
              <div className="mt-auto">
                <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase block mb-1">
                  {date.label}
                </span>
                <span className="text-lg font-black text-white group-hover:text-primary transition-colors">
                  {date.subLabel}
                </span>
              </div>
            </button>
          );
        })}

        {/* Separator Line */}
        <div className="stagger-card h-[180px] w-[2px] bg-gradient-to-b from-white/10 via-white/5 to-transparent shrink-0 mx-4" />

        {/* Hall Selection Label */}
        <div className="stagger-card flex flex-col justify-center min-w-[200px] text-right">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
            <Film className="text-cyan-400 w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white">חווית קולנוע</h3>
          <p className="text-slate-500 text-xs font-bold mt-1">בחר את פורמט ההקרנה</p>
        </div>

        {/* Hall Cards */}
        {halls.map((hall) => {
          const isSelected = selectedHall === hall.id;
          return (
            <button
              key={hall.id}
              onClick={() => setSelectedHall(hall.id)}
              className={`stagger-card group flex flex-col justify-between p-6 w-[240px] h-[220px] rounded-[32px] border text-right transition-all duration-500 backdrop-blur-3xl relative overflow-hidden shrink-0 ${
                isSelected
                  ? 'bg-white/10 border-cyan-400 shadow-[0_15px_30px_rgba(34,211,238,0.15)] scale-[1.02]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-lg">
                  {hall.price}
                </span>
                {isSelected && (
                  <div className="text-cyan-400">
                    <CheckCircle2 size={20} className="fill-cyan-400/20" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  {hall.name}
                </h4>
                <p className="text-slate-500 text-[10px] font-medium mt-1 leading-normal">
                  {hall.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
