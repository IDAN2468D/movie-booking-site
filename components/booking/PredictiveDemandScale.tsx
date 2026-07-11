"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function PredictiveDemandScale({ tmdbId }: { tmdbId: string }) {
  const [demandData, setDemandData] = useState<{ popularity: number; shift: number; state: string } | null>(null);

  useEffect(() => {
    // Polling the TMDB dynamic pricing loop
    const fetchDemand = async () => {
      try {
        const res = await fetch(`/api/pricing/tmdb-demand?tmdbId=${tmdbId}`);
        const json = await res.json();
        if (json.success) {
          setDemandData({
            popularity: json.data.popularityVector,
            shift: json.data.priceShift,
            state: json.data.demandState
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDemand();
    const interval = setInterval(fetchDemand, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [tmdbId]);

  if (!demandData) return null;

  // 120Hz smooth canvas transforms via physical spring-based scale
  const scaleHeight = `${Math.max(10, demandData.popularity)}%`;
  const colorClass = demandData.state === 'high' ? 'bg-amber-500' : demandData.state === 'low' ? 'bg-cyan-500' : 'bg-white/50';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-64 rounded-full backdrop-blur-md bg-white/5 border border-amber-500/40 p-1 flex flex-col justify-end overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.2)]"
      dir="rtl"
    >
      <motion.div
        layout
        initial={{ height: "0%" }}
        animate={{ height: scaleHeight }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }} // Physical spring-based demand index scale
        className={`w-full rounded-full ${colorClass} shadow-[0_0_15px_currentColor] relative`}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white whitespace-nowrap">
          {demandData.shift > 0 ? `+₪${demandData.shift}` : demandData.shift < 0 ? `-₪${Math.abs(demandData.shift)}` : '₪0'}
        </div>
      </motion.div>
    </motion.div>
  );
}
