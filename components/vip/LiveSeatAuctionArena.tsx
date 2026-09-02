'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Gavel, Clock, CheckCircle2, ShieldAlert, MapPin } from 'lucide-react';
import { getLiveAuctionStateAction, submitAuctionBidAction, AuctionState } from '@/app/actions/auctionBidActions';
import { playAuctionGavelSound } from './AuctionGavelSound';

const VIP_BRANCHES = [
  { id: 'cc-glilot', name: 'סינמה סיטי VIP גלילות' },
  { id: 'yp-rishon', name: 'יס פלאנט VIP ראשל״צ' },
  { id: 'hc-kfar-saba', name: 'הוט סינמה VIP כפ״ס' },
];

export function LiveSeatAuctionArena() {
  const [auction, setAuction] = useState<AuctionState | null>(null);
  const [selectedBranch, setSelectedBranch] = useState(VIP_BRANCHES[0].id);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidNotice, setBidNotice] = useState<string | null>(null);

  useEffect(() => {
    getLiveAuctionStateAction().then((res) => {
      if (res.success && res.data) {
        setAuction(res.data);
        setTimeLeft(res.data.secondsRemaining);
      }
    });

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceBid = async (delta: number) => {
    if (!auction || isSubmitting || timeLeft <= 0) return;
    const targetBid = auction.currentBid + delta;

    setIsSubmitting(true);
    playAuctionGavelSound();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 60, 40]);
    }

    const res = await submitAuctionBidAction({
      auctionId: auction.auctionId,
      bidAmount: targetBid,
      bidderName: 'אני (משתמש VIP)',
    });
    setIsSubmitting(false);

    if (res.success && res.data) {
      setAuction(res.data);
      if (timeLeft < 30) setTimeLeft(30);
      setBidNotice(`הצעתך בסך ₪${targetBid} מובילה כעת! 🔨`);
      setTimeout(() => setBidNotice(null), 3000);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!auction) return null;
  const isUrgent = timeLeft <= 30;

  return (
    <div className={`w-full bg-neutral-950/90 backdrop-blur-3xl border rounded-3xl p-6 shadow-2xl transition-all ${
      isUrgent ? 'border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'border-amber-500/20 shadow-[0_20px_60px_rgba(245,158,11,0.1)]'
    }`} dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-outfit text-white">זירת מכרזי מושבי VIP בישראל</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                LIVE AUCTION
              </span>
            </div>
            <p className="text-xs text-gray-400">{auction.movieTitle} &bull; {auction.seatNumber}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
          isUrgent ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse' : 'bg-black/40 border-white/10 text-white'
        }`}>
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`} />
          <span className="text-sm font-mono font-bold">{formatTimer(timeLeft)}</span>
          <span className="text-[10px] text-gray-400">לסיום</span>
        </div>
      </div>

      {/* Israeli VIP Cinema Selector */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 text-xs">
        <span className="text-gray-400 flex items-center gap-1"><MapPin size={12} className="text-amber-400" /> מתחם:</span>
        <div className="flex flex-wrap gap-1.5">
          {VIP_BRANCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedBranch === b.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center relative overflow-hidden">
          <span className="text-xs text-gray-400 block mb-1">הצעה מובילה נוכחית:</span>
          <div className="text-4xl font-extrabold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
            ₪{auction.currentBid}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
            <span>מוביל: <strong className="text-white">{auction.highestBidder}</strong></span>
            <span>&bull;</span>
            <span className="text-amber-400">{auction.totalBidsCount} הצעות הוגשו</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300">העלה הצעה בלחיצה מיידית:</span>
            {isUrgent && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                <ShieldAlert size={12} /> הגנת סנייפר פעילה (+30s)
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[10, 25, 50].map((delta) => (
              <button
                key={delta}
                type="button"
                disabled={isSubmitting || timeLeft <= 0}
                onClick={() => handlePlaceBid(delta)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold transition-all active:scale-95 disabled:opacity-40"
              >
                <div className="flex items-center gap-1">
                  <Gavel className="w-3.5 h-3.5" />
                  <span className="text-sm">+₪{delta}</span>
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5">סה&quot;כ ₪{auction.currentBid + delta}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {bidNotice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{bidNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
