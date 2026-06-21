'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Camera, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAvatarGenerated: (url: string) => void;
}

const GENRES = [
  { id: 'סייברפאנק', label: 'סייברפאנק (ניאון)' },
  { id: 'נואר (שחור-לבן)', label: 'נואר (שחור-לבן)' },
  { id: 'פנטזיה', label: 'פנטזיה אפית' },
  { id: 'גיבורי על', label: 'גיבורי על' },
];

export default function AvatarGeneratorModal({ isOpen, onClose, onAvatarGenerated }: Props) {
  const [selectedGenre, setSelectedGenre] = useState('סייברפאנק');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre: selectedGenre })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedUrl(data.imageUrl);
      }
    } catch (err) {
      console.error('Failed to generate avatar');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedUrl) {
      onAvatarGenerated(generatedUrl);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-right" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">יצירת אווטאר AI קולנועי</h3>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {!generatedUrl ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">בחר סגנון קולנועי</label>
                    <div className="grid grid-cols-2 gap-3">
                      {GENRES.map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() => setSelectedGenre(genre.id)}
                          className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                            selectedGenre === genre.id
                              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,20,100,0.2)]'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {genre.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-pink-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(255,20,100,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        יוצר קסם קולנועי...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        צור פרופיל חדש
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary shadow-[0_0_30px_rgba(255,20,100,0.3)]">
                    <img src={generatedUrl} alt="Generated Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-4 w-full">
                    <button
                      onClick={() => setGeneratedUrl(null)}
                      className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
                    >
                      נסה שוב
                    </button>
                    <button
                      onClick={handleApply}
                      className="flex-1 py-3 rounded-xl bg-primary text-black font-black hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      החל תמונה
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
