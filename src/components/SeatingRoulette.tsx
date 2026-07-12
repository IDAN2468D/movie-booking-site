"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  useRoulettePhase,
  useRouletteCurrentIndex,
  useStartRoulette,
  useSetRouletteCurrentIndex,
  useSetRouletteTargetSeat,
  useSetRoulettePhase,
  useStopRoulette,
} from '@/lib/store/rouletteStore';
import { lockRouletteSeatAction } from '@/lib/actions/roulette';

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = [1, 2, 3, 4, 5, 6];

export default function SeatingRoulette({ showtimeId, userId }: { showtimeId: string; userId: string }) {
  const phase = useRoulettePhase();
  const currentIndex = useRouletteCurrentIndex();
  const startRoulette = useStartRoulette();
  const setCurrentIndex = useSetRouletteCurrentIndex();
  const setTargetSeat = useSetRouletteTargetSeat();
  const setPhase = useSetRoulettePhase();
  const stopRoulette = useStopRoulette();

  const animationRef = useRef<number | null>(null);

  const allSeats = ROWS.flatMap((row) => COLS.map((col) => `${row}${col}`));

  const triggerRaffle = () => {
    if (phase !== 'idle' && phase !== 'locked') return;

    startRoulette(allSeats);
    let speed = 50; // ms per step
    let ticks = 0;
    const maxTicks = 40;
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (now - lastTime >= speed) {
        lastTime = now;
        const nextIndex = Math.floor(Math.random() * allSeats.length);
        setCurrentIndex(nextIndex);
        ticks++;

        if (ticks > maxTicks - 15) {
          setPhase('decelerating');
          speed += 25; // slow down
        }

        if (ticks >= maxTicks) {
          const finalSeat = allSeats[nextIndex];
          setTargetSeat(finalSeat);
          setPhase('locked');
          stopRoulette();
          commitLock(finalSeat);
          return;
        }
      }
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
  };

  const commitLock = async (seatId: string) => {
    const res = await lockRouletteSeatAction({ seatId, showtimeId, userId });
    if (!res.success) {
      alert(res.error || 'Failed to lock seat');
      setPhase('idle');
    }
  };

  return (
    <div className="p-6 rounded-3xl backdrop-blur-[40px] saturate-[250%] bg-neutral-950/40 border border-white/[0.12] shadow-2xl flex flex-col items-center transform-gpu will-change-transform">
      <h3 className="text-lg font-bold font-outfit text-white mb-4 tracking-wider uppercase">
        Specular Seating Roulette
      </h3>

      <div className="relative w-full aspect-video max-w-[320px] bg-black/30 rounded-xl p-4 border border-white/5 transform-gpu mb-4">
        <svg viewBox="0 0 320 180" className="w-full h-full">
          {ROWS.map((row, rIdx) =>
            COLS.map((col, cIdx) => {
              const seatId = `${row}${col}`;
              const sIdx = allSeats.indexOf(seatId);
              const isHighlighted = currentIndex === sIdx;
              const x = 30 + cIdx * 45;
              const y = 25 + rIdx * 28;

              return (
                <motion.rect
                  key={seatId}
                  x={x}
                  y={y}
                  width="26"
                  height="22"
                  rx="6"
                  className="cursor-pointer transform-gpu"
                  style={{ willChange: 'transform' }}
                  animate={{
                    fill: isHighlighted ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                    stroke: isHighlighted ? '#34d399' : 'rgba(255, 255, 255, 0.15)',
                    scale: isHighlighted ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.1 }}
                />
              );
            })
          )}
        </svg>
      </div>

      <button
        onClick={triggerRaffle}
        disabled={phase === 'spinning' || phase === 'decelerating'}
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-outfit text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-50 transform-gpu"
      >
        {phase === 'spinning' || phase === 'decelerating' ? 'Spinning...' : 'Raffle Seat'}
      </button>

      {phase === 'locked' && (
        <p className="text-xs text-emerald-400 font-mono mt-3 animate-pulse">
          Lucky Seat Secured!
        </p>
      )}
    </div>
  );
}
