"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useUVAcoustics } from "@/hooks/useUVAcoustics";

interface UVScannerTicketProps {
  secureToken: string;
  seatId: string;
  bookingId: string;
}

export function UVScannerTicket({ secureToken, seatId, bookingId }: UVScannerTicketProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { startUVSound, stopUVSound, setUVIntensity } = useUVAcoustics();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for rotation
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  
  // Spotlight position
  const spotX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const spotY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);

    // Calculate UV intensity based on proximity to the center watermark
    const distFromCenter = Math.sqrt(Math.pow(normalizedX, 2) + Math.pow(normalizedY, 2));
    const intensity = Math.max(0, 1 - (distFromCenter * 2.5));
    setUVIntensity(intensity);
  };

  const handleMouseEnter = () => {
    startUVSound();
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    stopUVSound();
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[320px] aspect-[1/1.4] mx-auto perspective-1000"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full rounded-[24px] bg-white/5 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-[20px] overflow-hidden flex flex-col items-center justify-center relative preserve-3d"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Dynamic Specular Highlight (The UV Light) */}
        <motion.div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
          style={{
            background: useTransform(
              [spotX, spotY],
              ([x, y]: number[]) => `radial-gradient(circle 120px at ${x}% ${y}%, rgba(139, 92, 246, 0.6), transparent 80%)`
            )
          }}
        />

        {/* Hidden UV Watermark */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-color-dodge z-20"
          style={{
            opacity: useTransform(
              [mouseX, mouseY],
              ([x, y]: number[]) => {
                const dist = Math.sqrt(x*x + y*y);
                return Math.max(0, 1 - dist * 2.5); // Glows when mouse is near center
              }
            )
          }}
        >
          <div className="border-[4px] border-violet-500 rounded-lg px-6 py-2 rotate-[-15deg] shadow-[0_0_20px_rgba(139,92,246,0.8),inset_0_0_15px_rgba(139,92,246,0.8)] bg-violet-500/10 backdrop-blur-md">
            <span className="font-outfit font-black text-4xl tracking-widest text-violet-300 drop-shadow-[0_0_10px_rgba(139,92,246,1)]">
              VIP PASS
            </span>
          </div>
        </motion.div>

        {/* Physical Ticket Content */}
        <div className="relative z-30 p-6 bg-white/90 rounded-2xl shadow-inner flex flex-col items-center transform-gpu" style={{ transform: "translateZ(30px)" }}>
          <QRCodeSVG 
            value={secureToken} 
            size={180} 
            level="Q"
            fgColor="#000000"
            bgColor="transparent"
          />
          <div className="mt-6 text-center w-full">
            <p className="font-outfit font-bold text-black text-2xl">מושב {seatId}</p>
            <p className="font-inter text-black/60 text-sm mt-1 truncate w-full max-w-[200px] mx-auto" dir="ltr">
              הזמנה: {bookingId}
            </p>
          </div>
        </div>

        {/* Bottom edge reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400/50 to-transparent z-40" />
      </motion.div>
    </div>
  );
}
