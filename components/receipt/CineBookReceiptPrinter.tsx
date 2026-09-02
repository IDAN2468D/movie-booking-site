'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { playThermalPrintSound, playPaperTearSound } from './receiptAudio';
import { ReceiptPaperContent } from './ReceiptPaperContent';
import { ReceiptActionButtons } from './ReceiptActionButtons';

export interface CineBookReceiptItem { 
  name: string; 
  qty: number; 
  price: number; 
}

export interface CineBookReceiptData {
  cinemaName: string; 
  tagline: string; 
  movieTitle: string; 
  formatAndHall: string;
  showtime: string; 
  selectedSeats: string[]; 
  bookingCode: string; 
  items: CineBookReceiptItem[];
  subtotal: number; 
  taxAmount: number; 
  total: number;
}

export const defaultReceiptData: CineBookReceiptData = {
  cinemaName: 'CINEPULSE DIGITAL CINEMA',
  tagline: 'אישור הזמנה וכרטיס קולנוע דיגיטלי',
  movieTitle: 'חולית: חלק שני (Dune: Part Two)',
  formatAndHall: 'אולם 1 | IMAX 3D Laser',
  showtime: 'יום חמישי, 14 באוגוסט | 20:30',
  selectedSeats: ['שורה 7 - מושב 12', 'שורה 7 - מושב 13'],
  bookingCode: 'CNB-98420192',
  items: [
    { name: '2X כרטיס קולנוע IMAX 3D', qty: 2, price: 110.00 },
    { name: '1X קומבו פופקורן ענק + שתייה', qty: 1, price: 45.00 },
  ],
  subtotal: 131.36,
  taxAmount: 23.64,
  total: 155.00,
};

export default function CineBookReceiptPrinter({ data = defaultReceiptData }: { data?: CineBookReceiptData }) {
  const [printKey, setPrintKey] = useState(1);
  const [isTorn, setIsTorn] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (isPrinting) return;
    setIsTorn(false);
    setIsPrinting(true);
    setPrintKey(prev => prev + 1);
    if (soundEnabled) {
      playThermalPrintSound(1800);
    }
    setTimeout(() => setIsPrinting(false), 1900);
  };

  const handleTear = () => {
    if (!isTorn && !isPrinting) {
      if (soundEnabled) {
        playPaperTearSound();
      }
      setIsTorn(true);
    }
  };

  const paperPolygon = isTorn
    ? 'polygon(0% 12px, 4% 0px, 8% 12px, 12% 0px, 16% 12px, 20% 0px, 24% 12px, 28% 0px, 32% 12px, 36% 0px, 40% 12px, 44% 0px, 48% 12px, 52% 0px, 56% 12px, 60% 0px, 64% 12px, 68% 0px, 72% 12px, 76% 0px, 80% 12px, 84% 0px, 88% 12px, 92% 0px, 96% 12px, 100% 0px, 100% 100%, 0% 100%)'
    : undefined;

  return (
    <div ref={containerRef} dir="rtl" className="flex flex-col items-center justify-center p-2 text-slate-100 font-sans w-full max-w-md mx-auto">
      <div className="relative w-full flex flex-col items-center">
        
        {/* 1. Metallic Thermal Dispenser Slot */}
        <div className="relative z-20 w-[94%] h-14 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 p-[2px] shadow-[0_15px_35px_rgba(245,158,11,0.25)] border border-amber-300/40">
          <div className="w-full h-full bg-stone-950 rounded-xl flex items-center justify-between px-4 relative overflow-hidden shadow-inner">
            {/* Status LED */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isPrinting ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'}`} />
              <span className="text-[10px] font-mono font-bold text-zinc-400">
                {isPrinting ? 'PRINTING' : 'READY'}
              </span>
            </div>

            {/* Dispenser Mouth Slot */}
            <div className="flex-1 mx-3 h-2.5 bg-black rounded-full border-b border-amber-500/30 flex items-center justify-center relative overflow-hidden">
              {isPrinting && (
                <div className="w-24 h-1.5 bg-amber-400 rounded-full animate-pulse blur-[1px]" />
              )}
            </div>

            <span className="text-[10px] font-mono font-black text-amber-500 tracking-wider">
              THERMAL-80
            </span>
          </div>
        </div>

        {/* 2. Paper Container & Rollout Reveal */}
        <div className="relative z-10 w-full flex flex-col items-center -mt-2 overflow-hidden pb-2">
          <motion.div
            key={printKey}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center overflow-hidden"
          >
            <motion.div
              initial={{ y: -40 }}
              animate={{ 
                y: isTorn ? 18 : 0, 
                rotate: isTorn ? 0.8 : 0, 
                clipPath: paperPolygon || 'none' 
              }}
              transition={{ 
                y: { duration: isTorn ? 0.3 : 1.8 }, 
                clipPath: { duration: 0.2 } 
              }}
              className="w-[88%]"
            >
              <ReceiptPaperContent
                data={data}
                isTorn={isTorn}
                isPrinting={isPrinting}
                onTear={handleTear}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* 3. Interactive Actions & Sharing Control Panel */}
        <ReceiptActionButtons
          data={data}
          isPrinting={isPrinting}
          isTorn={isTorn}
          soundEnabled={soundEnabled}
          onPrint={handlePrint}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />
      </div>
    </div>
  );
}
