'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Clock, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { placeBid } from '@/lib/actions/auctions';
import { useSession } from 'next-auth/react';

interface Auction {
  _id: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  seatLabel: string;
  startingBid: number;
  currentBid: number;
  highestBidder: string | null;
  highestBidderName: string | null;
  endTime: string;
  status: string;
}

export const SeatAuctions = ({ initialAuctions }: { initialAuctions: Auction[] }) => {
  const { data: session } = useSession();
  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions);
  const [biddingId, setBiddingId] = useState<string | null>(null);
  const [bidAmounts, setBidAmounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize bid amounts
  useEffect(() => {
    const initialBids: Record<string, number> = {};
    initialAuctions.forEach(a => {
      initialBids[a._id] = a.currentBid + 100; // default to 100 over current
    });
    setBidAmounts(initialBids);
  }, [initialAuctions]);

  // Format time remaining
  const getTimeRemaining = (endTime: string) => {
    const total = Date.parse(endTime) - Date.parse(new Date().toString());
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    
    if (total <= 0) return 'הסתיים';
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBid = async (auctionId: string, currentBid: number) => {
    if (!session?.user) {
      setError('יש להתחבר כדי להגיש הצעה');
      return;
    }
    
    const bidAmount = bidAmounts[auctionId] || currentBid + 100;
    if (bidAmount <= currentBid) {
      setError('ההצעה חייבת להיות גבוהה מההצעה הנוכחית');
      return;
    }

    setBiddingId(auctionId);
    setError(null);
    setSuccess(null);

    const res = await placeBid(
      session.user.id || 'guest', 
      session.user.name || 'Anonymous', 
      { auctionId, bidAmount }
    );

    if (res.success) {
      setSuccess('ההצעה התקבלה בהצלחה!');
      // Optimistic UI update
      setAuctions(prev => prev.map(a => 
        a._id === auctionId 
          ? { ...a, currentBid: bidAmount, highestBidderName: session.user?.name || 'You' } 
          : a
      ));
      setBidAmounts(prev => ({ ...prev, [auctionId]: bidAmount + 100 }));
    } else {
      setError(res.error || 'שגיאה בהגשת ההצעה');
    }
    
    setBiddingId(null);
    
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 4000);
  };

  if (!auctions || auctions.length === 0) {
    return (
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
        <Gavel className="w-12 h-12 text-white/30" />
        <h3 className="text-xl font-bold text-white/70 tracking-tight font-outfit">אין מכרזים פעילים כרגע</h3>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 relative mt-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <Gavel className="w-6 h-6 text-[#fbbf24] relative z-10" />
          <div className="absolute inset-0 bg-[#fbbf24] blur-xl opacity-50 rounded-full" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight font-outfit">VIP Seat Auctions</h2>
      </div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-0 left-0 right-0 z-50 p-4 rounded-xl backdrop-blur-xl border ${
              error ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-green-500/10 border-green-500/20 text-green-200'
            } flex items-center justify-center gap-3`}
          >
            {error ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="font-medium">{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => {
          const timeStr = getTimeRemaining(auction.endTime);
          const isEndingSoon = !timeStr.includes('h') && timeStr !== 'הסתיים'; // less than 1 hour

          return (
            <motion.div
              key={auction._id}
              whileHover={{ y: -5 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col group transition-all duration-500 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_0_40px_rgba(251,191,36,0.1)]"
            >
              {/* Poster Header */}
              <div className="h-32 relative overflow-hidden">
                <img 
                  src={auction.moviePoster} 
                  alt={auction.movieTitle}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/60 to-transparent" />
                
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                  {isEndingSoon ? (
                    <Flame className="w-3 h-3 text-[#fbbf24] animate-pulse" />
                  ) : (
                    <Clock className="w-3 h-3 text-white/70" />
                  )}
                  <span className={`text-xs font-mono font-medium ${isEndingSoon ? 'text-[#fbbf24]' : 'text-white/90'}`}>
                    {timeStr}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white font-outfit mb-1">{auction.movieTitle}</h3>
                <p className="text-sm text-[#fbbf24] font-medium mb-4">{auction.seatLabel}</p>

                <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-6 flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white/50">הצעה מובילה</span>
                    <span className="text-sm text-white/90 font-medium truncate max-w-[120px]" dir="ltr">
                      {auction.highestBidderName ? `@${auction.highestBidderName}` : 'אין הצעות'}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-white/50">סכום</span>
                    <div className="flex items-baseline gap-1" dir="ltr">
                      <span className="text-2xl font-bold text-white font-outfit tracking-tighter">
                        {auction.currentBid.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#fbbf24] font-bold">PTS</span>
                    </div>
                  </div>
                </div>

                {/* Bidding Area */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBid(auction._id, auction.currentBid)}
                    disabled={biddingId === auction._id || timeStr === 'הסתיים'}
                    className="flex-1 bg-[#fbbf24] text-black font-bold py-3 px-4 rounded-xl text-sm disabled:opacity-50 disabled:bg-white/10 disabled:text-white/50 transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:brightness-110 active:scale-95"
                  >
                    {biddingId === auction._id ? 'מגיש...' : 'הגש הצעה'}
                  </button>
                  <div className="relative w-1/3">
                    <input
                      type="number"
                      min={auction.currentBid + 10}
                      step={10}
                      value={bidAmounts[auction._id] || ''}
                      onChange={(e) => setBidAmounts(prev => ({ ...prev, [auction._id]: parseInt(e.target.value) || 0 }))}
                      disabled={timeStr === 'הסתיים'}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-3 text-white text-center font-mono text-sm focus:outline-none focus:border-[#fbbf24]/50 focus:bg-white/5 transition-colors disabled:opacity-50"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
