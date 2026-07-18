'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HologramSeatOverlayProps {
  status: 'inviting' | 'pending' | 'locked';
  timeLeft: number;
  onConfirmMock?: () => void;
}

export const HologramSeatOverlay: React.FC<HologramSeatOverlayProps> = ({ status, timeLeft, onConfirmMock }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 z-30 flex items-center justify-center rounded-[10px] overflow-hidden pointer-events-auto"
    >
      {/* Liquid Glass Blur Layer */}
      <div className="absolute inset-0 backdrop-blur-[12px] bg-[#8A5CFF]/10" />

      {/* Hologram Plasma Edge */}
      <motion.div 
        animate={{
          boxShadow: [
            "inset 0 0 10px rgba(138, 92, 255, 0.4)",
            "inset 0 0 20px rgba(138, 92, 255, 0.8)",
            "inset 0 0 10px rgba(138, 92, 255, 0.4)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 border-[1.5px] border-[#8A5CFF]/60 rounded-[10px]"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-1" dir="rtl">
        {status === 'inviting' && (
          <span className="text-[#8A5CFF] text-[8px] font-bold tracking-wider animate-pulse">הזמן חבר</span>
        )}
        
        {status === 'pending' && (
          <>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 rounded-full border-t border-[#8A5CFF] border-r border-transparent opacity-80 mb-1"
            />
            <span className="text-white text-[7px] font-mono opacity-80">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
            {/* Mock Confirm Button for Demo purposes */}
            <button 
              onClick={(e) => { e.stopPropagation(); onConfirmMock?.(); }}
              className="mt-1 px-1 py-0.5 bg-[#8A5CFF]/30 hover:bg-[#8A5CFF]/50 text-white text-[6px] rounded border border-[#8A5CFF]/50"
            >
              אשר
            </button>
          </>
        )}

        {status === 'locked' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-[#00FFA3] text-lg leading-none">✔️</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
