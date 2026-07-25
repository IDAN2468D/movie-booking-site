'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, X } from 'lucide-react';
import { CineResonanceContainer } from './CineResonanceContainer';

export const FloatingResonanceTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Side Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full border border-cyan-400/30 bg-neutral-950/80 backdrop-blur-2xl shadow-[0_0_25px_rgba(56,189,248,0.4)] text-white font-sans text-xs font-bold hover:border-cyan-300 transition-all group"
        dir="rtl"
      >
        <div className="relative flex items-center justify-center">
          <Volume2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <span className="tracking-wide">כיול אקוסטי</span>
      </motion.button>

      {/* Floating Side Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
              >
                <X className="w-4 h-4" />
              </button>

              <CineResonanceContainer />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
