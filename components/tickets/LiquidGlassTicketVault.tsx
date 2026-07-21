"use client";

import { useState, useTransition, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSecureTicket } from "@/app/actions/vaultActions";
import { useSubBass } from "@/lib/hooks/useSubBass";
import type { TicketVaultPayload } from "@/lib/validations/ticketVault";
import { UVScannerTicket } from "@/components/tickets/UVScannerTicket";
import { generateHologramThemeAction } from "@/app/actions/hologramActions";
import { HologramPass3D } from "@/components/tickets/HologramPass3D";
import { HologramTheme } from "@/lib/validations/hologramSchema";

interface LiquidGlassTicketVaultProps {
  bookingId: string;
  seatId: string;
  movieTitle?: string;
  concessions?: { id: string; name: string; quantity: number }[];
}

export function LiquidGlassTicketVault({ bookingId, seatId, movieTitle = "Unknown Movie", concessions = [] }: LiquidGlassTicketVaultProps) {
  const [isPending, startTransition] = useTransition();
  const [secureToken, setSecureToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isHologramPending, startHologramTransition] = useTransition();
  const [hologramTheme, setHologramTheme] = useState<HologramTheme | null>(null);
  const [showHologram, setShowHologram] = useState(false);

  const { triggerSubBass } = useSubBass();

  const handleGenerateTicket = () => {
    startTransition(async () => {
      const payload: TicketVaultPayload = { bookingId, seatId, concessions };
      const res = await generateSecureTicket(payload);
      
      if (res.success && res.data) {
        setSecureToken(res.data.signedToken);
      } else {
        setError(res.error || "שגיאה בהצפנת הנתונים");
      }
    });
  };

  const handleGenerateHologram = () => {
    if (hologramTheme) {
      setShowHologram(!showHologram);
      return;
    }
    startHologramTransition(async () => {
      const res = await generateHologramThemeAction(movieTitle);
      if (res.success && res.data) {
        setHologramTheme(res.data);
        setShowHologram(true);
      } else {
        setError(res.error || "שגיאה ביצירת נושא הולוגרמה");
      }
    });
  };

  useEffect(() => {
    if (secureToken) {
      triggerSubBass();
    }
  }, [secureToken, triggerSubBass]);

  return (
    <div dir="rtl" className="relative w-full max-w-lg mx-auto p-8 rounded-[32px] border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.5)] backdrop-blur-[50px] saturate-[250%] brightness-110 contrast-110 bg-neutral-950/40 overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 blur-[100px]"
        style={{
          background: `radial-gradient(circle at center, #FF1464 0%, transparent 65%)`,
          willChange: "opacity, background",
          transform: "translateZ(0)"
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="font-outfit text-3xl text-white font-bold tracking-tight mb-2" style={{ textShadow: "0 0 15px #FF1464" }}>
          כספת כרטיסים עיוורת
        </h2>
        <p className="font-inter text-white/70 text-base text-center mb-10">
          ברקוד מאובטח ומוצפן ב-HMAC-SHA256 ללא גישת לקוח
        </p>

        <AnimatePresence mode="wait">
          {!secureToken ? (
            <motion.div
              key="lock-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              className="flex flex-col items-center w-full"
            >
              <motion.button
                onClick={handleGenerateTicket}
                disabled={isPending}
                className="w-full py-5 rounded-2xl text-white font-outfit text-xl font-bold tracking-wide bg-white/10 hover:bg-white/20 border border-white/20 transition-colors disabled:opacity-50"
                style={{ boxShadow: "0 0 30px rgba(255,20,100,0.4)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isPending ? "מצפין נתונים..." : "פתח כרטיס מאובטח"}
              </motion.button>
              {error && <p className="mt-5 text-red-400 font-inter text-base">{error}</p>}
            </motion.div>
          ) : (
            <motion.div
              key="vault-state"
              initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full flex flex-col items-center justify-center gap-6"
              style={{ transformOrigin: "bottom", willChange: "transform, opacity" }}
            >
              <div className="w-full flex justify-between gap-4">
                <button 
                  onClick={handleGenerateHologram}
                  disabled={isHologramPending}
                  className="px-4 py-2 rounded-xl border border-blue-500/50 bg-blue-500/20 text-blue-100 font-inter text-sm hover:bg-blue-500/30 transition-colors"
                >
                  {isHologramPending ? "מייצר..." : (showHologram ? "חזור לברקוד" : "הצג כרטיס הולוגרמה 3D")}
                </button>
              </div>

              {showHologram && hologramTheme ? (
                <HologramPass3D theme={hologramTheme} movieTitle={movieTitle} />
              ) : (
                <UVScannerTicket 
                  secureToken={secureToken}
                  seatId={seatId}
                  bookingId={bookingId}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
