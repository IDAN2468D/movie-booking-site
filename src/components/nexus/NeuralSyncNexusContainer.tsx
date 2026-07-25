'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { evaluateGroupSyncAction } from '@/app/actions/group-sync-actions';
import { ParticipantInput } from '@/lib/validations/group-sync';
import { ResonanceSphereView } from './ResonanceSphereView';
import { GroupOrbitControlsView } from './GroupOrbitControlsView';

const INITIAL_PARTICIPANTS: ParticipantInput[] = [
  { id: 'p1', nameHebrew: 'עידן', auraColor: '#38BDF8', panX: -0.7, isSynced: true },
  { id: 'p2', nameHebrew: 'מאיה', auraColor: '#A855F7', panX: 0, isSynced: false },
  { id: 'p3', nameHebrew: 'אלון', auraColor: '#34D399', panX: 0.7, isSynced: false },
];

export const NeuralSyncNexusContainer: React.FC = () => {
  const [participants, setParticipants] = useState<ParticipantInput[]>(INITIAL_PARTICIPANTS);
  const [resonanceScore, setResonanceScore] = useState(33);
  const [statusHebrew, setStatusHebrew] = useState('מחכה למשתתפים');
  const [descriptionHebrew, setDescriptionHebrew] = useState('לחצו יחד כדי לסנכרן את ההילה הקבוצתית במרחב');
  const [glowColor, setGlowColor] = useState('rgba(56, 189, 248, 0.5)');
  const [syncedCount, setSyncedCount] = useState(1);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerHarmonicChord = useCallback((freq: number) => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const chord = [freq, freq * 1.25, freq * 1.5];
    chord.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      if (panner) panner.pan.setValueAtTime((idx - 1) * 0.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      if (panner) {
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    });
  }, []);

  const evaluateSync = useCallback(async (currentList: ParticipantInput[]) => {
    const res = await evaluateGroupSyncAction({
      partyId: 'party-nexus-1',
      participants: currentList,
      resonanceScore: 0,
    });

    if (res.success && res.data) {
      setResonanceScore(res.data.resonanceScore);
      setStatusHebrew(res.data.statusHebrew);
      setDescriptionHebrew(res.data.descriptionHebrew);
      setGlowColor(res.data.mergedGlowColor);
      setSyncedCount(res.data.syncedCount);

      if (res.data.resonanceScore >= 100) {
        triggerHarmonicChord(res.data.harmonicChordFreq);
      }
    }
  }, [triggerHarmonicChord]);

  useEffect(() => {
    evaluateSync(participants);
  }, [participants, evaluateSync]);

  const handleToggleSync = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSynced: !p.isSynced } : p))
    );
  };

  const handleSyncAll = () => {
    setParticipants((prev) => prev.map((p) => ({ ...p, isSynced: true })));
  };

  const handleAddParticipant = () => {
    const newNames = ['נועה', 'דניאל', 'שירה', 'עומר'];
    const randomName = newNames[participants.length % newNames.length];
    const newP: ParticipantInput = {
      id: `p${participants.length + 1}`,
      nameHebrew: randomName,
      auraColor: '#F43F5E',
      panX: (Math.random() - 0.5) * 1.5,
      isSynced: false,
    };
    setParticipants((prev) => [...prev, newP]);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 p-6 rounded-3xl border border-white/10 bg-neutral-950/70 backdrop-blur-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] text-white text-right" dir="rtl">
      <div className="text-center space-y-1">
        <h2 className="font-outfit text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
          מרכז הסנכרון הקבוצתי
        </h2>
        <p className="font-sans text-xs text-neutral-400">
          סנכרון תדרים ומיזוג ספירות הילה במרחב אקוסטי תלת-ממדי
        </p>
      </div>

      <ResonanceSphereView
        participants={participants}
        resonanceScore={resonanceScore}
        mergedGlowColor={glowColor}
        onToggleParticipantSync={handleToggleSync}
      />

      <GroupOrbitControlsView
        syncedCount={syncedCount}
        totalCount={participants.length}
        statusHebrew={statusHebrew}
        descriptionHebrew={descriptionHebrew}
        onSyncAll={handleSyncAll}
        onAddParticipant={handleAddParticipant}
      />
    </div>
  );
};
