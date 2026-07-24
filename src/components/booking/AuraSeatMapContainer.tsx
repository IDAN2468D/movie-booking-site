'use client';

import React, { useState } from 'react';
import { AuraResonance } from '@/lib/validations/aura';
import { AuraSeatView } from './AuraSeatView';

export const AuraSeatMapContainer: React.FC = () => {
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<AuraResonance | null>(null);

  const mockSeats: AuraResonance[] = [
    { seatId: 'A1', row: 'A', number: 1, compatibilityScore: 0.94, occupantGenreAffinity: 'סייברפאנק', glowColor: 'rgba(0, 255, 163, 0.6)', isBooked: false },
    { seatId: 'A2', row: 'A', number: 2, compatibilityScore: 0.88, occupantGenreAffinity: 'מדע בדיוני', glowColor: 'rgba(0, 240, 255, 0.6)', isBooked: false },
    { seatId: 'A3', row: 'A', number: 3, compatibilityScore: 0.52, occupantGenreAffinity: 'דרמה', glowColor: 'rgba(245, 158, 11, 0.4)', isBooked: true },
    { seatId: 'A4', row: 'A', number: 4, compatibilityScore: 0.91, occupantGenreAffinity: 'אקשן קוונטי', glowColor: 'rgba(0, 255, 163, 0.6)', isBooked: false },
    { seatId: 'A5', row: 'A', number: 5, compatibilityScore: 0.76, occupantGenreAffinity: 'אימה קוסמית', glowColor: 'rgba(147, 51, 234, 0.6)', isBooked: false },
    { seatId: 'A6', row: 'A', number: 6, compatibilityScore: 0.65, occupantGenreAffinity: 'מתח', glowColor: 'rgba(239, 68, 68, 0.4)', isBooked: false },
    { seatId: 'B1', row: 'B', number: 1, compatibilityScore: 0.82, occupantGenreAffinity: 'סייברפאנק', glowColor: 'rgba(0, 240, 255, 0.6)', isBooked: false },
    { seatId: 'B2', row: 'B', number: 2, compatibilityScore: 0.97, occupantGenreAffinity: 'אפוס קולנועי', glowColor: 'rgba(0, 255, 163, 0.8)', isBooked: false },
    { seatId: 'B3', row: 'B', number: 3, compatibilityScore: 0.45, occupantGenreAffinity: 'קומדיה', glowColor: 'rgba(245, 158, 11, 0.3)', isBooked: false },
    { seatId: 'B4', row: 'B', number: 4, compatibilityScore: 0.89, occupantGenreAffinity: 'מדע בדיוני', glowColor: 'rgba(0, 255, 163, 0.6)', isBooked: false },
    { seatId: 'B5', row: 'B', number: 5, compatibilityScore: 0.73, occupantGenreAffinity: 'אקשן', glowColor: 'rgba(147, 51, 234, 0.5)', isBooked: true },
    { seatId: 'B6', row: 'B', number: 6, compatibilityScore: 0.95, occupantGenreAffinity: 'אפוס', glowColor: 'rgba(0, 255, 163, 0.7)', isBooked: false },
  ];

  const handleSeatHover = (seat: AuraResonance | null) => {
    setHoveredSeat(seat);
    if (seat && !seat.isBooked) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(300 + seat.compatibilityScore * 400, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch {
        // Audio fallback
      }
    }
  };

  const handleSeatSelect = (seat: AuraResonance) => {
    if (!seat.isBooked) {
      setSelectedSeatId(seat.seatId);
    }
  };

  return (
    <AuraSeatView
      seats={mockSeats}
      selectedSeatId={selectedSeatId}
      hoveredSeat={hoveredSeat}
      onSeatHover={handleSeatHover}
      onSeatSelect={handleSeatSelect}
    />
  );
};
