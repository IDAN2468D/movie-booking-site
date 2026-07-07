'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BrainCircuit, Quote } from 'lucide-react';
import { useEffect } from 'react';

interface NeuralFlashbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string | null;
  date: string | null;
}

export function NeuralFlashbackModal({ isOpen, onClose, movieId, date }: NeuralFlashbackModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const quotes: Record<string, string> = {
    'Inception': "You mustn't be afraid to dream a little bigger, darling.",
    'Interstellar': "Love is the one thing that transcends time and space.",
    'Dune': "I must not fear. Fear is the mind-killer.",
    'The Matrix': "There is no spoon.",
    'Blade Runner': "All those moments will be lost in time, like tears in rain."
  };

  const quote = movieId && quotes[movieId] ? quotes[movieId] : "Cinematic memory successfully extracted.";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-[40px] saturate-[150%] pointer-events-auto"
          dir="ltr"
        >
          {/* Hardware-accelerated Neural Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
             <div className="absolute w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
             <div className="absolute w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }} />
             
             {/* Floating Neural Shards */}
             {[...Array(5)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{
                   y: [0, -20, 0],
                   rotate: [0, 5, -5, 0],
                   scale: [1, 1.05, 1],
                   opacity: [0.3, 0.6, 0.3]
                 }}
                 transition={{
                   duration: 4 + i,
                   repeat: Infinity,
                   ease: "easeInOut",
                   delay: i * 0.5
                 }}
                 className="absolute w-32 h-32 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl"
                 style={{
                   left: `${20 + i * 15}%`,
                   top: `${20 + (i % 3) * 20}%`,
                 }}
               />
             ))}
          </div>

          <motion.div 
            initial={{ scale: 0.8, y: 50, rotateX: 20 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a]/60 backdrop-blur-[40px] border border-white/[0.12] rounded-[40px] p-10 md:p-16 text-center shadow-[0_50px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3),0_0_80px_rgba(255,255,255,0.05)] transform-gpu will-change-transform overflow-hidden"
          >
            {/* Animated Conic Border Glow */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.8)_360deg)]"
              />
            </div>
            
            <div className="absolute inset-[1px] rounded-[39px] bg-[#0a0a0a]/80 backdrop-blur-2xl z-0 pointer-events-none" />
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors z-20"
            >
              <X size={18} />
            </button>

            <div className="mx-auto w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-8 border border-primary/30 shadow-[0_0_30px_rgba(255,159,10,0.3)] relative z-10">
              <BrainCircuit className="text-primary w-10 h-10 animate-pulse" />
            </div>

            <div className="mb-2 relative z-10">
              <span className="text-[10px] font-inter font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(255,159,10,0.2)]">
                Memory Extracted: {date}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 mb-10 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] relative z-10">
              {movieId}
            </h2>

            <div className="relative z-10 px-6">
              <Quote className="absolute -top-6 -left-2 w-12 h-12 text-white/10 -rotate-12" />
              <p className="text-xl md:text-3xl font-inter font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-cyan-100/60 italic leading-relaxed drop-shadow-md">
                "{quote}"
              </p>
              <Quote className="absolute -bottom-8 -right-2 w-12 h-12 text-white/10 rotate-12" />
            </div>

            {/* Neural scanline effect */}
            <div className="absolute inset-0 pointer-events-none z-0">
               <motion.div 
                 animate={{ y: ['-100%', '200%'] }}
                 transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                 className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[1px]"
               />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
