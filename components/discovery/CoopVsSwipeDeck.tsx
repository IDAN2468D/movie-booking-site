'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles, Users, Flame, Trophy, Star, Ticket } from 'lucide-react';
import Link from 'next/link';
import { submitCoopVote } from '@/lib/actions/coop-actions';

interface MovieItem {
  id: string;
  title: string;
  genre: string;
  poster: string;
  rating: number;
}

const DEMO_MOVIES: MovieItem[] = [
  { id: '550', title: 'Fight Club', genre: 'Action / Drama', poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', rating: 8.8 },
  { id: '27205', title: 'Inception', genre: 'Sci-Fi / Action', poster: 'https://image.tmdb.org/t/p/w500/oYuLE29W9BmUhLFfQ9uhGDGIjE.jpg', rating: 8.8 },
  { id: '693134', title: 'Dune: Part Two', genre: 'Sci-Fi / Adventure', poster: 'https://image.tmdb.org/t/p/w500/1pdfLPoL6VFi8vY3W2zW8aA27k1.jpg', rating: 8.5 },
  { id: '157336', title: 'Interstellar', genre: 'Sci-Fi / Drama', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.7 },
];

let sharedAudioCtx: AudioContext | null = null;
function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();
  return sharedAudioCtx;
}

export const CoopVsSwipeDeck: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [p1Votes, setP1Votes] = useState<Record<string, 'like' | 'dislike'>>({});
  const [p2Votes, setP2Votes] = useState<Record<string, 'like' | 'dislike'>>({});
  const [matchedMovie, setMatchedMovie] = useState<MovieItem | null>(null);

  const currentMovie = DEMO_MOVIES[currentIndex];
  const sessionId = 'coop-vs-session-demo';

  const playLikeSound = () => {
    try {
      const ctx = getSharedAudioContext(); if (!ctx) return;
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.12);
    } catch {}
  };

  const playDislikeSound = () => {
    try {
      const ctx = getSharedAudioContext(); if (!ctx) return;
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.14);
    } catch {}
  };

  const playMatchVictoryFanfare = () => {
    try {
      const ctx = getSharedAudioContext(); if (!ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = 'triangle'; osc.frequency.value = f;
        const st = ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.25, st); gain.gain.exponentialRampToValueAtTime(0.001, st + 0.5);
        osc.connect(gain); gain.connect(ctx.destination); osc.start(st); osc.stop(st + 0.5);
      });
      const subOsc = ctx.createOscillator(); const subGain = ctx.createGain();
      subOsc.type = 'sine'; subOsc.frequency.setValueAtTime(80, ctx.currentTime + 0.35);
      subOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.9);
      subGain.gain.setValueAtTime(0.3, ctx.currentTime + 0.35); subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      subOsc.connect(subGain); subGain.connect(ctx.destination); subOsc.start(ctx.currentTime + 0.35); subOsc.stop(ctx.currentTime + 0.9);
    } catch {}
  };

  const handlePlayerVote = async (player: 'p1' | 'p2', vote: 'like' | 'dislike') => {
    if (!currentMovie) return;
    if (vote === 'like') playLikeSound(); else playDislikeSound();

    if (player === 'p1') setP1Votes((prev) => ({ ...prev, [currentMovie.id]: vote }));
    else setP2Votes((prev) => ({ ...prev, [currentMovie.id]: vote }));

    const res = await submitCoopVote({
      sessionId, playerId: player, movieId: currentMovie.id, movieTitle: currentMovie.title, posterPath: currentMovie.poster, vote,
    });

    const updatedP1 = player === 'p1' ? vote : p1Votes[currentMovie.id];
    const updatedP2 = player === 'p2' ? vote : p2Votes[currentMovie.id];

    if ((res.success && res.data?.isMatch) || (updatedP1 === 'like' && updatedP2 === 'like')) {
      setMatchedMovie(currentMovie); playMatchVictoryFanfare();
    } else if (updatedP1 && updatedP2) {
      if (currentIndex < DEMO_MOVIES.length - 1) setCurrentIndex((idx) => idx + 1);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-6 rounded-3xl border border-white/12 bg-neutral-950/70 backdrop-blur-[40px] saturate-[250%] text-white shadow-2xl text-right" dir="rtl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400">
            <Users className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-['Outfit'] font-black text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
              Co-op VS Movie Matcher
            </h3>
            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-pink-400" />
              סנכרון בזמן אמת • 98% Vibe Synergy Score
            </p>
          </div>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-xs text-pink-300 font-mono font-bold flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-pink-400 animate-bounce" /> LIVE MATCH
        </div>
      </div>

      {currentMovie && !matchedMovie ? (
        <div className="space-y-6">
          {/* Featured Movie Card Preview */}
          <div className="relative flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
            <div className="w-32 h-44 shrink-0 rounded-xl overflow-hidden border border-white/20 shadow-xl relative">
              <img src={currentMovie.poster} alt={currentMovie.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-yellow-400 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> {currentMovie.rating}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest block mb-1">{currentMovie.genre}</span>
              <h4 className="text-2xl font-black font-['Outfit'] text-white mb-2">{currentMovie.title}</h4>
              <p className="text-xs text-neutral-400 mb-4">הצביעו במקביל: החליטו יחד האם לצפות בסרט זה הערב!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Player 1 Controls */}
            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-center">
              <span className="text-xs font-bold text-indigo-300 block mb-3">👤 שחקן 1 (User A)</span>
              <div className="flex justify-center gap-4">
                <button onClick={() => handlePlayerVote('p1', 'dislike')} className="px-5 py-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 transition-all active:scale-95 flex items-center gap-2 font-bold text-xs">
                  <X className="w-5 h-5" /> דיסלייק
                </button>
                <button onClick={() => handlePlayerVote('p1', 'like')} className="px-5 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-all active:scale-95 flex items-center gap-2 font-bold text-xs">
                  <Heart className="w-5 h-5 fill-current" /> לייק
                </button>
              </div>
              {p1Votes[currentMovie.id] && <span className="text-[11px] text-emerald-300 mt-2.5 block font-bold">✓ הצביע: {p1Votes[currentMovie.id]}</span>}
            </div>

            {/* Player 2 Controls */}
            <div className="p-5 rounded-2xl bg-pink-950/20 border border-pink-500/30 text-center">
              <span className="text-xs font-bold text-pink-300 block mb-3">👤 שחקן 2 (User B)</span>
              <div className="flex justify-center gap-4">
                <button onClick={() => handlePlayerVote('p2', 'dislike')} className="px-5 py-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 transition-all active:scale-95 flex items-center gap-2 font-bold text-xs">
                  <X className="w-5 h-5" /> דיסלייק
                </button>
                <button onClick={() => handlePlayerVote('p2', 'like')} className="px-5 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-all active:scale-95 flex items-center gap-2 font-bold text-xs">
                  <Heart className="w-5 h-5 fill-current" /> לייק
                </button>
              </div>
              {p2Votes[currentMovie.id] && <span className="text-[11px] text-pink-300 mt-2.5 block font-bold">✓ הצביע: {p2Votes[currentMovie.id]}</span>}
            </div>
          </div>
        </div>
      ) : null}

      {/* Match Victory Modal with Instant Ticket Booking */}
      <AnimatePresence>
        {matchedMovie && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 rounded-3xl bg-gradient-to-br from-pink-950/90 via-purple-950/90 to-indigo-950/90 border border-pink-500/50 shadow-2xl">
            <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-3 animate-bounce" />
            <h2 className="text-3xl font-black font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-2">
              IT'S A MATCH! 🎬
            </h2>
            <p className="text-neutral-200 text-base mb-6">שניכם אהבתם את הסרט <strong>"{matchedMovie.title}"</strong>!</p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/book/${matchedMovie.id}`} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white text-xs shadow-xl active:scale-95 flex items-center gap-2">
                <Ticket className="w-4 h-4" /> הזמן כרטיסים כעת
              </Link>
              <button onClick={() => { setMatchedMovie(null); setCurrentIndex(0); setP1Votes({}); setP2Votes({}); }} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 font-bold text-white text-xs transition-all active:scale-95">
                התחל סיבוב חדש
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
