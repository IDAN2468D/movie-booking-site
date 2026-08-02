"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateSpatialHapticPerspectiveAction } from "@/app/actions/spatialHapticSeat.actions";
import { SeatPerspectiveOutput } from "@/lib/validations/spatialHapticSeat.schema";
import { useSeatHaptics } from "@/hooks/useSeatHaptics";

interface SpatialHapticSeatModalProps {
  seatId: string;
  x: number;
  y: number;
  z: number;
  onClose: () => void;
}

export const SpatialHapticSeatModal: React.FC<SpatialHapticSeatModalProps> = ({
  seatId,
  x,
  y,
  z,
  onClose,
}) => {
  const [data, setData] = useState<SeatPerspectiveOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const { triggerSeatHapticPulse } = useSeatHaptics();

  useEffect(() => {
    let isMounted = true;
    calculateSpatialHapticPerspectiveAction({ seatId, x, y, z }).then((res) => {
      if (isMounted) {
        if (res.success && res.data) {
          setData(res.data);
        }
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [seatId, x, y, z]);

  const handleHapticTest = () => {
    if (data) {
      triggerSeatHapticPulse(data.panValue, data.frequencyCenter, 300);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg p-6 rounded-3xl backdrop-blur-[40px] saturate-[250%] brightness-105 bg-neutral-950/80 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] text-white"
          dir="rtl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="font-['Outfit'] text-xl font-bold text-cyan-400">
              📐 תצוגת IMAX & תהודה אקוסטית — מושב {seatId}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center text-sm font-bold transition-all"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="h-40 flex items-center justify-center text-cyan-400 animate-pulse font-mono">
              מחשב פרמטרים מרחביים...
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 text-xs font-mono rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {data?.sweetSpotRating}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  מרחק מהמסך: {data?.distanceToScreen}m
                </span>
              </div>

              {/* 3D Curved Screen & Seat Raycast Viewport */}
              <div className="relative h-40 w-full rounded-2xl bg-black/80 overflow-hidden flex flex-col items-center justify-center border border-cyan-500/20 my-3">
                <div
                  className="w-4/5 h-6 rounded-b-[100%] bg-gradient-to-r from-cyan-500 via-white to-cyan-500 shadow-[0_0_25px_rgba(0,209,255,0.7)] transition-all duration-300"
                  style={{ transform: `scaleX(${1 + (data?.viewingAngle || 0) / 80})` }}
                />
                <div className="mt-6 flex items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-full border-2 border-cyan-400 bg-cyan-500/20 flex flex-col items-center justify-center text-xs font-mono text-cyan-200 shadow-[0_0_15px_rgba(0,209,255,0.5)]"
                    style={{ transform: `translateX(${(data?.panValue || 0) * 50}px)` }}
                  >
                    <span>FOV</span>
                    <span className="font-bold">{data?.fov}°</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-['Inter'] mb-5 text-neutral-300">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-neutral-400">זווית צפייה</span>
                  <span className="font-mono text-white text-base font-semibold">
                    {data?.viewingAngle}°
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-neutral-400">איזון אקוסטי (Pan)</span>
                  <span className="font-mono text-white text-base font-semibold">
                    {data?.panValue}
                  </span>
                </div>
              </div>

              <button
                onClick={handleHapticTest}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold shadow-lg transition-all transform-gpu active:scale-[0.98] flex items-center justify-center gap-2 border border-cyan-400/30"
              >
                <span>🔊 בדוק תהודה אקוסטית ומשוב הפטי (40Hz Sub-Bass)</span>
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
