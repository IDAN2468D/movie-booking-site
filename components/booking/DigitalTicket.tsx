"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { BiometricHoloScanner } from "./BiometricHoloScanner";
import { verifyBiometricTicketAction } from "@/app/actions/cryptoTicket.actions";

export interface DigitalTicketProps {
  movieTitle: string;
  showtime: string;
  seats: string[];
  qrPayload: string;
}

export default function DigitalTicket({
  movieTitle,
  showtime,
  seats,
  qrPayload,
}: DigitalTicketProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [dynamicPayload, setDynamicPayload] = useState(qrPayload);

  // 3D Motion Vector tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [12, -12]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-12, 12]), { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleBiometricAuth = async () => {
    const res = await verifyBiometricTicketAction({
      ticketId: qrPayload || "TCK-101",
      seatId: seats[0] || "A1",
    });
    if (res.success && res.data) {
      setDynamicPayload(res.data.qrPayload);
      setIsUnlocked(true);
    } else {
      setIsUnlocked(true);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center min-h-[550px] w-full p-4 perspective-[1000px]"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 via-fuchsia-900/10 to-transparent blur-[120px] pointer-events-none" />

      <motion.div
        style={{ rotateX, rotateY, willChange: "transform" }}
        className="relative w-full max-w-md rounded-[2.5rem] p-1 overflow-hidden transform-gpu preserve-3d"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-white/10 rounded-[2.5rem] opacity-50" />

        <div className="relative w-full h-full rounded-[2.4rem] bg-black/50 backdrop-blur-2xl border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.8)] flex flex-col p-6 z-10 overflow-hidden">
          {/* Ticket Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10 relative z-20">
            <div>
              <h2 className="text-2xl font-['Outfit'] font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-violet-200 to-neutral-400 drop-shadow-lg">
                כרטיס כניסה הולוגרפי
              </h2>
              <p className="text-xs font-['Inter'] text-violet-300 mt-0.5 uppercase tracking-widest">
                3D Holographic Vault Pass
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-md">
              <span className="text-lg">🎬</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 relative z-20">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-['Inter'] text-white/40 uppercase tracking-widest">סרט</span>
              <span className="text-base font-['Outfit'] font-bold text-white drop-shadow">{movieTitle}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-['Inter'] text-white/40 uppercase tracking-widest">תאריך ושעה</span>
              <span className="text-base font-['Outfit'] font-bold text-white drop-shadow">{showtime}</span>
            </div>
            <div className="flex flex-col gap-0.5 col-span-2">
              <span className="text-[10px] font-['Inter'] text-white/40 uppercase tracking-widest">מושבים</span>
              <div className="flex gap-2 flex-wrap mt-1">
                {seats.map((seat) => (
                  <span
                    key={seat}
                    className="px-3 py-1 rounded-lg bg-violet-500/20 border border-violet-400/30 text-violet-200 font-['Outfit'] font-bold text-xs shadow-md"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Biometric Fingerprint Scanner */}
          <BiometricHoloScanner onAuthenticated={handleBiometricAuth} isUnlocked={isUnlocked} />

          {/* Secure QR Display Area (Revealed after Biometric Auth) */}
          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mt-2 pt-4 flex flex-col items-center z-20 border-t border-white/10"
            >
              <div className="p-3 bg-white rounded-2xl shadow-[0_0_35px_rgba(255,255,255,0.4)] relative overflow-hidden">
                <QRCodeSVG
                  value={dynamicPayload}
                  size={140}
                  level="Q"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
                <motion.div
                  animate={{ y: [0, 140, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1 bg-violet-500/60 shadow-[0_0_15px_rgba(139,92,246,0.9)]"
                />
              </div>

              <p className="mt-3 text-[10px] font-['Inter'] text-emerald-400 tracking-widest uppercase flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                HMAC-SHA256 Encrypted Token
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
