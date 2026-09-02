'use client';

import React, { useState } from 'react';
import { Download, Share2, Wallet, RefreshCw, Volume2, VolumeX, Check } from 'lucide-react';
import { CineBookReceiptData } from './CineBookReceiptPrinter';

interface Props {
  data: CineBookReceiptData;
  isPrinting: boolean;
  isTorn: boolean;
  soundEnabled: boolean;
  onPrint: () => void;
  onToggleSound: () => void;
}

export const ReceiptActionButtons: React.FC<Props> = ({
  data,
  isPrinting,
  isTorn,
  soundEnabled,
  onPrint,
  onToggleSound,
}) => {
  const [copied, setCopied] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎟️ *אישור הזמנה - ${data.cinemaName}*\n\n🎬 סרט: ${data.movieTitle}\n📍 אולם: ${data.formatAndHall}\n🕒 מועד: ${data.showtime}\n💺 מושבים: ${data.selectedSeats.join(', ')}\n🔢 קוד הזמנה: ${data.bookingCode}\n💰 סה"כ: ₪${data.total.toFixed(2)}\n\nנשמר ב-CinePulse Digital Cinema!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleWalletAdd = () => {
    setWalletAdded(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
    setTimeout(() => setWalletAdded(false), 3000);
  };

  const handlePrintPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full mt-4 bg-zinc-950/80 border border-white/10 rounded-2xl p-4 backdrop-blur-2xl shadow-xl space-y-3" dir="rtl">
      {/* Primary Re-print Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrint}
          disabled={isPrinting}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 font-outfit"
        >
          <RefreshCw className={`w-4 h-4 ${isPrinting ? 'animate-spin' : ''}`} />
          <span>{isPrinting ? 'מדפיס כרטיס תרמי... 🖨️' : isTorn ? 'הדפס קבלה חדשה' : 'הדפס קבלה מחדש 🎟️'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'השתק צליל מכני' : 'הפעל צליל הדפסה תרמי'}
          aria-label="הפעל או השתק צלילי הדפסה"
          className={`p-3 rounded-xl border transition-all ${
            soundEnabled 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
              : 'bg-white/5 border-white/10 text-zinc-500'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Secondary Actions: WhatsApp, Wallet, Print */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-[11px] font-bold font-inter">
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-emerald-950/40 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 text-zinc-300 transition-all flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleWalletAdd}
          className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-cyan-950/40 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 text-zinc-300 transition-all flex items-center justify-center gap-1.5"
        >
          {walletAdded ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Wallet className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{walletAdded ? 'נוסף לארנק!' : 'Apple Wallet'}</span>
        </button>

        <button
          type="button"
          onClick={handlePrintPdf}
          className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-amber-950/40 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 text-zinc-300 transition-all flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>שמור PDF</span>
        </button>
      </div>
    </div>
  );
};
