'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CineBookReceiptItem { name: string; qty: number; price: number; }
export interface CineBookReceiptData {
  cinemaName: string; tagline: string; movieTitle: string; formatAndHall: string;
  showtime: string; selectedSeats: string[]; bookingCode: string; items: CineBookReceiptItem[];
  subtotal: number; taxAmount: number; total: number;
}

const defaultReceiptData: CineBookReceiptData = {
  cinemaName: 'CINEPULSE DIGITAL CINEMA',
  tagline: 'אישור הזמנה וכרטיס קולנוע דיגיטלי',
  movieTitle: 'ספיידרמן: מעבר לממדי הזמן',
  formatAndHall: 'אולם 1 | IMAX 3D Laser',
  showtime: 'יום חמישי, 14 באוגוסט | 20:30',
  selectedSeats: ['שורה 7 - מושב 12', 'שורה 7 - מושב 13'],
  bookingCode: 'CNB-98420192',
  items: [
    { name: '2X כרטיס קולנוע IMAX 3D', qty: 2, price: 110.00 },
    { name: '1X קומבו פופקורן ענק + 2 שתייה', qty: 1, price: 45.00 },
  ],
  subtotal: 155.00, taxAmount: 0.00, total: 155.00,
};

const playThermalMotorSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 2.8);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.8);
  } catch {}
};

export default function CineBookReceiptPrinter({ data = defaultReceiptData }: { data?: CineBookReceiptData }) {
  const [isPrinted, setIsPrinted] = useState(true);
  const [isTorn, setIsTorn] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    if (isPrinting) return;
    setIsTorn(false);
    setIsPrinted(false);
    setIsPrinting(true);
    playThermalMotorSound();
    setTimeout(() => { setIsPrinted(true); }, 300);
    setTimeout(() => { setIsPrinting(false); }, 3400);
  };

  const handleTear = () => {
    if (isPrinted && !isTorn && !isPrinting) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([25, 40, 25]);
      setIsTorn(true);
    }
  };

  const paperPolygon = isTorn
    ? 'polygon(0% 12px, 4% 0px, 8% 12px, 12% 0px, 16% 12px, 20% 0px, 24% 12px, 28% 0px, 32% 12px, 36% 0px, 40% 12px, 44% 0px, 48% 12px, 52% 0px, 56% 12px, 60% 0px, 64% 12px, 68% 0px, 72% 12px, 76% 0px, 80% 12px, 84% 0px, 88% 12px, 92% 0px, 96% 12px, 100% 0px, 100% 100%, 0% 100%)'
    : undefined;

  return (
    <div dir="rtl" className="flex flex-col items-center justify-center p-2 text-slate-100 font-sans w-full">
      <div className="relative w-full max-w-md flex flex-col items-center">
        <div className="relative z-20 w-[92%] h-11 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 p-[2px] shadow-[0_10px_30px_rgba(245,158,11,0.25)] border border-amber-300/40 transform-gpu">
          <div className="w-full h-full bg-gradient-to-b from-stone-900 via-stone-950 to-black rounded-xl flex items-center justify-center shadow-inner">
            <div className="w-[86%] h-2 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] border-b border-amber-500/30 flex items-center justify-center">
              {isPrinting && <div className="w-12 h-1 bg-amber-400 rounded-full animate-pulse blur-[1px]" />}
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full flex flex-col items-center -mt-2 overflow-hidden pb-4">
          <AnimatePresence mode="wait">
            {isPrinted && (
              <motion.div
                key="receipt-paper"
                initial={{ clipPath: 'inset(0% 0% 100% 0%)', opacity: 0, y: 0, rotate: 0 }}
                animate={{ 
                  clipPath: paperPolygon ? paperPolygon : [
                    'inset(0% 0% 100% 0%)', 'inset(0% 0% 75% 0%)', 'inset(0% 0% 50% 0%)', 'inset(0% 0% 25% 0%)', 'inset(0% 0% 0% 0%)'
                  ],
                  opacity: 1, 
                  y: isTorn ? 18 : 0, 
                  rotate: 0,
                }}
                exit={{ opacity: 0, y: 40, scale: 0.96, rotate: 0 }}
                transition={{ 
                  duration: isTorn ? 0.4 : 3.0, ease: isTorn ? 'easeInOut' : [0.22, 1, 0.36, 1],
                  times: isTorn ? undefined : [0, 0.28, 0.55, 0.8, 1],
                }}
                onClick={handleTear}
                className={`w-[88%] bg-[#FAF8F5] text-stone-900 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform-gpu will-change-transform ${
                  isTorn ? 'cursor-default' : 'cursor-pointer hover:translate-y-1'
                }`}
                style={{ rotate: 0 }}
              >
                <div className="flex flex-col items-center text-center border-b border-stone-300 pb-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 font-black text-2xl mb-2 shadow-md">🎬</div>
                  <h2 className="font-black text-stone-900 tracking-wide text-base">{data.cinemaName}</h2>
                  <p className="text-xs text-stone-600 font-mono mt-0.5">{data.tagline}</p>
                </div>

                <div className="text-center my-3 bg-stone-100 p-3 rounded-xl border border-stone-200">
                  <h3 className="text-lg font-black text-stone-900 leading-snug">{data.movieTitle}</h3>
                  <p className="text-xs font-semibold text-amber-700 mt-1">{data.formatAndHall}</p>
                  <p className="text-[11px] font-mono text-stone-600 mt-0.5">{data.showtime}</p>
                </div>

                <div className="my-3 text-center">
                  <span className="text-xs font-bold text-stone-700 bg-stone-200 px-3 py-1 rounded-full font-mono">
                    מושבים: {data.selectedSeats.length > 0 ? data.selectedSeats.join(' | ') : 'ללא שיוך'}
                  </span>
                </div>

                <div className="my-5 border-t border-b border-dashed border-stone-400 py-3 text-xs font-mono space-y-2">
                  {data.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-stone-800 font-medium">{item.name}</span>
                      <span className="font-bold text-stone-900 shrink-0">₪{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-mono space-y-1.5 text-stone-700 mb-5">
                  <div className="flex justify-between text-base font-black text-stone-950 border-t border-stone-300 pt-2">
                    <span>סה"כ לתשלום</span>
                    <span className="text-amber-800">₪{data.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center pt-1">
                  <p className="text-[11px] font-mono tracking-widest text-stone-600 mb-2">תהנו בסרט! 🍿</p>
                  <div className="flex items-center justify-center gap-[2px] h-10 w-52 bg-stone-950 p-1.5 rounded-sm">
                    {Array.from({ length: 34 }).map((_, i) => (
                      <div key={i} className="bg-white h-full" style={{ width: `${(i % 3) + 1}px`, opacity: i % 6 === 0 ? 0.25 : 1 }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-stone-700 mt-1.5 tracking-wider">
                    קוד הזמנה: {data.bookingCode}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-2 w-full text-center bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform-gpu">
          <h3 className="text-lg font-bold text-white mb-1">
            {isPrinting ? 'מדפיס כרטיס טרמי... 🖨️' : isTorn ? 'הכרטיס נתלש בהצלחה ✂️' : 'ההזמנה אושרה בהצלחה! 🎉'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {isPrinting ? 'המדפסת הטרמית מעבדת ומזינה את הנייר...' : isTorn ? 'הכרטיס הדיגיטלי מוכן. ניתן להדפיס עותק נוסף בכל עת.' : 'לחץ על הקבלה למעלה לתלישה או לחץ להדפסה מחדש.'}
          </p>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-lg shadow-amber-500/25 disabled:opacity-50 transform-gpu"
          >
            {isPrinting ? 'מדפיס כרטיס...' : isTorn ? 'הדפס כרטיס חדש' : 'הדפס כרטיס מחדש 🎟️'}
          </button>
        </div>
      </div>
    </div>
  );
}
