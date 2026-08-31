'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dna, RefreshCw, Sparkles } from 'lucide-react';
import { CineDnaNode, CineDnaNodeType, CineDnaGraphData } from '@/lib/schemas/cineDna.schema';
import { fetchCineDnaGraph } from '@/lib/actions/cineDnaActions';
import { CineDnaCanvas } from './CineDnaCanvas';
import { DnaNodeCard } from './DnaNodeCard';
import { DnaFilterControls } from './DnaFilterControls';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

interface CineDnaModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
  movieTitle?: string;
}

export function CineDnaModal({ isOpen, onClose, movieId, movieTitle }: CineDnaModalProps) {
  const [data, setData] = useState<CineDnaGraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<CineDnaNode | null>(null);
  const [activeFilters, setActiveFilters] = useState<CineDnaNodeType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoading(true);

    fetchCineDnaGraph({ movieId, filters: activeFilters })
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setData(res.data);
          setSelectedNode(res.data.nodes[0] || null);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, movieId, activeFilters]);

  const handleToggleFilter = (type: CineDnaNodeType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[36px] bg-black/70 border border-cyan-500/30 shadow-[0_25px_70px_rgba(6,182,212,0.25)] p-6 md:p-10 space-y-6"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Dna size={26} className="animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white font-rubik flex items-center gap-2">
                  CineDNA Graph Explorer
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                    v4.0 Pro
                  </span>
                </h2>
                <p className="text-xs text-off-white/60 font-medium">
                  מיפוי גנטי רב-ממדי: {movieTitle || data?.coreMovieTitle || 'סרט נבחר'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-transform hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Filter Bar */}
          <DnaFilterControls activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />

          {/* Main Content Area */}
          {isLoading ? (
            <div className="h-[480px] flex flex-col items-center justify-center space-y-4">
              <LoadingIndicator variant="spinner" size={36} color="#06B6D4" label="מפענח גנים קולנועיים..." />
            </div>
          ) : data ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <CineDnaCanvas
                  nodes={data.nodes}
                  edges={data.edges}
                  onSelectNode={(node) => setSelectedNode(node)}
                />
              </div>
              <div className="space-y-4">
                <DnaNodeCard node={selectedNode} />
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-off-white/40">
              לא נמצאו נתוני גנום עבור סרט זה
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
