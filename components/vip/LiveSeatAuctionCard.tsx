"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Clock, Gavel, Sparkles, Trophy } from "lucide-react";
import { placeAuctionBid } from "@/lib/actions/auctionActions";

interface Props {
  auctionId: string;
  seatNumber: string;
  movieTitle: string;
  initialBid: number;
}

export const LiveSeatAuctionCard: React.FC<Props> = ({
  auctionId,
  seatNumber,
  movieTitle,
  initialBid,
}) => {
  const [currentBid, setCurrentBid] = useState(initialBid);
  const [userBid, setUserBid] = useState(initialBid + 10);
  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes
  const [bidding, setBidding] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleBid = async () => {
    setBidding(true);
    const res = await placeAuctionBid(auctionId, userBid, "user_me");
    setBidding(false);
    if (res.success) {
      setCurrentBid(userBid);
      setUserBid(userBid + 10);
      if (timeLeft < 30) {
        setWon(true);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/40 via-slate-950/80 to-slate-950 p-6 shadow-2xl backdrop-blur-xl text-white"
      dir="rtl"
    >
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-outfit text-amber-200">מכרז מושב VIP בזמן אמת</h4>
            <p className="text-xs text-slate-400">{movieTitle} • מושב {seatNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs font-bold text-red-400">
          <Clock className="h-3.5 w-3.5 animate-spin" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="my-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
        <div>
          <span className="text-xs text-slate-400 block mb-0.5">הצעה נוכחית מובילה</span>
          <div className="text-2xl font-black text-amber-400 font-outfit">₪{currentBid}</div>
        </div>
        <div className="text-left">
          <span className="text-xs text-slate-400 block mb-0.5">נקודות נאמנות ממרות</span>
          <div className="text-sm font-bold text-purple-300">{(currentBid * 5)} PTS</div>
        </div>
      </div>

      {won ? (
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-center">
          <Trophy className="h-8 w-8 text-amber-400 mb-2 animate-bounce" />
          <h5 className="font-bold text-emerald-300 text-base">זכית במכרז ה-VIP!</h5>
          <p className="text-xs text-slate-300 mt-1">כרטיס VIP המוזהב התווסף לאזור השוברים שלך.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUserBid((b) => Math.max(currentBid + 5, b - 5))}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/20"
            >
              -
            </button>
            <div className="flex-1 rounded-lg border border-amber-500/30 bg-black/40 py-2 text-center text-lg font-bold text-amber-300">
              ₪{userBid}
            </div>
            <button
              onClick={() => setUserBid((b) => b + 5)}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/20"
            >
              +
            </button>
          </div>

          <button
            onClick={handleBid}
            disabled={bidding || timeLeft === 0}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 py-3 font-bold text-black shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all"
          >
            <Gavel className="h-4 w-4" />
            {bidding ? "שולח הצעה..." : `הגש הצעת VIP בלייב (₪${userBid})`}
          </button>
        </div>
      )}
    </motion.div>
  );
};
