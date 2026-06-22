'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InviteButtonProps {
  roomId: string;
}

export default function CineSyncInviteButton({ roomId }: InviteButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const inviteUrl = `${window.location.origin}/?lounge=${roomId}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-full text-right group active:scale-95"
      dir="rtl"
    >
      <div className="flex flex-col text-right">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">קישור הזמנה מהיר</span>
        <span className="text-xs font-bold text-white font-mono mt-0.5">{roomId}</span>
      </div>
      
      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-all">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Check className="w-4 h-4 text-green-400" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Copy className="w-4 h-4 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
