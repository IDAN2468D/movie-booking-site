'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useRouletteStore } from '@/lib/store/rouletteStore';
import { lockRouletteSeatAction } from '@/app/actions/rouletteActions';
import { useRouletteAudio } from '@/hooks/useRouletteAudio';
import { useBookingStore } from '@/lib/store';

interface SeatingRouletteProps {
  showtimeId: string;
  userId: string;
  availableSeats: string[];
  onSeatLocked: (seatId: string) => void;
}

export default function SeatingRoulette({
  showtimeId,
  userId,
  availableSeats,
  onSeatLocked,
}: SeatingRouletteProps) {
  // Atomic selectors to prevent cascading layout reflows
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isPlaying = useRouletteStore((state) => state.isPlaying);
  const startRoulette = useRouletteStore((state) => state.startRoulette);
  const stopRoulette = useRouletteStore((state) => state.stopRoulette);
  const triggerRipple = useRouletteStore((state) => state.triggerRipple);
  const showKineticTicket = useRouletteStore((state) => state.showKineticTicket);
  const setTransactionCompleted = useBookingStore((state) => state.setTransactionCompleted);

  const { initAudio, playTick, playResolutionDrop } = useRouletteAudio();

  const [displaySeat, setDisplaySeat] = useState<string>('??');
  const [status, setStatus] = useState<'idle' | 'spinning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lockedSeat, setLockedSeat] = useState<string | null>(null);

  const rafRef = useRef<number | null>(null);
  const spinStartTime = useRef<number>(0);
  const lastUpdate = useRef<number>(0);

  const triggerRoulette = () => {
    if (availableSeats.length === 0) {
      setErrorMessage('אין מושבים פנויים לבחירה אקראית');
      setStatus('error');
      return;
    }

    setStatus('spinning');
    setErrorMessage('');
    setLockedSeat(null);
    startRoulette(availableSeats);
    initAudio(); // Initialize audio context on user interaction

    spinStartTime.current = performance.now();
    lastUpdate.current = 0;
    
    // Begin high-speed requestAnimationFrame loop
    const tick = (now: number) => {
      const elapsed = now - spinStartTime.current;
      const interval = Math.max(30, Math.min(250, 30 + (elapsed / 2500) * 220)); // Slow down curve

      if (now - lastUpdate.current > interval) {
        const randomIndex = Math.floor(Math.random() * availableSeats.length);
        const randomSeat = availableSeats[randomIndex];
        setDisplaySeat(randomSeat);
        lastUpdate.current = now;

        const rowLetter = randomSeat[0];
        const seatNum = parseInt(randomSeat.slice(1));
        const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
        
        if (!isNaN(seatNum)) {
          const r = ROWS.indexOf(rowLetter);
          const c = seatNum - 1;
          playTick(r, c);
        }
      }

      if (elapsed < 2000) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Complete the roll and perform locking
        finalizeSelection();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const finalizeSelection = async () => {
    stopRoulette();
    
    const finalIndex = Math.floor(Math.random() * availableSeats.length);
    const chosenSeat = availableSeats[finalIndex];
    setDisplaySeat(chosenSeat);

    try {
      const response = await lockRouletteSeatAction({
        showtimeId,
        seatId: chosenSeat,
        userId,
      });

      if (response.success) {
        setLockedSeat(chosenSeat);
        setStatus('success');
        
        playResolutionDrop();
        setTransactionCompleted(true);
        
        // Extract row and column coordinates for concentric ripple animation
        const rowLetter = chosenSeat[0];
        const seatNum = parseInt(chosenSeat.slice(1));
        const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
        
        const rowVal = ROWS.indexOf(rowLetter);
        const colVal = seatNum;
        triggerRipple(rowVal, colVal);

        showKineticTicket(true);

        onSeatLocked(chosenSeat);
      } else {
        setErrorMessage(response.error || 'שגיאה בנעילת המושב');
        setStatus('error');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErrorMessage('חיבור לשרת נכשל');
      setStatus('error');
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div 
      dir="rtl"
      className="w-full max-w-sm mx-auto p-6 rounded-[32px] backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border-[0.5px] border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.4)] transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center">
        <h3 className="font-outfit text-xl font-bold tracking-wide text-white mb-2">
          רולטת מושב המזל
        </h3>
        <p className="font-inter text-xs text-neutral-400 mb-6 leading-relaxed">
          תן למנוע ה-Specular לבחור עבורך את המושב המושלם באולם
        </p>

        {/* Display Container with transform-gpu rendering */}
        <div className="relative w-40 h-28 flex items-center justify-center rounded-2xl bg-neutral-950/60 border border-white/10 mb-6 overflow-hidden transform-gpu">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-primary/10 pointer-events-none" />
          
          <AnimatePresence mode="popLayout">
            <motion.span
              key={displaySeat}
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`font-outfit text-4xl font-black tracking-widest ${
                status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-primary'
              }`}
            >
              {displaySeat}
            </motion.span>
          </AnimatePresence>

          {status === 'spinning' && (
            <div className="absolute inset-x-0 bottom-2 flex justify-center">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Trigger Button */}
        <button
          onClick={triggerRoulette}
          disabled={status === 'spinning'}
          className="w-full py-3.5 px-6 rounded-xl font-outfit text-sm font-semibold tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'spinning' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              מגריל מושב...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              הגרל מושב אקראי
            </>
          )}
        </button>

        {/* Success/Error State Notifications */}
        <AnimatePresence>
          {status === 'success' && lockedSeat && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              className="mt-4 flex items-center gap-2 text-green-400 font-inter text-xs"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>המושב {lockedSeat} ננעל בהצלחה עבורך!</span>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              className="mt-4 flex items-center gap-2 text-red-400 font-inter text-xs"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
