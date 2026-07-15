"use client";

import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { processQuantumCheckout } from "@/app/actions/checkoutActions";

export function SingularityOrb({ amount, onProcess, onSuccess }: { amount: number; onProcess?: () => Promise<boolean>; onSuccess?: () => void }) {
  const router = useRouter();
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  
  const x = useMotionValue(0);
  const y = useMotionValue(140);

  // Shrink orb as it gets closer to the center (singularity)
  const distance = useTransform(() => Math.sqrt(x.get() ** 2 + y.get() ** 2));
  const scale = useTransform(distance, [0, 140], [0.3, 1]);
  const opacity = useTransform(distance, [0, 100], [0, 1]);

  useEffect(() => {
    return distance.onChange((v) => {
      // If the orb is dragged very close to the center (distance < 20)
      if (v < 20 && status === "idle") {
        handleSingularityDrop();
      }
    });
  }, [distance, status]);

  const handleSingularityDrop = async () => {
    setStatus("processing");
    // Snap orb to center
    controls.start({ x: 0, y: 0, scale: 0, opacity: 0, transition: { duration: 0.3 } });

    // Play a heavy sub-bass "clunk" using Web Audio
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);

    try {
      let success = false;
      if (onProcess) {
        success = await onProcess();
      } else {
        const res = await processQuantumCheckout({ cartId: "quantum_cart", paymentToken: "quantum_token_xyz" });
        success = res.success;
      }

      if (success) {
        setStatus("success");
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/tickets");
          }
        }, 1500);
      } else {
        setStatus("error");
        // Reject the orb back out to starting position
        controls.start({ x: 0, y: 140, scale: 1, opacity: 1 });
        setTimeout(() => setStatus("idle"), 2000);
      }
    } catch (e) {
      setStatus("error");
      controls.start({ x: 0, y: 140, scale: 1, opacity: 1 });
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[400px] flex items-center justify-center rounded-3xl bg-[#05070B] border border-white/5 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
      {/* The Singularity Target */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.2)]"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 blur-xl" />
        </motion.div>
        {status === "idle" && (
          <span className="absolute mt-48 text-cyan-400/50 text-xs font-['Outfit'] uppercase tracking-[0.2em]">
            גרור למרכז לתשלום
          </span>
        )}
      </div>

      {/* Status Indicators */}
      <AnimatePresence>
        {status === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute text-cyan-400 font-['Outfit'] text-sm tracking-widest font-bold z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            מעבד תשלום קוונטי...
          </motion.div>
        )}
        {status === "success" && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute text-emerald-400 font-['Outfit'] text-2xl z-10 drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]">
            התשלום אושר ✓
          </motion.div>
        )}
        {status === "error" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute text-red-500 font-['Outfit'] text-sm z-10">
            שגיאה בעיבוד התשלום
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Draggable Orb */}
      {status === "idle" || status === "error" ? (
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.2}
          dragMomentum={false}
          style={{ x, y, scale, opacity }}
          animate={controls}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 flex flex-col items-center justify-center cursor-grab shadow-[0_20px_50px_rgba(34,211,238,0.5),inset_0_0_20px_rgba(255,255,255,0.5)] z-20"
        >
          <span className="text-white font-bold text-lg drop-shadow-md">₪{amount}</span>
          <span className="text-white/70 text-[10px] uppercase font-['Outfit'] tracking-widest">שלם עכשיו</span>
        </motion.div>
      ) : null}
    </div>
  );
}
