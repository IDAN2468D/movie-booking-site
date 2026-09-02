'use client';

import React from 'react';
import { Scissors, Sparkles, CheckCircle2, Film, ShieldCheck } from 'lucide-react';
import { CineBookReceiptData } from './CineBookReceiptPrinter';

interface Props {
  data: CineBookReceiptData;
  isTorn: boolean;
  isPrinting: boolean;
  onTear: () => void;
}

export const ReceiptPaperContent: React.FC<Props> = ({
  data,
  isTorn,
  isPrinting,
  onTear,
}) => {
  const vatRate = 0.18;
  const subtotalBeforeVat = data.total / (1 + vatRate);
  const vatAmount = data.total - subtotalBeforeVat;
  const pulsePoints = Math.round(data.total * 0.5);

  return (
    <div
      onClick={onTear}
      className={`relative w-full bg-[#FAF9F5] text-stone-900 p-6 shadow-2xl origin-top select-none font-mono ${
        isTorn ? 'cursor-default' : 'cursor-pointer hover:translate-y-1 transition-transform'
      }`}
      dir="rtl"
    >
      {/* Interactive Tear Guide Indicator */}
      {!isTorn && !isPrinting && (
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-amber-800/80 mb-3 border-b border-dashed border-amber-400/60 pb-1.5 bg-amber-500/10 -mx-2 px-2 rounded-t-lg">
          <Scissors size={12} className="rotate-90 animate-pulse" />
          <span className="font-bold">לחץ כאן כדי לתלוש את הקבלה התרמית</span>
        </div>
      )}

      {/* Header Branding */}
      <div className="flex flex-col items-center text-center border-b border-stone-300 pb-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-black text-sm mb-1 shadow-md">
          CP
        </div>
        <h2 className="font-black text-stone-900 text-base font-outfit tracking-tight">
          {data.cinemaName}
        </h2>
        <p className="text-[11px] text-stone-600">{data.tagline}</p>
        <span className="text-[10px] text-stone-500 mt-0.5">ע.מ / ח.פ 514982341 • קופה ראשית</span>
      </div>

      {/* Movie & Hall Highlight Box */}
      <div className="text-center my-2 bg-stone-100 p-3 rounded-xl border border-stone-200 shadow-inner">
        <h3 className="text-base font-black text-stone-900 font-outfit">
          {data.movieTitle}
        </h3>
        <p className="text-xs font-bold text-amber-800 mt-0.5">{data.formatAndHall}</p>
        <p className="text-[11px] font-medium text-stone-600">{data.showtime}</p>
      </div>

      {/* Seats Highlight */}
      <div className="my-2.5 text-center">
        <span className="text-xs font-black text-stone-800 bg-stone-200/90 px-3 py-1 rounded-full border border-stone-300">
          מושבים: {data.selectedSeats.length > 0 ? data.selectedSeats.join(' | ') : 'ללא שיוך'}
        </span>
      </div>

      {/* Items Breakdown */}
      <div className="my-3 border-t border-b border-dashed border-stone-400 py-2 text-xs space-y-1.5">
        {data.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-stone-800">
            <span className="truncate max-w-[200px]">{item.name}</span>
            <span className="font-bold text-stone-950 font-mono">₪{item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Tax & Total */}
      <div className="text-xs space-y-1 text-stone-700 mb-3">
        <div className="flex justify-between text-[11px]">
          <span>סכום חייב מע״מ:</span>
          <span className="font-mono">₪{subtotalBeforeVat.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span>מע״מ ישראלי (18%):</span>
          <span className="font-mono">₪{vatAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-black text-stone-950 border-t border-stone-300 pt-1.5">
          <span className="font-outfit">סה״כ לתשלום:</span>
          <span className="text-amber-900 font-outfit font-black">₪{data.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Loyalty Points Badge */}
      <div className="mb-4 bg-amber-50 border border-amber-200 p-2 rounded-xl flex items-center justify-between text-[11px] text-amber-900">
        <span className="flex items-center gap-1 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> נצברו בהזמנה זו:
        </span>
        <span className="font-black font-outfit">+{pulsePoints} נקודות Pulse</span>
      </div>

      {/* Barcode & Security Code */}
      <div className="flex flex-col items-center text-center pt-1 border-t border-stone-200">
        <div className="flex items-center justify-center gap-[2px] h-9 w-52 bg-stone-950 p-1.5 rounded-sm shadow-inner">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="bg-white h-full"
              style={{ width: `${((i * 7) % 3) + 1.2}px` }}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold text-stone-700 mt-1 font-mono tracking-wider">
          קוד הזמנה: {data.bookingCode}
        </span>
        <div className="flex items-center gap-1 text-[9px] text-stone-500 mt-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>מאומת דיגיטלית בשרת CinePulse • הצג בכניסה לאולם</span>
        </div>
      </div>
    </div>
  );
};
