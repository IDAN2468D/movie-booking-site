"use client";

import { motion, useAnimation, useMotionValue, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { FOOD_ITEMS } from "@/lib/constants";
import { Ticket, Popcorn, Candy, CupSoda } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the shape of a cart item
interface CartItemData {
  id: string;
  type: 'ticket' | 'food';
  label: string;
  icon: React.ReactNode;
}

export function ZeroGravityCartChamber({ 
  seats, 
  foodItems, 
  amount, 
  onProcess, 
  onSuccess 
}: { 
  seats: string[]; 
  foodItems: { id: number; quantity: number }[]; 
  amount: number; 
  onProcess: () => Promise<boolean>; 
  onSuccess: () => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [absorbedIds, setAbsorbedIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"idle" | "countdown" | "processing" | "success" | "error">("idle");
  const [countdown, setCountdown] = useState<number | null>(null);

  // Derive all individual floating items
  const cartItems = useMemo(() => {
    const items: CartItemData[] = [];
    seats.forEach(seat => {
      items.push({ id: `seat-${seat}`, type: 'ticket', label: `כרטיס ${seat}`, icon: <Ticket size={24} /> });
    });
    foodItems.forEach(food => {
      const detail = FOOD_ITEMS.find(f => f.id === food.id);
      for (let i = 0; i < food.quantity; i++) {
        let icon = <Popcorn size={24} />;
        const foodIdStr = food.id.toString();
        if (foodIdStr.includes('nacho') || foodIdStr.includes('candy') || foodIdStr.includes('snack')) icon = <Candy size={24} />;
        if (foodIdStr.includes('drink') || foodIdStr.includes('cola')) icon = <CupSoda size={24} />;
        items.push({ id: `food-${food.id}-${i}`, type: 'food', label: detail?.name || 'נשנוש', icon });
      }
    });
    return items;
  }, [seats, foodItems]);

  const totalItems = cartItems.length;

  useEffect(() => {
    if (totalItems > 0 && absorbedIds.size > 0 && status === "idle") {
      setStatus("countdown");
      setCountdown(25);
    }
  }, [absorbedIds.size, totalItems, status]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "countdown" && countdown !== null) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        processPayment();
      }
    }
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const processPayment = async () => {
    setStatus("processing");
    try {
      const success = await onProcess();
      if (success) {
        setStatus("success");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setStatus("error");
        setTimeout(() => {
          setAbsorbedIds(new Set());
          setStatus("idle");
        }, 2000);
      }
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setAbsorbedIds(new Set());
        setStatus("idle");
      }, 2000);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[500px] flex items-center justify-center rounded-[40px] bg-[#05070B] border border-white/[0.05] overflow-hidden shadow-[inset_0_0_150px_rgba(0,0,0,0.9),_0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(34,211,238,0.2) 0%, transparent 70%)' }} />
      
      {/* The Payment Singularity Core */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div 
          animate={status === "processing" ? { scale: [1, 1.2, 0.8], rotate: 1080 } : { rotate: 360, scale: [1, 1.05, 1] }} 
          transition={{ duration: status === "processing" ? 1 : 15, repeat: Infinity, ease: "linear" }}
          className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 ${
            status === "success" 
              ? "border-emerald-500/50 shadow-[0_0_80px_rgba(16,185,129,0.4)]" 
              : status === "error"
              ? "border-red-500/50 shadow-[0_0_80px_rgba(239,68,68,0.4)]"
              : "border-2 border-dashed border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.15)]"
          }`}
        >
          <div className={`w-20 h-20 rounded-full blur-2xl transition-all duration-1000 ${
             status === "success" ? "bg-emerald-500/30" : status === "error" ? "bg-red-500/30" : "bg-cyan-500/20"
          }`} />
        </motion.div>

        {/* Singularity Text */}
        <div className="absolute flex flex-col items-center">
          {status === "idle" && (
            <>
              <span className="text-white font-black text-2xl drop-shadow-lg font-rubik tracking-tight">₪{amount}</span>
              <span className="text-cyan-400/60 text-[10px] uppercase font-rubik tracking-widest mt-1">גרור פריטים לתשלום</span>
              <span className="text-white/30 text-[10px] font-anton mt-1">{absorbedIds.size} / {totalItems} הוכנסו</span>
            </>
          )}
          {status === "countdown" && (
            <div className="flex flex-col items-center">
              <span className="text-amber-400 font-rubik text-3xl font-black drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                {countdown}
              </span>
              <span className="text-white/50 text-[10px] mt-1 uppercase tracking-widest">שניות לאישור סופי</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setStatus("idle");
                  setCountdown(null);
                  setAbsorbedIds(new Set());
                }}
                className="mt-2 px-4 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded-full text-[10px] text-white backdrop-blur-md transition-colors"
              >
                בטל וחזור
              </button>
            </div>
          )}
          {status === "processing" && (
            <span className="text-cyan-400 font-rubik text-sm tracking-widest font-black drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              מעבד...
            </span>
          )}
          {status === "success" && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400 font-rubik text-2xl font-black drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]">
              ✓ שולם
            </motion.div>
          )}
          {status === "error" && (
            <span className="text-red-500 font-rubik text-sm font-black">
              שגיאה
            </span>
          )}
        </div>
      </div>

      {/* Floating Items */}
      {cartItems.map((item, index) => {
        const isAbsorbed = absorbedIds.has(item.id);
        return (
          <FloatingItem 
            key={item.id} 
            item={item} 
            index={index} 
            containerRef={containerRef}
            isAbsorbed={isAbsorbed}
            isProcessing={status === "processing"}
            onAbsorb={() => {
              setAbsorbedIds(prev => {
                const next = new Set(prev);
                next.add(item.id);
                return next;
              });
            }}
          />
        );
      })}
    </div>
  );
}

function FloatingItem({ 
  item, 
  index, 
  containerRef, 
  isAbsorbed, 
  isProcessing,
  onAbsorb 
}: { 
  item: CartItemData; 
  index: number; 
  containerRef: React.RefObject<HTMLDivElement | null>;
  isAbsorbed: boolean;
  isProcessing: boolean;
  onAbsorb: () => void;
}) {
  const controls = useAnimation();
  const x = useMotionValue((Math.random() - 0.5) * 250);
  const y = useMotionValue((Math.random() - 0.5) * 150);
  const isAbsorbingRef = useRef(false);

  useEffect(() => {
    if (isProcessing && !isAbsorbed && !isAbsorbingRef.current) {
      handleAbsorption(x.get(), y.get());
    }
  }, [isProcessing, isAbsorbed]);

  useEffect(() => {
    if (!isAbsorbed) {
      isAbsorbingRef.current = false;
      // Gentle floating animation
      controls.start({
        scale: 1, opacity: 1,
        x: [x.get(), (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300],
        y: [y.get(), (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150],
        rotate: [0, (Math.random() - 0.5) * 90],
        transition: {
          duration: 10 + Math.random() * 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      });
    }
  }, [isAbsorbed, controls, x, y]);

  // Monitor distance to singularity (0,0)
  useEffect(() => {
    if (isAbsorbed) return;
    const unsubscribeX = x.on("change", (vX) => {
      const vY = y.get();
      const distance = Math.sqrt(vX ** 2 + vY ** 2);
      if (distance < 40) {
        handleAbsorption(vX, vY);
      }
    });
    return () => unsubscribeX();
  }, [isAbsorbed, x, y]);

  useEffect(() => {
    if (isAbsorbed) return;
    const unsubscribeY = y.on("change", (vY) => {
      const vX = x.get();
      const distance = Math.sqrt(vX ** 2 + vY ** 2);
      if (distance < 40) {
        handleAbsorption(vX, vY);
      }
    });
    return () => unsubscribeY();
  }, [isAbsorbed, x, y]);

  const handleAbsorption = (dropX: number, dropY: number) => {
    if (isAbsorbed || isAbsorbingRef.current) return;
    isAbsorbingRef.current = true;
    controls.stop();
    // Suck into the hole (swallow animation)
    controls.start({
      x: 0, y: 0, scale: 0, opacity: 0, transition: { duration: 0.6, ease: "backIn" }
    }).then(() => {
      onAbsorb();
    });
  };

  return (
    <motion.div
      drag={!isAbsorbed}
      dragConstraints={containerRef as any}
      dragElastic={0.2}
      dragMomentum={false}
      style={{ x, y }}
      animate={controls}
      whileDrag={{ cursor: "grabbing" }}
      className={`absolute w-16 h-16 rounded-2xl flex flex-col items-center justify-center cursor-grab shadow-2xl border ${
        item.type === 'ticket' 
          ? 'bg-gradient-to-br from-[#FF1464]/80 to-[#A00030]/80 border-[#FF1464]/30 shadow-[0_0_15px_rgba(255,20,100,0.4)]'
          : 'bg-gradient-to-br from-violet-600/80 to-purple-900/80 border-violet-400/30 shadow-[0_0_15px_rgba(139,92,246,0.4)]'
      } backdrop-blur-md z-20`}
    >
      <div className="text-white drop-shadow-md mb-1">
        {item.icon}
      </div>
      <span className="text-white/90 text-[8px] font-black text-center leading-tight truncate px-1 w-full max-w-full font-rubik">
        {item.label}
      </span>
    </motion.div>
  );
}
