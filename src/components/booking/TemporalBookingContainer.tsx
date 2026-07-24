'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TemporalBubbleNode } from '@/lib/validations/temporal';
import { getTemporalShowtimes } from '@/app/actions/temporal-actions';
import { TemporalBubbleView } from './TemporalBubbleView';

export const TemporalBookingContainer: React.FC = () => {
  const [bubbles, setBubbles] = useState<TemporalBubbleNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scrubPosition, setScrubPosition] = useState<number>(40);

  const fetchBubbles = useCallback(async () => {
    const res = await getTemporalShowtimes({ targetDate: '2026-07-25', timeRange: 'all' });
    if (res.success && res.data) {
      setBubbles(res.data);
      if (res.data.length > 0) setSelectedId(res.data[2].id);
    }
  }, []);

  useEffect(() => {
    fetchBubbles();
  }, [fetchBubbles]);

  const handleSelectBubble = (node: TemporalBubbleNode) => {
    setSelectedId(node.id);
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback
    }
  };

  return (
    <TemporalBubbleView
      bubbles={bubbles}
      selectedId={selectedId}
      scrubPosition={scrubPosition}
      onScrubChange={setScrubPosition}
      onSelectBubble={handleSelectBubble}
    />
  );
};
