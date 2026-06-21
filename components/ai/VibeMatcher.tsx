'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Loader2, Sparkles, X, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils/index';
import ReactMarkdown from 'react-markdown';

export default function VibeMatcher() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const analyzeVibe = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imagePreview }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.recommendation);
      } else {
        setResult("מצטערים, לא הצלחנו לנתח את התמונה. " + (data.error || ""));
      }
    } catch {
      setResult("שגיאת תקשורת עם מנוע ה-AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto liquid-glass rounded-3xl p-8 border border-white/10" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          Cinematic Vibe Matcher
        </h2>
        <p className="text-gray-400">תעלה תמונה של הסביבה שלך, וה-AI יתאים לך סרט עם בדיוק אותו ה-Vibe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Zone */}
        <div 
          className={cn(
            "relative aspect-[4/5] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer",
            isDragActive ? "border-primary bg-primary/10" : "border-white/20 hover:border-white/40 bg-white/5",
            imagePreview ? "border-transparent" : ""
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <AnimatePresence mode="wait">
            {imagePreview ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setImagePreview(null); setResult(null); }}
                  className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 text-center p-6"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <UploadCloud className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">גרור תמונה לכאן</p>
                  <p className="text-gray-500 text-sm mt-1">או לחץ כדי לבחור קובץ מהמכשיר</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Area */}
        <div className="flex flex-col h-[500px]">
          {imagePreview && !result && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-grow flex items-center justify-center"
            >
              <button 
                onClick={analyzeVibe}
                className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-pink-600 text-white font-bold text-xl hover:shadow-[0_0_40px_rgba(255,20,100,0.5)] transition-all duration-300 hover:scale-[1.02]"
              >
                נתח אווירה ומצא סרט
              </button>
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-grow flex flex-col items-center justify-center gap-4 h-full"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-primary/30 animate-pulse" />
                <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
              </div>
              <p className="text-primary font-medium animate-pulse text-xl">מפענח את התמונה...</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-grow glass p-6 rounded-2xl overflow-y-auto custom-scrollbar prose prose-invert prose-p:leading-relaxed-hebrew h-full"
            >
              <ReactMarkdown>{result}</ReactMarkdown>
            </motion.div>
          )}
          
          {/* Empty State */}
          {!imagePreview && (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500 h-full border border-white/5 rounded-2xl bg-white/[0.02]">
              <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
              <p>התמונה שלך תופיע כאן</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
