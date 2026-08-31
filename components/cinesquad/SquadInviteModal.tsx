'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, QrCode, Share2, Users } from 'lucide-react';

interface SquadInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  movieTitle: string;
}

export function SquadInviteModal({ isOpen, onClose, roomId, movieTitle }: SquadInviteModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cinesquad/${roomId}` : `https://cinepulse.com/cinesquad/${roomId}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md p-6 md:p-8 rounded-3xl bg-black/70 border border-primary/30 shadow-[0_20px_60px_rgba(255,159,10,0.2)] text-right space-y-6"
          dir="rtl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-primary font-black">
              <Users size={22} />
              <h3 className="text-xl font-rubik text-white">הזמנת חברים לסקוואד</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-off-white/80 font-medium">
              הזמן את החברים שלך לצפייה משותפת בסרט <span className="text-primary font-bold">{movieTitle}</span>.
              הם יוכלו לבחור מושב לידך ולשלם את חלקם ישירות!
            </p>
          </div>

          {/* Link Box */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-white font-mono outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-primary text-black font-black text-xs flex items-center gap-1 hover:bg-primary/90 transition-all shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'הועתק!' : 'העתק קישור'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-300">
              <QrCode size={16} />
              <span>סריקה מהירה עם הנייד</span>
            </div>
            <p className="text-[11px] text-off-white/50">קוד חדר: {roomId}</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
