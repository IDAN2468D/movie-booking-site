'use client';

import React, { useState } from 'react';
import { GoldScratchCard } from './GoldScratchCard';
import { RewardReveal } from './RewardReveal';
import { X } from 'lucide-react';

interface ScratchCardContainerProps {
  voucherCode: string;
  onComplete?: () => void;
}

const PRIZES = [
  'כרטיס VIP חינם',
  'פופקורן ענק זוגי',
  'משקה ענק חינם',
  'נאצוס מוגדל חינם',
  '1+1 לכרטיס קולנוע',
  'שדרוג למושב VIP'
];

export function ScratchCardContainer({
  voucherCode,
  onComplete,
}: ScratchCardContainerProps) {
  const [locked, setLocked] = useState(false);
  const [revealedPrize, setRevealedPrize] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleRevealPrize = (index: number, prizeName: string) => {
    setLocked(true);
    setRevealedPrize(prizeName);
    
    if (onComplete) {
      onComplete();
    }

    // Wait for particle animation to finish before showing cinematic ticket
    setTimeout(() => {
      setShowModal(true);
    }, 1800);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* The Gold Finsbury Scratch Card Layout */}
      <GoldScratchCard
        prizes={PRIZES}
        locked={locked}
        onRevealPrize={handleRevealPrize}
      />

      {/* Cinematic Winner Ticket Overlay Modal */}
      {showModal && revealedPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-[360px] h-[420px] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] animate-scale-up">
            {/* Close modal handle */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-black/50 border border-white/10 hover:bg-black/70 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Render Redesigned Obsidian Ticket Layer */}
            <RewardReveal
              voucherCode={voucherCode}
              rewardTitle={revealedPrize}
            />
          </div>
        </div>
      )}
    </div>
  );
}
