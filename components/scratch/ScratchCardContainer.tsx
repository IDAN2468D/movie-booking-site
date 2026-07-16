'use client';

import React, { useState, useEffect } from 'react';
import { GoldScratchCard } from './GoldScratchCard';
import { RewardReveal } from './RewardReveal';
import { X, Sparkles } from 'lucide-react';
import { generateScratchCardAction } from '@/app/actions/scratchActions';
import { PendingScratchReward } from '@/lib/validations/user';

interface ScratchCardContainerProps {
  userId: string;
  selectedMovieId?: string;
  userMood?: string;
  onComplete?: () => void;
}

export function ScratchCardContainer({
  userId,
  selectedMovieId,
  userMood,
  onComplete,
}: ScratchCardContainerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reward, setReward] = useState<PendingScratchReward | null>(null);
  const [locked, setLocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadScratchCard() {
      try {
        setLoading(true);
        const res = await generateScratchCardAction(userId, selectedMovieId, userMood);
        if (res.success && res.data) {
          setReward(res.data as PendingScratchReward);
        } else {
          setError(res.error || 'שגיאה בטעינת כרטיס הגירוד');
        }
      } catch (err) {
        console.error('Failed to load scratch card:', err);
        setError('שגיאת תקשורת בטעינת כרטיס הגירוד');
      } finally {
        setLoading(false);
      }
    }

    loadScratchCard();
  }, [userId, selectedMovieId, userMood]);

  const handleRevealPrize = (index: number, prizeName: string) => {
    setLocked(true);
    
    // Atomically trigger completion
    if (onComplete) {
      onComplete();
    }

    // Wait for particle animation to finish before showing the cinematic reward ticket
    setTimeout(() => {
      setShowModal(true);
    }, 1800);
  };

  if (loading) {
    return (
      <div 
        style={{ width: 360, height: 500 }}
        className="rounded-3xl bg-neutral-950/40 border border-white/10 backdrop-blur-[40px] flex flex-col items-center justify-center gap-4 text-slate-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin" />
          <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
        </div>
        <p className="font-['Outfit'] font-bold text-sm tracking-wide animate-pulse">
          הסוכן הנוירוני מייצר הטבה...
        </p>
      </div>
    );
  }

  if (error || !reward) {
    return (
      <div 
        style={{ width: 360, height: 500 }}
        className="rounded-3xl bg-neutral-950/40 border border-red-500/20 backdrop-blur-[40px] flex flex-col items-center justify-center p-6 text-center gap-4 shadow-2xl"
      >
        <span className="text-red-400 text-3xl">⚠️</span>
        <h3 className="font-['Outfit'] font-bold text-lg text-white">שגיאה ביצירת הטבה</h3>
        <p className="text-slate-400 text-sm">{error || 'לא נמצאה הטבה פעילה'}</p>
      </div>
    );
  }

  // Populate all 6 scratch circles with the AI-generated reward to guarantee they always win it
  const prizes = Array(6).fill(reward.title);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Upgraded Gold Finsbury Scratch Card with Holographic Gradient */}
      <GoldScratchCard
        prizes={prizes}
        locked={locked}
        onRevealPrize={handleRevealPrize}
      />

      {/* Cinematic Winner Ticket Overlay Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-[360px] h-[450px] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-scale-up">
            {/* Close modal handle */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Render Redesigned Obsidian Ticket Layer */}
            <RewardReveal
              voucherCode={reward.voucherCode || ''}
              rewardTitle={reward.title || ''}
              explanation={reward.explanation}
            />
          </div>
        </div>
      )}
    </div>
  );
}
