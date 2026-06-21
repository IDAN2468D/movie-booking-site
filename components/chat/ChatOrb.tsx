'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils/index';

interface ChatOrbProps {
  onClick: () => void;
  botState: 'idle' | 'listening' | 'processing' | 'speaking';
}

export default function ChatOrb({ onClick, botState }: ChatOrbProps) {
  // Determine shadow and gradient colors based on state
  const getOrbStyles = () => {
    switch (botState) {
      case 'listening':
        return {
          shadow: 'shadow-[0_0_40px_rgba(255,20,100,0.5)]',
          gradient: 'from-primary/30 to-pink-500/10',
          iconGlow: 'drop-shadow-[0_0_12px_rgba(255,20,100,0.8)]',
        };
      case 'processing':
        return {
          shadow: 'shadow-[0_0_40px_rgba(10,239,255,0.4)]',
          gradient: 'from-cyan-500/30 to-blue-500/20',
          iconGlow: 'drop-shadow-[0_0_12px_rgba(10,239,255,0.8)]',
        };
      case 'speaking':
        return {
          shadow: 'shadow-[0_0_45px_rgba(255,159,10,0.5)]',
          gradient: 'from-[#FF9F0A]/40 to-yellow-500/20',
          iconGlow: 'drop-shadow-[0_0_12px_rgba(255,159,10,0.8)]',
        };
      case 'idle':
      default:
        return {
          shadow: 'shadow-[0_10px_40px_rgba(255,20,100,0.25)]',
          gradient: 'from-primary/20 to-cyan-500/10',
          iconGlow: 'drop-shadow-[0_0_8px_rgba(255,20,100,0.5)]',
        };
    }
  };

  const styles = getOrbStyles();

  return (
    <motion.div
      layoutId="concierge-orb"
      drag
      dragMomentum={true}
      dragConstraints={{
        left: 20,
        right: typeof window !== 'undefined' ? window.innerWidth - 80 : 300,
        top: 20,
        bottom: typeof window !== 'undefined' ? window.innerHeight - 80 : 600,
      }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={
        botState === 'idle'
          ? {
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.05, 1],
            }
          : botState === 'listening'
          ? {
              scale: [1, 1.1, 1],
              opacity: 1,
            }
          : { opacity: 1, scale: 1 }
      }
      exit={{ opacity: 0, scale: 0 }}
      transition={
        botState === 'idle'
          ? {
              opacity: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
              scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
            }
          : botState === 'listening'
          ? {
              scale: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
            }
          : { duration: 0.3 }
      }
      className={cn(
        "w-16 h-16 rounded-full bg-white/5 border border-white/20 backdrop-blur-3xl flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing relative group overflow-hidden transition-shadow duration-500",
        styles.shadow
      )}
    >
      {/* Speaking Pulse Waves */}
      {botState === 'speaking' && (
        <>
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-[#FF9F0A]/40 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-[#FF9F0A]/20 pointer-events-none"
          />
        </>
      )}

      {/* Listening Fast Pulse Waves */}
      {botState === 'listening' && (
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-primary/50 pointer-events-none"
        />
      )}

      {/* Ambient inner glow */}
      <div className={cn("absolute inset-0 bg-gradient-to-tr opacity-70 group-hover:opacity-100 transition-opacity duration-500", styles.gradient)} />
      
      {/* Processing state: spinning outer highlight ring */}
      <motion.div
        animate={botState === 'processing' ? { rotate: 360 } : { rotate: 0 }}
        transition={botState === 'processing' ? { repeat: Infinity, duration: 1.5, ease: 'linear' } : { duration: 0.5 }}
        className={cn(
          "absolute inset-1 border border-transparent rounded-full",
          botState === 'processing' ? "border-t-cyan-400 border-r-cyan-400/50" : "border-white/10"
        )}
      />

      {/* Bot Icon */}
      <Bot className={cn("text-white w-7 h-7 relative z-10 transition-all duration-500", styles.iconGlow)} />
    </motion.div>
  );
}
