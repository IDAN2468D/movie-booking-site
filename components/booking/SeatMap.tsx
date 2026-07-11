"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/lib/store";
import { useLiquidGlassStore } from "@/lib/store/liquidGlassStore";
import { usePredictiveSeatStore } from "@/lib/store/predictiveSeatStore";
import { usePresence } from "@/hooks/usePresence";
import { BiometricIntensityMap } from "@/components/booking/BiometricIntensityMap";
import { DynamicSnackTrayCanvas } from "@/components/food/DynamicSnackTrayCanvas";
import { HolographicShardFusion } from "@/components/checkout/HolographicShardFusion";

interface SeatMapProps {
  showtimeId: string;
  userId: string;
  occupiedSeats?: string[];
  onSeatLocked?: (seatId: string) => void;
  compact?: boolean;
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function SeatMap({ showtimeId, userId, occupiedSeats = [], onSeatLocked, compact = false }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [loadingLocks, setLoadingLocks] = useState<Set<string>>(new Set());
  const [showSnacks, setShowSnacks] = useState(false);
  const globalSelectedSeats = useBookingStore((state) => state.selectedSeats);
  const { activeIntensityGenre, setActiveIntensityGenre } = useLiquidGlassStore();
  const { predictedSeats, activeOffer, setPredictedSeats, setActiveOffer } = usePredictiveSeatStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { presence, updatePresence } = usePresence();

  // Compute a map of seatId -> string[] (array of socketIds hovering this seat)
  const seatPresenceMap: Record<string, string[]> = {};
  Object.entries(presence).forEach(([socketId, sid]) => {
    if (sid) {
      if (!seatPresenceMap[sid]) seatPresenceMap[sid] = [];
      seatPresenceMap[sid].push(socketId);
    }
  });

  useEffect(() => {
    if (!activeOffer) {
      fetch("/api/pricing/evaluate-demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || "guest",
          preferredRows: [3, 4],
          preferredSections: 'center',
          genreAffinity: { "Action": 0.8, "Sci-Fi": 0.9 }
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setPredictedSeats(data.data.predictedSeats);
          setActiveOffer(data.data.flashOffer);
        }
      })
      .catch(console.error);
    }
  }, [userId, activeOffer, setPredictedSeats, setActiveOffer]);

  useEffect(() => {
    if (!activeOffer) return;
    
    const tick = () => {
      const remaining = Math.max(0, activeOffer.expiresAt - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) {
        setActiveOffer(null);
        setPredictedSeats([]);
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [activeOffer, setActiveOffer, setPredictedSeats]);

  const toggleHeatMap = () => {
    setActiveIntensityGenre(activeIntensityGenre ? null : 'Sci-Fi');
  };

  const handleSeatClick = async (seatId: string) => {
    if (occupiedSeats.includes(seatId) || selectedSeats.has(seatId) || globalSelectedSeats.includes(seatId) || loadingLocks.has(seatId)) {
      return;
    }

    setLoadingLocks(prev => {
      const next = new Set(prev);
      next.add(seatId);
      return next;
    });

    try {
      const res = await fetch("/api/seats/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showtimeId, seatId, userId }),
      });
      const data = await res.json();

      if (data.success && data.data?.locked) {
        setSelectedSeats(prev => {
          const next = new Set(prev);
          next.add(seatId);
          return next;
        });

        // Add the seat to the global booking store so checkout can proceed
        useBookingStore.getState().toggleSeat(seatId);

        // Trigger the Kinetic Holographic Fusion effect
        const store = useLiquidGlassStore.getState();
        store.setFusionOriginSeat(seatId);
        store.setFusionShardsActive(true);
        setTimeout(() => store.setFusionShardsActive(false), 2000);

        if (onSeatLocked) onSeatLocked(seatId);
      } else {
        console.error("Lock failed:", data.error);
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoadingLocks(prev => {
        const next = new Set(prev);
        next.delete(seatId);
        return next;
      });
    }
  };

  const acceptFlashOffer = async () => {
    if (!activeOffer) return;
    
    for (const seatId of activeOffer.seats) {
      if (!selectedSeats.has(seatId) && !occupiedSeats.includes(seatId) && !globalSelectedSeats.includes(seatId)) {
        await handleSeatClick(seatId);
      }
    }
    
    useBookingStore.getState().setAppliedFlashOffer({
      seats: activeOffer.seats,
      originalPrice: activeOffer.originalPrice,
      price: activeOffer.price
    });
    
    setActiveOffer(null);
    setPredictedSeats([]);
  };

  return (
    <div className={`w-full max-w-[600px] mx-auto ${compact ? 'px-2 py-4' : 'px-6 py-8 md:px-16 md:py-10'} rounded-[3rem] bg-[#090b10] border border-white/5 shadow-2xl relative overflow-hidden`} dir="ltr">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <BiometricIntensityMap />
      <HolographicShardFusion />
      


      {/* Top Bar with Toggles */}
      <div className={`flex justify-between items-center ${compact ? 'mb-8' : 'mb-16'} relative z-10`} dir="rtl">
        <button 
          onClick={() => setShowSnacks(!showSnacks)}
          className={`px-5 py-2 rounded-full border ${showSnacks ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-white/10 text-white/60'} text-[11px] font-['Outfit'] font-bold hover:bg-white/5 transition-colors tracking-wide`}
        >
          הזמנה אישית
        </button>
        <button 
          onClick={toggleHeatMap}
          className={`px-5 py-2 rounded-full border ${activeIntensityGenre ? 'border-orange-500 bg-orange-500/20 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'border-white/10 text-white/60'} text-[11px] font-['Outfit'] font-bold flex items-center gap-2 hover:bg-white/5 transition-colors tracking-wide`}
        >
          מפת חום <span className="opacity-70">🔥</span>
        </button>
      </div>

      {/* Screen Arc */}
      <div className={`flex flex-col items-center ${compact ? 'mb-6' : 'mb-12'} relative z-10`}>
        <div className="w-[85%] h-6 rounded-t-[100%] border-t-[3px] border-cyan-400 opacity-90 shadow-[0_-10px_20px_rgba(34,211,238,0.2)]" />
        <span className="text-cyan-400 font-['Outfit'] tracking-[0.4em] text-[10px] mt-2 font-bold opacity-80">מסך</span>
      </div>

      {/* Seat Matrix */}
      <div className="flex flex-col gap-3 items-center relative z-10 pb-4">
        {ROWS.map((row) => (
          <div key={row} className={`flex ${compact ? 'gap-2' : 'gap-4'} items-center w-full justify-center`}>
            <div className={`w-4 text-left font-['Outfit'] font-bold text-white/30 uppercase ${compact ? 'text-[8px]' : 'text-[10px]'}`}>{row}</div>
            
            <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
              {/* Left Block (Seats 1-3) */}
              <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
                {Array.from({ length: 3 }).map((_, idx) => {
                  const seatId = `${row}${idx + 1}`;
                  return (
                    <Seat
                      key={seatId}
                      seatId={seatId}
                      isOccupied={occupiedSeats.includes(seatId)}
                      isSelected={selectedSeats.has(seatId) || globalSelectedSeats.includes(seatId)}
                      isLoading={loadingLocks.has(seatId)}
                      isPredicted={predictedSeats.includes(seatId)}
                      onClick={() => handleSeatClick(seatId)}
                      onHover={() => updatePresence(seatId)}
                      onLeave={() => updatePresence("")}
                      compact={compact}
                      presenceUsers={seatPresenceMap[seatId] || []}
                    />
                  );
                })}
              </div>

              {/* Center Aisle */}
              <div className={compact ? 'w-3' : 'w-6'} />

              {/* Right Block (Seats 4-6) */}
              <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
                {Array.from({ length: 3 }).map((_, idx) => {
                  const seatId = `${row}${idx + 4}`;
                  return (
                    <Seat
                      key={seatId}
                      seatId={seatId}
                      isOccupied={occupiedSeats.includes(seatId)}
                      isSelected={selectedSeats.has(seatId) || globalSelectedSeats.includes(seatId)}
                      isLoading={loadingLocks.has(seatId)}
                      onClick={() => handleSeatClick(seatId)}
                      onHover={() => updatePresence(seatId)}
                      onLeave={() => updatePresence("")}
                      compact={compact}
                      presenceUsers={seatPresenceMap[seatId] || []}
                    />
                  );
                })}
              </div>
            </div>

            <div className={`w-4 text-right font-['Outfit'] font-bold text-white/30 uppercase ${compact ? 'text-[8px]' : 'text-[10px]'}`}>{row}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={`${compact ? 'mt-6' : 'mt-12'} mx-auto max-w-[90%] rounded-full border border-white/10 bg-white/5 py-4 px-6 flex justify-between items-center relative z-10`} dir="rtl">
        <LegendItem colorClass="bg-white/10 border border-white/20" label="פנוי" />
        <LegendItem colorClass="bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" label="נבחר" />
        <LegendItem colorClass="bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" label="שותף" />
        <LegendItem colorClass="border-2 border-white/10" label="תפוס" />
      </div>

      <AnimatePresence>
        {activeOffer && timeLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, y: 50, scale: 0.95, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full max-w-[400px] mx-auto mt-8 backdrop-blur-2xl bg-[#090b10]/90 border border-violet-500/50 p-5 rounded-[2rem] flex flex-col shadow-[0_25px_50px_-12px_rgba(139,92,246,0.3)] relative z-50 overflow-hidden"
            dir="rtl"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-violet-400 font-bold text-sm tracking-widest uppercase">⚡ מבצע בזק</span>
                <span className="text-white/50 text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
                  {Math.ceil(timeLeft / 1000)}s
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="text-gray-400 line-through text-xs">₪{activeOffer.originalPrice}</span>
                <span className="text-cyan-400 font-bold text-sm">₪{activeOffer.price}</span>
              </div>
            </div>
            
            <span className="text-white text-xs opacity-80 mb-4 px-1">
              מושבים פרימיום במיקום אופטימלי: <strong className="text-violet-300 ml-1">{activeOffer.seats.join(', ')}</strong>
            </span>
            
            <button
              onClick={acceptFlashOffer}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600/80 to-cyan-500/80 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] border border-white/10 flex justify-center items-center gap-2"
            >
              <span>הוסף להזמנה</span>
              <span className="text-lg leading-none mb-0.5">🚀</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSnacks && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-50 bg-[#090b10]/95 backdrop-blur-2xl flex items-center justify-center p-2 md:p-6"
          >
            <div className="absolute top-6 right-6 z-50">
              <button 
                onClick={() => setShowSnacks(false)} 
                className="text-white/50 hover:text-white px-5 py-2 border border-white/10 rounded-full text-xs font-['Outfit'] tracking-widest uppercase transition-all hover:bg-white/5"
              >
                סגור
              </button>
            </div>
            <div className="w-full max-w-full overflow-hidden transform scale-90 md:scale-100">
              <DynamicSnackTrayCanvas />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Seat({ seatId, isOccupied, isSelected, isLoading, isPredicted, onClick, onHover, onLeave, compact, presenceUsers = [] }: any) {
  let bgClass = "bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer";
  let contentClass = "opacity-100";
  
  if (isOccupied) {
    bgClass = "bg-transparent border-white/5 pointer-events-none opacity-40";
  } else if (isSelected) {
    bgClass = "bg-cyan-400 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)] cursor-default";
    contentClass = "opacity-0"; // Hide text when selected to match glowing look
  } else if (isLoading) {
    bgClass = "bg-cyan-400/20 border-cyan-400/50 animate-pulse pointer-events-none";
  } else if (isPredicted) {
    bgClass = "bg-violet-500/20 border-violet-500/80 animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.5)] cursor-pointer";
  }

  const sizeClass = compact ? "w-8 h-9 text-[8px]" : "w-11 h-12 text-[10px]";

  return (
    <motion.div
      whileHover={!isOccupied && !isSelected ? { scale: 1.05 } : {}}
      whileTap={!isOccupied && !isSelected ? { scale: 0.95 } : {}}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`${sizeClass} rounded-[10px] border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${bgClass}`}
    >
      <div className={`flex flex-col items-center justify-center ${contentClass}`}>
        <span className={`font-['Outfit'] font-bold text-white/50 mb-[2px] ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
          {seatId}
        </span>
        <div className="w-4 h-[2px] rounded-full bg-white/20" />
      </div>

      <AnimatePresence>
        {presenceUsers.length > 0 && (
          <div className="absolute inset-0 z-20 flex flex-wrap items-center justify-center gap-[2px] pointer-events-none p-1 bg-cyan-400/10">
            {presenceUsers.map((id: string) => (
              <motion.div 
                layoutId={`avatar-${id}`}
                key={id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8),inset_0_0_4px_rgba(255,255,255,0.8)] border border-white/50 backdrop-blur-md"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LegendItem({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colorClass}`} />
      <span className="text-[10px] text-white/50 font-['Outfit'] tracking-wide">{label}</span>
    </div>
  );
}
