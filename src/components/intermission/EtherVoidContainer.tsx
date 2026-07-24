'use client';

import React, { useState } from 'react';
import { VoidEntity } from '@/lib/validations/void';
import { EtherVoidCanvas } from './EtherVoidCanvas';
import { Radio, Users, Volume2 } from 'lucide-react';

export const EtherVoidContainer: React.FC = () => {
  const [entities] = useState<VoidEntity[]>([
    { id: 'v1', username: 'אני (רוכב סייבר)', x: 120, y: 120, radius: 28, refractionColor: 'rgba(0, 240, 255, 0.7)', isSelf: true },
    { id: 'v2', username: 'אלכס קוונטום', x: 280, y: 80, radius: 24, refractionColor: 'rgba(147, 51, 234, 0.7)' },
    { id: 'v3', username: 'נועה סאב-באס', x: 440, y: 160, radius: 26, refractionColor: 'rgba(0, 255, 163, 0.7)' },
    { id: 'v4', username: 'דניאל הולו', x: 580, y: 90, radius: 22, refractionColor: 'rgba(245, 158, 11, 0.7)' },
  ]);

  const [activePing, setActivePing] = useState<string | null>(null);

  const handleEntityPing = (entity: VoidEntity) => {
    setActivePing(`שדר אקוסטי נשלח ל-${entity.username}`);
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const panner = ctx.createPanner();
      const gain = ctx.createGain();

      panner.panningModel = 'HRTF';
      panner.positionX.setValueAtTime((entity.x - 350) / 100, ctx.currentTime);
      panner.positionY.setValueAtTime((entity.y - 120) / 100, ctx.currentTime);
      panner.positionZ.setValueAtTime(-1, ctx.currentTime);

      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(panner);
      panner.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio fallback
    }

    setTimeout(() => setActivePing(null), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-3xl bg-neutral-950/40 border border-white/10 text-right backdrop-blur-xl shadow-2xl relative overflow-hidden" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Radio size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-outfit text-white">לובי ההמתנה הקולקטיבי Ether-Void</h2>
            <p className="text-xs text-neutral-400 font-sans">ספירות זכוכית נוזליות בתלת-ממד & פינגים אקוסטיים מרחביים</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
          <Users size={14} />
          <span>4 צופים בלובי הקוונטי</span>
        </div>
      </div>

      <EtherVoidCanvas entities={entities} onEntityPing={handleEntityPing} />

      {activePing && (
        <div className="mt-4 p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Volume2 size={14} /> {activePing}
          </span>
          <span className="text-[10px] text-cyan-400">סאונד מרחבי תלת-ממדי פעיל</span>
        </div>
      )}
    </div>
  );
};
