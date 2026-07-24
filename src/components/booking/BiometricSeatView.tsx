'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBiometricSeatState } from '../../hooks/useBiometricSeatState';
import { calculateBiometricAcousticsAction } from '../../lib/actions/biometric-seat.actions';

export const BiometricSeatView: React.FC = () => {
  const {
    bassPreference,
    clarityPreference,
    selectedSeatId,
    acousticProfile,
    isLoading,
    setBassPreference,
    setClarityPreference,
    setSelectedSeatId,
    setAcousticProfile,
    setIsLoading,
  } = useBiometricSeatState();

  const playSpatialTone = (frequency: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context fallback
    }
  };

  const handleRecalibrate = async (seat: string, row: number, col: number) => {
    playSpatialTone(440 + row * 20);
    setSelectedSeatId(seat);
    setIsLoading(true);
    const res = await calculateBiometricAcousticsAction({
      seatId: seat,
      row,
      col,
      bassPreference,
      clarityPreference,
    });
    if (res.success && res.data) {
      setAcousticProfile(res.data);
    }
    setIsLoading(false);
  };

  const mockSeats = [
    { id: 'E-6', row: 5, col: 6 },
    { id: 'F-8', row: 6, col: 8 },
    { id: 'G-10', row: 7, col: 10 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-neutral-950/40 backdrop-blur-[40px] border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-neutral-100 font-sans max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold text-amber-400">
            Acoustic Sweet-Spot Calibrator
          </h3>
          <p className="text-xs text-neutral-400">Neural Seat Biometric Audio Optimization</p>
        </div>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {acousticProfile?.vibeTag || 'Calibrating'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {mockSeats.map((s) => (
          <motion.button
            key={s.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRecalibrate(s.id, s.row, s.col)}
            className={`p-3 rounded-xl text-center border transition-all ${
              selectedSeatId === s.id
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:border-white/30'
            }`}
          >
            <div className="text-xs text-neutral-500">Seat</div>
            <div className="text-lg font-bold font-heading">{s.id}</div>
          </motion.button>
        ))}
      </div>

      <div className="space-y-4 bg-neutral-900/40 p-4 rounded-xl border border-white/5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Bass Boost Resonance</span>
            <span className="font-mono text-amber-400">{bassPreference}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={bassPreference}
            onChange={(e) => {
              setBassPreference(Number(e.target.value));
              playSpatialTone(60 + Number(e.target.value));
            }}
            className="w-full accent-amber-400 bg-neutral-800 rounded-lg h-2"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Clarity Boost</span>
            <span className="font-mono text-cyan-400">{clarityPreference}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={clarityPreference}
            onChange={(e) => {
              setClarityPreference(Number(e.target.value));
              playSpatialTone(800 + Number(e.target.value) * 4);
            }}
            className="w-full accent-cyan-400 bg-neutral-800 rounded-lg h-2"
          />
        </div>
      </div>

      {acousticProfile && (
        <div className="grid grid-cols-3 gap-2 text-center bg-black/40 p-3 rounded-xl border border-white/10">
          <div>
            <div className="text-[10px] text-neutral-400">Sweet-Spot</div>
            <div className="text-lg font-bold font-heading text-emerald-400">
              {isLoading ? '...' : `${acousticProfile.sweetSpotScore}%`}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400">Clarity dB</div>
            <div className="text-lg font-bold font-heading text-cyan-400">
              {isLoading ? '...' : `${acousticProfile.dbBoost} dB`}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400">Surround</div>
            <div className="text-lg font-bold font-heading text-amber-400">
              {isLoading ? '...' : `${acousticProfile.surroundResonance}%`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
