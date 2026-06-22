'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Video } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
}

export default function TrailerGeneratorModal({ isOpen, onClose, movieTitle }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Simulate video generation progress
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            // Example high-quality cinematic video placeholder
            setGeneratedVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
            return 100;
          }
          return p + 2; // ~5 seconds simulation
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const startGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideo(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-right" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="absolute top-4 left-4 z-10">
              <button onClick={onClose} className="p-3 bg-black/50 hover:bg-white/10 rounded-full backdrop-blur-md text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 relative">
                <Video className="w-10 h-10 text-primary relative z-10" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              </div>

              <h2 className="text-3xl font-display font-black text-white mb-2 tracking-tighter">
                אין טריילר זמין
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                לסרט <span className="text-white font-bold">{movieTitle}</span> לא נמצא טריילר רשמי. האם תרצה שה-AI ייצר עבורך טריילר אווירה קצר באמצעות מודל הוידאו שלנו?
              </p>

              {!isGenerating && !generatedVideo && (
                <button
                  onClick={startGeneration}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-cyan-500 text-black font-black text-xl hover:shadow-[0_0_40px_rgba(20,255,200,0.4)] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-6 h-6" />
                  צור טריילר קולנועי מבוסס AI
                </button>
              )}

              {isGenerating && (
                <div className="space-y-6">
                  <div className="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      className="absolute top-0 right-0 h-full bg-gradient-to-l from-primary to-cyan-500 shadow-[0_0_20px_rgba(20,255,200,0.5)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-3 text-primary font-bold text-lg animate-pulse">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    מרנדר וידאו ותאורה קולנועית מבוססת AI... ({progress}%)
                  </div>
                  <p className="text-sm text-gray-500">בסביבת ייצור (Production) מופעל באמצעות מודל Veo / Imagen 3</p>
                </div>
              )}

              {generatedVideo && (
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(20,255,200,0.2)] bg-black">
                  <video 
                    src={generatedVideo} 
                    controls 
                    autoPlay 
                    muted
                    playsInline
                    className="w-full h-full aspect-video object-cover"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
