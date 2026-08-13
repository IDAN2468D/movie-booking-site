'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Fingerprint, Crown, Clock, ShieldCheck } from 'lucide-react';
import { submitVipSeatBid } from '@/app/actions/vipAuctionStreamActions';

export function VIPSeatAuctionStream() {
  const [seatCode] = useState('VIP-A1');
  const [currentBid, setCurrentBid] = useState(220);
  const [bidInput, setBidInput] = useState(240);
  const [holdingBiometric, setHoldingBiometric] = useState(false);
  const [statusMsg, setStatusMsg] = useState('זירת המכרז פעילה בזמן אמת');

  const playGavelSound = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio fallback
    }
  };

  const handlePlaceBid = async () => {
    if (bidInput <= currentBid) {
      setStatusMsg('הצעה חייבת להיות גבוהה מההצעה הנוכחית');
      return;
    }

    setStatusMsg('מאמת טביעת אצבע ביומטרית...');
    const res = await submitVipSeatBid({
      auctionId: 'auc-vip-live-99',
      seatCode,
      bidAmountIls: bidInput,
      biometricToken: 'bio-token-valid-8899',
    });

    if (res.success && res.data) {
      setCurrentBid(res.data.currentHighestBid);
      setBidInput(res.data.currentHighestBid + 20);
      playGavelSound(res.data.gavelAudioFreq);
      setStatusMsg(`הצעה על סך ₪${res.data.currentHighestBid} התקבלה בהצלחה!`);
    } else {
      setStatusMsg(res.error || 'שגיאה באישור ההצעה');
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-xl p-6 rounded-2xl bg-neutral-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl text-right">
      <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              מכרז VIP בזמן אמת - {seatCode}
            </h3>
            <p className="text-xs text-neutral-400">
              Biometric Passbook & Web Audio Gavel Engine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          <span>02:45 שניות</span>
        </div>
      </div>

      <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50 mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-neutral-400 block">הצעה מובילה כעת</span>
          <span className="text-2xl font-black text-amber-400">₪{currentBid}</span>
        </div>
        <div className="text-left">
          <span className="text-xs text-neutral-400 block">מושב פרימיום</span>
          <span className="text-sm font-semibold text-white">שורה ראשונה במרכז</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-neutral-300 mb-1 block">סכום ההצעה שלך (₪):</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={bidInput}
              onChange={(e) => setBidInput(Number(e.target.value))}
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-white font-mono text-base focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => setBidInput((prev) => prev + 10)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-amber-300 hover:bg-neutral-700"
            >
              +₪10
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center gap-3">
          <button
            onMouseDown={() => setHoldingBiometric(true)}
            onMouseUp={() => setHoldingBiometric(false)}
            className={`p-3 rounded-xl transition-all ${
              holdingBiometric
                ? 'bg-amber-500 text-neutral-950 scale-105'
                : 'bg-neutral-800 text-amber-400 hover:bg-neutral-700'
            }`}
          >
            <Fingerprint className="w-6 h-6" />
          </button>
          <div className="text-xs">
            <span className="font-semibold text-amber-300 block">אימות זהות ביומטרי</span>
            <span className="text-neutral-400">לחץ והחזק לאישור הצעה מוצפנת</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-3 border-t border-neutral-800">
        <span className="text-xs text-neutral-300 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {statusMsg}
        </span>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePlaceBid}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/50 flex items-center gap-2"
        >
          <Gavel className="w-4 h-4" />
          הגש הצעת VIP
        </motion.button>
      </div>
    </div>
  );
}
