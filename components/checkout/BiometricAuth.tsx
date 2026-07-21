"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { processQuantumCheckout } from "@/app/actions/checkoutActions";
import { Fingerprint, CheckCircle2 } from "lucide-react";

export function BiometricAuth({ amount, onSuccess }: { amount: number, onSuccess?: () => void }) {
  const router = useRouter();
  const controls = useAnimation();
  const [status, setStatus] = useState<"idle" | "holding" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHeartbeat = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;
    
    // Simulate heartbeat by pulsing a 40Hz sub bass
    let isBeat = false;
    intervalRef.current = setInterval(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.value = isBeat ? 45 : 35; // Two-part heartbeat
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
      
      isBeat = !isBeat;
      // Vibrate if supported
      if (navigator.vibrate) navigator.vibrate(isBeat ? 50 : 30);
    }, 400); // Pulse every 400ms initially
  };

  const stopHeartbeat = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close();
  };

  const playSuccessChime = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);
  };

  const handlePointerDown = () => {
    if (status === "success" || status === "error") return;
    setStatus("holding");
    setProgress(0);
    startHeartbeat();

    // Visual ripple expansion
    controls.start({ scale: 1.5, boxShadow: "0 0 100px rgba(0, 255, 163, 0.4)" });

    let p = 0;
    holdTimerRef.current = setInterval(() => {
      p += 2;
      setProgress(p);
      
      if (p >= 100) {
        completeAuth();
      }
    }, 60); // approx 3 seconds to reach 100
  };

  const handlePointerUp = () => {
    if (status === "holding") {
      setStatus("idle");
      setProgress(0);
      stopHeartbeat();
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      controls.start({ scale: 1, boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)" });
    }
  };

  const completeAuth = async () => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    stopHeartbeat();
    playSuccessChime();
    setStatus("success");
    controls.start({ scale: 1.1, backgroundColor: "rgba(16, 185, 129, 0.2)", borderColor: "rgba(16, 185, 129, 0.8)" });
    
    try {
      const res = await processQuantumCheckout({ cartId: "bio_cart", paymentToken: "bio_token" });
      if (res.success) {
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else router.push("/tickets");
        }, 1500);
      } else {
        setStatus("error");
        controls.start({ backgroundColor: "rgba(239, 68, 68, 0.2)", borderColor: "rgba(239, 68, 68, 0.8)" });
        setTimeout(() => {
          setStatus("idle");
          setProgress(0);
        }, 2000);
      }
    } catch (e) {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
        setProgress(0);
      }, 2000);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center space-y-6 select-none p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/5">
      <div className="text-center font-['Outfit']">
        <h3 className="text-2xl font-bold text-white mb-2">₪{amount}</h3>
        <p className="text-sm text-white/50 tracking-widest uppercase">אימות ביומטרי לתשלום</p>
      </div>

      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Background Ripple */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-emerald-500/30 bg-emerald-500/5"
          animate={{ scale: status === 'holding' ? [1, 1.2, 1] : 1, opacity: status === 'holding' ? 1 : 0 }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Progress SVG Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="80"
            cy="80"
            r="76"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="4"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="76"
            fill="none"
            stroke={status === 'error' ? '#ef4444' : '#10b981'}
            strokeWidth="4"
            strokeDasharray={477} // 2 * pi * 76
            strokeDashoffset={477 - (477 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        </svg>

        {/* Main Sensor Button */}
        <motion.div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          animate={controls}
          initial={{ scale: 1, boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)" }}
          className="w-28 h-28 rounded-full bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer touch-none shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"
        >
          {status === "success" ? (
            <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,211,153,0.8)]" />
          ) : (
            <Fingerprint className={`w-12 h-12 transition-colors duration-300 ${status === 'holding' ? 'text-emerald-400' : 'text-white/60'}`} />
          )}
        </motion.div>
      </div>

      <div className="h-4">
        {status === "holding" && <p className="text-xs text-emerald-400/80 font-['Outfit'] animate-pulse">מחזיק...</p>}
        {status === "success" && <p className="text-xs text-emerald-400 font-['Outfit']">התשלום אושר בהצלחה</p>}
        {status === "error" && <p className="text-xs text-red-400 font-['Outfit']">שגיאה בתשלום</p>}
        {status === "idle" && <p className="text-xs text-white/30 font-['Outfit']">החזק כדי לאשר</p>}
      </div>
    </div>
  );
}
