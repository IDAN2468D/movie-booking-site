---
name: receipt-print-animation
description: Generate and integrate animated receipt printer components, receipt roll-out CSS/Framer Motion animations, torn/cut paper receipt effects, and digital cinema ticket receipts in Next.js 15, React 19, Tailwind CSS, and Framer Motion. Built according to CineBook Liquid Glass 4.0 Pro UI design standards and native Hebrew RTL. Use when building receipt print animations, movie ticket confirmation cards, billing summaries, or torn paper UI effects.
---

# Receipt Print Animation Skill (CineBook & Liquid Glass 4.0 Pro Edition)

An instruction guide for AI agents and developers to design, construct, and integrate animated receipt printer UI components, paper roll-out reveals, torn/serrated paper cut effects, and digital cinema ticket receipts in Next.js 15, React 19, Framer Motion, Tailwind CSS (Liquid Glass 4.0 Pro), and native Hebrew RTL (`dir="rtl"`).

## Overview & Design System Alignment

This skill aligns with the **CineBook Movie Booking Platform Design System (Liquid Glass 4.0 Pro)**:
1. **Metallic Printer Slot/Head**: A 3D brass/amber metallic dispenser slot with specular highlights (`from-amber-600 via-yellow-500 to-amber-700`).
2. **Liquid Glass 4.0 Pro Container**: Dark obsidian background (`#050404`), refractive glass borders (`border-white/10` / `border-amber-500/20`), and `backdrop-blur-2xl`.
3. **Animated Receipt Roll-Out**: Fluid top-to-bottom thermal paper reveal using Framer Motion physics (`ease: [0.16, 1, 0.3, 1]`).
4. **Cut & Torn Serrated Paper Effect**: Dynamic paper tear animation with CSS `clip-path` polygon serration.
5. **CineBook Thermal Ticket Content**: Native Hebrew RTL alignment (`dir="rtl"`), ILS (`₪`) currency formatting, movie title, showtime, format (IMAX 3D / VIP), seat numbers, barcode, and booking confirmation status.

---

## Component Implementation

### `components/receipt/CineBookReceiptPrinter.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const defaultReceiptData: CineBookReceiptData = {
  cinemaName: 'CINEBOOK DIGITAL CINEMA',
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
  subtotal: 155.00,
  taxAmount: 0.00,
  total: 155.00,
};

export default function CineBookReceiptPrinter({ data = defaultReceiptData }: { data?: CineBookReceiptData }) {
  const [isPrinted, setIsPrinted] = useState(true);
  const [isTorn, setIsTorn] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsTorn(false);
    setIsPrinted(false);
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinted(true);
      setIsPrinting(false);
    }, 1400);
  };

  const handleTear = () => {
    if (isPrinted && !isTorn) {
      setIsTorn(true);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center min-h-[720px] p-6 bg-[#050404] text-slate-100 font-sans selection:bg-amber-500 selection:text-black"
    >
      <div className="relative w-full max-w-md flex flex-col items-center">
        
        {/* 1. Metallic Gold Printer Head Slot */}
        <div className="relative z-20 w-[92%] h-11 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 p-[2px] shadow-[0_10px_30px_rgba(245,158,11,0.25)] border border-amber-300/40">
          <div className="w-full h-full bg-gradient-to-b from-stone-900 via-stone-950 to-black rounded-xl flex items-center justify-center shadow-inner">
            <div className="w-[86%] h-2 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] border-b border-amber-500/30" />
          </div>
        </div>

        {/* 2. Paper Receipt Container */}
        <div className="relative z-10 w-full flex flex-col items-center -mt-2 overflow-hidden pb-4">
          <AnimatePresence mode="wait">
            {isPrinted && (
              <motion.div
                key="receipt-paper"
                initial={{ height: 0, opacity: 0, y: -45 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60, scale: 0.95 }}
                transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleTear}
                className={`w-[88%] bg-[#FAF8F5] text-stone-900 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 ${
                  isTorn ? 'translate-y-5 rotate-1 cursor-default' : 'cursor-pointer hover:translate-y-1'
                }`}
                style={{
                  clipPath: isTorn
                    ? 'polygon(0% 12px, 4% 0px, 8% 12px, 12% 0px, 16% 12px, 20% 0px, 24% 12px, 28% 0px, 32% 12px, 36% 0px, 40% 12px, 44% 0px, 48% 12px, 52% 0px, 56% 12px, 60% 0px, 64% 12px, 68% 0px, 72% 12px, 76% 0px, 80% 12px, 84% 0px, 88% 12px, 92% 0px, 96% 12px, 100% 0px, 100% 100%, 0% 100%)'
                    : 'none',
                }}
              >
                {/* Cinema Logo & Header */}
                <div className="flex flex-col items-center text-center border-b border-stone-300 pb-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 font-black text-2xl mb-2 shadow-md">
                    🎬
                  </div>
                  <h2 className="font-black text-stone-900 tracking-wide text-base">{data.cinemaName}</h2>
                  <p className="text-xs text-stone-600 font-mono mt-0.5">{data.tagline}</p>
                </div>

                {/* Movie Spotlight */}
                <div className="text-center my-3 bg-stone-100 p-3 rounded-xl border border-stone-200">
                  <h3 className="text-lg font-black text-stone-900 leading-snug">{data.movieTitle}</h3>
                  <p className="text-xs font-semibold text-amber-700 mt-1">{data.formatAndHall}</p>
                  <p className="text-[11px] font-mono text-stone-600 mt-0.5">{data.showtime}</p>
                </div>

                {/* Selected Seats Badge */}
                <div className="my-3 text-center">
                  <span className="text-xs font-bold text-stone-700 bg-stone-200 px-3 py-1 rounded-full font-mono">
                    מושבים: {data.selectedSeats.join(' | ')}
                  </span>
                </div>

                {/* Itemized Receipt Table */}
                <div className="my-5 border-t border-b border-dashed border-stone-400 py-3 text-xs font-mono space-y-2">
                  {data.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-stone-800 font-medium">{item.name}</span>
                      <span className="font-bold text-stone-900 shrink-0">₪{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="text-xs font-mono space-y-1.5 text-stone-700 mb-5">
                  <div className="flex justify-between text-base font-black text-stone-950 border-t border-stone-300 pt-2">
                    <span>סה"כ לתשלום</span>
                    <span className="text-amber-800">₪{data.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Barcode & Booking Code */}
                <div className="flex flex-col items-center text-center pt-1">
                  <p className="text-[11px] font-mono tracking-widest text-stone-600 mb-2">תהנו בסרט! 🍿</p>
                  
                  {/* Vector Barcode */}
                  <div className="flex items-center justify-center gap-[2px] h-10 w-52 bg-stone-950 p-1.5 rounded-sm">
                    {Array.from({ length: 34 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white h-full"
                        style={{ width: `${(i % 3) + 1}px`, opacity: i % 6 === 0 ? 0.25 : 1 }}
                      />
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

        {/* 3. Liquid Glass Payment Status Card */}
        <div className="mt-4 w-full text-center bg-slate-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-lg font-bold text-white mb-1">
            {isTorn ? 'הכרטיס נתלש בהצלחה ✂️' : 'ההזמנה אושרה בהצלחה! 🎉'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {isTorn
              ? 'הכרטיס הדיגיטלי שלך מוכן. ניתן להדפיס עותק חדש בכל עת.'
              : 'כרטיס הקולנוע הדיגיטלי שלך נשלח והודפס בהצלחה.'}
          </p>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-lg shadow-amber-500/25 disabled:opacity-50"
          >
            {isPrinting ? 'מדפיס כרטיס...' : isTorn ? 'הדפס כרטיס חדש' : 'הדפס כרטיס מחדש 🎟️'}
          </button>
        </div>

      </div>
    </div>
  );
}
```

---

## Liquid Glass 4.0 Pro Styling Tokens

1. **Metallic Brass Slot**:
   - `from-amber-600 via-yellow-400 to-amber-700`
   - Shadow glow: `shadow-[0_10px_30px_rgba(245,158,11,0.25)]`
2. **Thermal Paper & Serrated Edge**:
   - `clip-path: polygon(0% 12px, 4% 0px, 8% 12px, ... 100% 100%, 0% 100%)`
3. **RTL Hebrew Formatting**:
   - Currency: `₪`
   - Container `dir="rtl"`
