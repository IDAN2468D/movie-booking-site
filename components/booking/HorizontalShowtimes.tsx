'use client';

import React from 'react';
import { Calendar, Film, CheckCircle2 } from 'lucide-react';
import { useBookingStore } from '@/lib/store';

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
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedHall = useBookingStore((state) => state.selectedHall);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const setSelectedHall = useBookingStore((state) => state.setSelectedHall);

  const dates = generateDates();

  return (
    <div
      id="horizontal-timeline-section"
      className="relative w-full py-16 bg-[#050505] overflow-hidden border-b border-white/5"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-6 w-full mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-2 tracking-tight">
          בחר מועד וחווית צפייה
        </h2>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
          בחר את הזמן והאולם המועדפים עליך
        </p>
      </div>

      {/* Wrapper */}
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col xl:flex-row gap-12">
        
        {/* Dates Section */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Calendar className="text-primary w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">תאריך הקרנה</h3>
              <p className="text-slate-500 text-xs font-bold mt-1">מתי תרצו לצפות בסרט?</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {dates.map((date) => {
              const isSelected = selectedDate === date.id;
              return (
                <button
                  key={date.id}
                  onClick={() => setSelectedDate(date.id)}
                  className={`group flex flex-col justify-between p-4 w-full h-[140px] rounded-[24px] border text-right transition-all duration-300 backdrop-blur-3xl relative overflow-hidden ${
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
          </div>
        </div>

        {/* Separator Line for Desktop */}
        <div className="hidden xl:block w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent shrink-0" />

        {/* Halls Section */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Film className="text-cyan-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">חווית קולנוע</h3>
              <p className="text-slate-500 text-xs font-bold mt-1">בחר את פורמט ההקרנה</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {halls.map((hall) => {
              const isSelected = selectedHall === hall.id;
              return (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.id)}
                  className={`group flex flex-col justify-between p-5 w-full h-[140px] rounded-[24px] border text-right transition-all duration-300 backdrop-blur-3xl relative overflow-hidden ${
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

      </div>
    </div>
  );
}
