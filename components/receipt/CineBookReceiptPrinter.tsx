'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import { playThermalPrintSound, playPaperTearSound } from './receiptAudio';

export interface CineBookReceiptItem { name: string; qty: number; price: number; }
export interface CineBookReceiptData {
  cinemaName: string; tagline: string; movieTitle: string; formatAndHall: string;
  showtime: string; selectedSeats: string[]; bookingCode: string; items: CineBookReceiptItem[];
  subtotal: number; taxAmount: number; total: number;
}

const defaultReceiptData: CineBookReceiptData = {
  cinemaName: 'CINEPULSE DIGITAL CINEMA', tagline: 'אישור הזמנה וכרטיס קולנוע דיגיטלי',
  movieTitle: 'חולית: חלק שני', formatAndHall: 'אולם 1 | IMAX 3D Laser',
  showtime: 'יום חמישי, 14 באוגוסט | 20:30', selectedSeats: ['שורה 7 - מושב 12', 'שורה 7 - מושב 13'],
  bookingCode: 'CNB-98420192',
  items: [
    { name: '2X כרטיס קולנוע IMAX 3D', qty: 2, price: 110.00 },
    { name: '1X קומבו פופקורן ענק + שתייה', qty: 1, price: 45.00 },
  ],
  subtotal: 131.36, taxAmount: 23.64, total: 155.00,
};

export default function CineBookReceiptPrinter({ data = defaultReceiptData }: { data?: CineBookReceiptData }) {
  const [printKey, setPrintKey] = useState(1);
  const [isTorn, setIsTorn] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (isPrinting) return;
    setIsTorn(false);
    setIsPrinting(true);
    setPrintKey(prev => prev + 1);
    playThermalPrintSound(1800);
    setTimeout(() => setIsPrinting(false), 1900);
  };

  const handleTear = () => {
    if (!isTorn && !isPrinting) {
      playPaperTearSound();
      setIsTorn(true);
    }
  };

  const paperPolygon = isTorn
    ? 'polygon(0% 12px, 4% 0px, 8% 12px, 12% 0px, 16% 12px, 20% 0px, 24% 12px, 28% 0px, 32% 12px, 36% 0px, 40% 12px, 44% 0px, 48% 12px, 52% 0px, 56% 12px, 60% 0px, 64% 12px, 68% 0px, 72% 12px, 76% 0px, 80% 12px, 84% 0px, 88% 12px, 92% 0px, 96% 12px, 100% 0px, 100% 100%, 0% 100%)'
    : undefined;

  return (
    <div ref={containerRef} dir="rtl" className="flex flex-col items-center justify-center p-2 text-slate-100 font-sans w-full">
      <div className="relative w-full max-w-md flex flex-col items-center">
        {/* Metallic Thermal Head Slot */}
        <div className="relative z-20 w-[92%] h-12 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 p-[2px] shadow-2xl border border-amber-300/40">
          <div className="w-full h-full bg-stone-950 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="w-[86%] h-2.5 bg-black rounded-full border-b border-amber-500/30 flex items-center justify-center">
              {isPrinting && <div className="w-20 h-1 bg-amber-400 rounded-full animate-pulse blur-[1px]" />}
            </div>
          </div>
        </div>

        {/* Paper Container */}
        <div className="relative z-10 w-full flex flex-col items-center -mt-2 overflow-hidden pb-4">
          <motion.div
            key={printKey}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center overflow-hidden"
          >
            <motion.div
              initial={{ y: -40 }}
              animate={{ y: isTorn ? 20 : 0, rotate: isTorn ? 1 : 0, clipPath: paperPolygon || 'none' }}
              transition={{ y: { duration: isTorn ? 0.3 : 1.8 }, clipPath: { duration: 0.2 } }}
              onClick={handleTear}
              className={`relative w-[88%] bg-[#FAF8F5] text-stone-900 p-6 shadow-2xl origin-top select-none ${
                isTorn ? 'cursor-default' : 'cursor-pointer hover:translate-y-1 transition-transform'
              }`}
            >
              {!isTorn && !isPrinting && (
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-amber-700/80 mb-2 border-b border-dashed border-amber-300/60 pb-1">
                  <Scissors size={10} /><span>לחץ כאן לתלישת הכרטיס</span>
                </div>
              )}
              <div className="flex flex-col items-center text-center border-b border-stone-300 pb-3 mb-3">
                <h2 className="font-black text-stone-900 text-base">{data.cinemaName}</h2>
                <p className="text-xs text-stone-600 font-mono">{data.tagline}</p>
              </div>
              <div className="text-center my-2 bg-stone-100 p-3 rounded-xl border border-stone-200">
                <h3 className="text-base font-black text-stone-900">{data.movieTitle}</h3>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">{data.formatAndHall}</p>
                <p className="text-[11px] font-mono text-stone-600">{data.showtime}</p>
              </div>
              <div className="my-3 text-center">
                <span className="text-xs font-bold text-stone-700 bg-stone-200 px-3 py-1 rounded-full font-mono">
                  מושבים: {data.selectedSeats.length > 0 ? data.selectedSeats.join(' | ') : 'ללא שיוך'}
                </span>
              </div>
              <div className="my-3 border-t border-b border-dashed border-stone-400 py-2.5 text-xs font-mono space-y-1.5">
                {data.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-stone-800">{item.name}</span>
                    <span className="font-bold text-stone-900">₪{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs font-mono space-y-1 text-stone-700 mb-4">
                <div className="flex justify-between text-[11px]">
                  <span>סכום לפני מע״מ:</span><span>₪{data.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>מע״מ ישראלי (18%):</span><span>₪{data.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-950 border-t border-stone-300 pt-1.5">
                  <span>סה&quot;כ לתשלום</span><span className="text-amber-800">₪{data.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-[2px] h-8 w-48 bg-stone-950 p-1 rounded-sm">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="bg-white h-full" style={{ width: `${(i % 3) + 1}px` }} />
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-700 mt-1">
                  קוד הזמנה: {data.bookingCode}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Control Panel */}
        <div className="mt-2 w-full text-center bg-slate-900/80 border border-white/10 rounded-2xl p-4 backdrop-blur-2xl shadow-xl">
          <button
            type="button"
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs transition-all active:scale-95 disabled:opacity-50"
          >
            {isPrinting ? 'מדפיס כרטיס... 🖨️' : isTorn ? 'הדפס כרטיס חדש' : 'הדפס כרטיס מחדש 🎟️'}
          </button>
        </div>
      </div>
    </div>
  );
}
