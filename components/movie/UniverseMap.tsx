'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Loader2, Sparkles, AlertCircle, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils/index';

export function UniverseMap({ movieId, movieTitle }: { movieId: number, movieTitle: string }) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const generateMap = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/svg-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, movieTitle })
      });
      const data = await res.json();
      if (data.success) {
        setSvgContent(data.svg);
      } else {
        setError("לא הצלחנו ליצור מפה ליקום הקולנועי. " + (data.error || ""));
      }
    } catch (err) {
      setError("שגיאת תקשורת עם שרת ה-AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "w-full transition-all duration-500",
      isFullscreen ? "fixed inset-0 z-[100] bg-black p-4 md:p-8" : "bg-white/[0.02] border border-white/5 rounded-[32px] mb-12 p-8 relative overflow-hidden"
    )} dir="rtl">
      
      {!isFullscreen && (
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Network className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-display font-bold text-white mb-1">Cinematic Universe Map</h3>
            <p className="text-sm text-gray-400">אינפוגרפיקה מבוססת AI של הקשרים הקולנועיים בסרט</p>
          </div>
        </div>
        
        {svgContent && (
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="relative z-10 min-h-[300px] flex flex-col items-center justify-center">
        {!svgContent && !isLoading && !error && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateMap}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5" />
            צור מפת יקום קולנועי (SVG)
          </motion.button>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-cyan-500/30 animate-pulse" />
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative z-10" />
            </div>
            <p className="text-cyan-300 font-bold text-xl animate-pulse">ממפה את היקום הקולנועי ומייצר אינפוגרפיקה (SVG)...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 text-red-400 p-6 bg-red-400/10 rounded-2xl border border-red-400/20">
            <AlertCircle className="w-10 h-10" />
            <p className="font-bold text-lg">{error}</p>
            <button 
              onClick={generateMap}
              className="px-6 py-2 bg-red-400/20 hover:bg-red-400/30 rounded-lg transition-colors mt-2 text-red-300"
            >
              נסה שוב
            </button>
          </div>
        )}

        {svgContent && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "w-full bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex items-center justify-center",
              isFullscreen ? "h-[calc(100vh-140px)]" : "h-[500px]"
            )}
          >
            {/* Render the raw SVG string safely */}
            <div 
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: svgContent }} 
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
