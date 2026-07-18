import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibrationPulse } from '@/hooks/useVibrationPulse';
import { useBookingStore } from '@/lib/store/bookingStore';

interface ChronoMapProps {
  movieDurationMinutes: number;
}

export function ChronoMap({ movieDurationMinutes }: ChronoMapProps) {
  const { triggerPulse } = useVibrationPulse();
  const selectedDrinks = useBookingStore(state => state.selectedDrinks);
  const [intermissionTime, setIntermissionTime] = useState<number | null>(null);
  
  useEffect(() => {
    if (selectedDrinks.length === 0) {
      setIntermissionTime(null);
      return;
    }
    
    // Calculate total liquid volume
    const totalVolume = selectedDrinks.reduce((acc, drink) => {
      if (drink.size === 'L') return acc + 32;
      if (drink.size === 'M') return acc + 24;
      return acc + 16;
    }, 0);
    
    // Simplistic calculation: more volume = earlier break
    // Assume base bladder capacity allows 120 mins before break
    // Reduce capacity by 1 min per oz. Minimum intermission is 30 mins in.
    let optimalBreak = 120 - totalVolume;
    if (optimalBreak > movieDurationMinutes - 20) {
        optimalBreak = movieDurationMinutes / 2; // Default to halfway if capacity outlasts movie
    } else if (optimalBreak < 30) {
        optimalBreak = 30; 
    }
    
    setIntermissionTime(optimalBreak);
    
  }, [selectedDrinks, movieDurationMinutes]);

  useEffect(() => {
    // In a real scenario, this would be tied to movie playback progression.
    // For the UI preview, we just pulse when the intermission time is calculated.
    if (intermissionTime) {
      triggerPulse([200, 100, 200, 100, 500]);
    }
  }, [intermissionTime, triggerPulse]);

  if (!intermissionTime) return null;

  const breakPercentage = (intermissionTime / movieDurationMinutes) * 100;

  return (
    <div className="w-full mt-6 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
      <h3 className="text-sm text-primary font-bold mb-3 uppercase tracking-wider font-mono">
        Optimal Bio-Break (Chrono-Map)
      </h3>
      <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full w-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"
          initial={{ left: 0 }}
          animate={{ left: `${breakPercentage}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mix-blend-overlay" />
      </div>
      <p className="text-xs text-white/50 mt-2 text-right">
        Predicted at ~{Math.round(intermissionTime)} mins
      </p>
    </div>
  );
}
