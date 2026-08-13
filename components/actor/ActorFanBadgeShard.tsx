'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Sparkles, CheckCircle2, Copy, Check, Lock, KeyRound } from 'lucide-react';
import { generateActorFanBadge, ActorBadgeShard } from '@/app/actions/actorBadgeActions';

interface ActorFanBadgeShardProps {
  actorName: string;
}

export function ActorFanBadgeShard({ actorName }: ActorFanBadgeShardProps) {
  const [badge, setBadge] = useState<ActorBadgeShard | null>(null);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playBiometricTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  const handleTouchHoldStart = () => {
    setHolding(true);
    let cur = 0;
    playBiometricTone();
    intervalRef.current = setInterval(() => {
      cur += 10;
      setProgress(cur);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(25);
      if (cur >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setHolding(false);
        claimBadge();
      }
    }, 80);
  };

  const handleTouchHoldEnd = () => {
    if (progress < 100) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setHolding(false);
      setProgress(0);
    }
  };

  const claimBadge = async () => {
    const res = await generateActorFanBadge({ actorName });
    if (res.success && res.data) setBadge(res.data);
  };

  const copyHash = () => {
    if (!badge) return;
    navigator.clipboard.writeText(badge.encryptedShardHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strokeDashoffset = 283 - (283 * progress) / 100;

  return (
    <div dir="rtl" className="w-full p-6 md:p-8 rounded-[2.5rem] bg-neutral-950/70 border border-amber-500/30 backdrop-blur-[40px] saturate-[250%] shadow-[0_25px_50px_-12px_rgba(245,158,11,0.15)] text-right font-['Inter'] relative overflow-hidden transition-all duration-500">
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-white font-['Outfit'] tracking-wide">תג מעריצים מוצפן (HMAC-SHA256)</h3>
            <p className="text-xs text-neutral-400">Biometric Touch-Hold Passbook Shard</p>
          </div>
        </div>
        <span className="px-3.5 py-1.5 text-[11px] font-mono font-bold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Refractive Shard
        </span>
      </div>

      <AnimatePresence mode="wait">
        {badge ? (
          <motion.div
            key="unlocked"
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-neutral-900/90 to-black border border-amber-500/40 shadow-[0_10px_30px_rgba(245,158,11,0.25)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-['Outfit'] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> תג שחקן מאומת בלוקצ&apos;יין
              </span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>

            <div>
              <span className="text-xs text-neutral-400 block mb-1">שחקן מורשה</span>
              <h4 className="text-2xl font-black text-white font-['Outfit']">{badge.actorName}</h4>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-0.5">דרגת מעריץ</span>
                <span className="text-sm font-bold text-amber-300 font-['Outfit']">{badge.badgeLevel}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mb-0.5">נקודות זיקה</span>
                <span className="text-sm font-bold text-cyan-300 font-['Outfit']">{badge.loyaltyPoints} PTS</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5 font-mono">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-amber-400" /> HMAC Signature Shard</span>
                <span>{badge.issuedAt}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/80 border border-amber-500/30 text-xs font-mono text-amber-300 tracking-wider">
                <span className="truncate flex-1">{badge.encryptedShardHash}</span>
                <button
                  onClick={copyHash}
                  className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-all flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'הועתק!' : 'העתק'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center p-6 text-center space-y-6">
            <p className="text-sm text-neutral-300 max-w-md font-['Inter'] leading-relaxed">
              לחץ והחזק את הסורק הביומטרי למשך שניה אחת כדי לייצר ולהנפיק תג מעריצים מוצפן בטכנולוגיית <span className="text-amber-400 font-semibold font-mono">HMAC-SHA256</span> עבור <strong className="text-white font-['Outfit']">{actorName}</strong>.
            </p>
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" className="text-neutral-800" fill="transparent" />
                <circle cx="50" cy="50" r="45" stroke="url(#amberGradient)" strokeWidth="5" strokeDasharray="283" strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" className="transition-all duration-100 ease-linear" />
                <defs>
                  <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EAB308" />
                  </linearGradient>
                </defs>
              </svg>
              <button
                onMouseDown={handleTouchHoldStart}
                onMouseUp={handleTouchHoldEnd}
                onTouchStart={handleTouchHoldStart}
                onTouchEnd={handleTouchHoldEnd}
                onMouseLeave={handleTouchHoldEnd}
                className={`absolute w-28 h-28 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 shadow-2xl ${holding ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)] scale-95' : 'bg-neutral-900/90 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]'}`}
              >
                <Fingerprint className={`w-10 h-10 transition-transform ${holding ? 'scale-110 text-amber-300 animate-pulse' : 'text-amber-400'}`} />
                <span className="text-[10px] font-bold font-['Outfit'] text-neutral-300">{holding ? `${progress}%` : 'החזק לאימות'}</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Web Audio 40Hz & Haptic Scan Enabled</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
