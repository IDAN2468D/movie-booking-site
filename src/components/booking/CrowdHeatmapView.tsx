'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrowdZone } from '@/lib/validations/crowd-heatmap.schema';

interface CrowdHeatmapViewProps {
  zones: CrowdZone[];
  activeZoneId: string | null;
  opacity: number;
  onZoneSelect: (zoneId: string) => void;
  onHoverSeat: (coord: { x: number; y: number } | null) => void;
}

export const CrowdHeatmapView: React.FC<CrowdHeatmapViewProps> = ({
  zones,
  activeZoneId,
  opacity,
  onZoneSelect,
  onHoverSeat,
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSpatialTone = (x: number, y: number, frequency = 40) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createPanner();

      panner.panningModel = 'HRTF';
      panner.setPosition((x - 5) / 5, 0, (y - 5) / 5);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(panner);
      panner.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio context fallback
    }
  };

  return (
    <div
      style={{ opacity }}
      className="relative w-full p-4 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-[40px] shadow-2xl overflow-hidden transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
        <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-pulse" />
          Real-Time Crowd Vibe Radar
        </h3>
        <span className="text-xs text-neutral-400 font-['Inter']">120Hz GPU Active</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {zones.map((zone) => {
          const isActive = activeZoneId === zone.zoneId;
          return (
            <motion.button
              key={zone.zoneId}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onZoneSelect(zone.zoneId);
                playSpatialTone(zone.seatCoords[0]?.x || 5, zone.seatCoords[0]?.y || 5, 40);
              }}
              onMouseEnter={() => {
                if (zone.seatCoords[0]) onHoverSeat(zone.seatCoords[0]);
                playSpatialTone(zone.seatCoords[0]?.x || 5, zone.seatCoords[0]?.y || 5, 220);
              }}
              onMouseLeave={() => onHoverSeat(null)}
              className={`p-3 rounded-xl border text-right transition-all duration-200 ${
                isActive
                  ? 'bg-[#8A5CFF]/20 border-[#8A5CFF] shadow-[0_0_20px_rgba(138,92,255,0.4)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-xs font-bold text-[#00FFA3] uppercase font-['Outfit']">
                {zone.vibeTag}
              </div>
              <div className="text-sm font-semibold text-white mt-1 font-['Outfit']">
                {zone.zoneName}
              </div>
              <div className="text-xs text-neutral-400 mt-1 flex justify-between items-center font-['Inter']">
                <span>Density: {Math.round(zone.densityScore * 100)}%</span>
                <span>{zone.acousticClarityDb} dB</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
