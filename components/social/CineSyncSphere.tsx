'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, Radio, Sparkles, Bell, Check, Heart, Smile } from 'lucide-react';
import { GroupAuraBeacon } from './GroupAuraBeacon';
import { getCoWatchingSessionAction, toggleMemberReadyAction, CoWatchingSession } from '@/app/actions/coWatchingActions';

export function CineSyncSphere() {
  const [session, setSession] = useState<CoWatchingSession | null>(null);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    getCoWatchingSessionAction().then((res) => {
      if (res.success && res.data) {
        setSession(res.data);
      }
    });
  }, []);

  const playChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch {}
  };

  const handleToggleReady = async () => {
    if (!session) return;
    const res = await toggleMemberReadyAction(session.sessionId, 'user_1');
    if (res.success && res.data) {
      setSession({ ...res.data });
      playChime();
    }
  };

  const sendReaction = (emoji: string) => {
    setActiveReaction(emoji);
    playChime();
    setTimeout(() => setActiveReaction(null), 2000);
  };

  if (!session) return null;

  return (
    <div className="w-full bg-neutral-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] my-8" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-outfit text-white">ספירת סנכרון צפייה קבוצתית (CineSync)</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-gray-400">סנכרון תחושתי והזמנת מושבים משותפת בזמן אמת</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleReady}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Check className="w-4 h-4" />
            <span>סמן כמוכן לצפייה</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {session.members.map((member) => (
          <GroupAuraBeacon key={member.id} member={member} onPing={playChime} />
        ))}
      </div>

      <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>שלח תגובת רגש חיה לכל החדר:</span>
        </div>
        <div className="flex items-center gap-2">
          {['🍿', '🔥', '😱', '❤️', '👏'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => sendReaction(emoji)}
              className="text-lg p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:scale-110 active:scale-95 transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {activeReaction && (
        <div className="text-center mt-3 text-sm font-bold text-cyan-300 animate-bounce">
          שיגרת {activeReaction} לכל המשתתפים בספירה!
        </div>
      )}
    </div>
  );
}
