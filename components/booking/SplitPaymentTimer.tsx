'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CreditCard, Coins, CheckCircle2, ShieldAlert } from 'lucide-react';
import { getSplitPaymentSessionAction, payIndividualSeatAction, SplitSession } from '@/app/actions/splitPaymentActions';

export function SplitPaymentTimer() {
  const [session, setSession] = useState<SplitSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [payingSeat, setPayingSeat] = useState<string | null>(null);

  useEffect(() => {
    getSplitPaymentSessionAction().then((res) => {
      if (res.success && res.data) {
        setSession(res.data);
        setTimeLeft(res.data.remainingSeconds);
      }
    });

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePaySeat = async (seatNumber: string, method: 'ILS_CREDIT' | 'CRYPTO_USDC') => {
    if (!session) return;
    setPayingSeat(seatNumber);
    const res = await payIndividualSeatAction({
      sessionId: session.sessionId,
      seatNumber,
      paymentMethod: method,
      amountILS: 60,
    });
    setPayingSeat(null);

    if (res.success && res.data) {
      setSession({ ...res.data });
    }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  if (!session) return null;

  return (
    <div className="w-full bg-neutral-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] my-8 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold font-outfit text-white">תשלום מפוצל קבוצתי & נעילת מושבים</h3>
          <p className="text-xs text-gray-400">{session.movieTitle} &bull; 10 דקות נעילת סשן מובטחת</p>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/30 text-amber-300">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-mono font-bold">{mins}:{secs < 10 ? '0' : ''}{secs}</span>
          <span className="text-[10px] text-gray-400">לשחרור נעילה</span>
        </div>
      </div>

      <div className="space-y-3">
        {session.seatAllocations.map((alloc) => (
          <div
            key={alloc.seatNumber}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{alloc.seatNumber}</span>
                <span className="text-xs text-gray-300">({alloc.assignedUser})</span>
              </div>
              <span className="text-[11px] text-amber-400 font-mono">₪{alloc.amountILS} / ${alloc.amountCryptoUSDC} USDC</span>
            </div>

            {alloc.isPaid ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> שולם
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={payingSeat === alloc.seatNumber}
                  onClick={() => handlePaySeat(alloc.seatNumber, 'ILS_CREDIT')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5" /> ₪ אשראי
                </button>
                <button
                  type="button"
                  disabled={payingSeat === alloc.seatNumber}
                  onClick={() => handlePaySeat(alloc.seatNumber, 'CRYPTO_USDC')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all"
                >
                  <Coins className="w-3.5 h-3.5" /> Crypto USDC
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
