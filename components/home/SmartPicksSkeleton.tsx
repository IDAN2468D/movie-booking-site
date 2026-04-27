'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 💎 Liquid Glass Skeleton for Smart Recommendations
 * Designed to "wow" the user while data is being processed.
 */
export default function SmartPicksSkeleton() {
  return (
    <section className="px-4 md:px-10 my-10 md:my-16 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 md:mb-10 text-right">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 w-12 h-12" />
          <div className="space-y-2">
            <div className="h-2 w-20 bg-primary/20 rounded-full" />
            <div className="h-6 w-32 bg-white/10 rounded-lg" />
          </div>
        </div>
        <div className="md:mr-auto w-32 h-6 bg-white/5 rounded-full" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-64 relative overflow-hidden">
            <div className="w-16 h-4 bg-orange-500/20 rounded-full mb-4" />
            <div className="h-6 w-3/4 bg-white/10 rounded-lg mb-3" />
            <div className="h-4 w-full bg-white/5 rounded-md mb-2" />
            <div className="h-4 w-5/6 bg-white/5 rounded-md mb-6" />
            
            <div className="mt-auto space-y-3">
              <div className="h-10 w-full bg-white/5 rounded-xl border border-white/5" />
              <div className="h-12 w-full bg-orange-500/5 rounded-xl border border-orange-500/10" />
            </div>
            
            {/* Shimmer effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
              animate={{ translateX: ['100%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        ))}
      </div>
      
      {/* Global Insight Skeleton */}
      <div className="mt-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 h-32 flex items-center gap-6">
        <div className="flex-1 space-y-3">
          <div className="h-2 w-24 bg-green-500/20 rounded-full" />
          <div className="h-4 w-2/3 bg-white/10 rounded-lg" />
        </div>
        <div className="w-40 h-12 bg-green-500/20 rounded-2xl" />
      </div>
    </section>
  );
}
