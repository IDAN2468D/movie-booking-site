"use client";

import { useState, useTransition, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSecureTicket } from "@/app/actions/vaultActions";
import { useSubBass } from "@/lib/hooks/useSubBass";
import type { TicketVaultPayload } from "@/lib/validations/ticketVault";

interface LiquidGlassTicketVaultProps {
  bookingId: string;
  seatId: string;
  concessions?: { id: string; name: string; quantity: number }[];
}

export function LiquidGlassTicketVault({ bookingId, seatId, concessions = [] }: LiquidGlassTicketVaultProps) {
  const [isPending, startTransition] = useTransition();
  const [secureToken, setSecureToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
              className="p-8 bg-white rounded-[24px] shadow-[0_0_50px_rgba(255,255,255,0.3)] flex flex-col items-center"
              style={{ transformOrigin: "bottom", willChange: "transform, opacity" }}
            >
              <QRCodeSVG 
                value={secureToken} 
                size={240} 
                level="Q"
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
              <div className="mt-6 text-center w-full">
                <p className="font-outfit font-bold text-black text-2xl">מושב {seatId}</p>
                <p className="font-inter text-black/60 text-sm mt-1 truncate w-full max-w-[200px] mx-auto text-center" dir="ltr">
                  הזמנה: {bookingId}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
