'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ShimmerPosterProps {
  src: string;
  alt: string;
  className?: string;
}

export const ShimmerPoster: React.FC<ShimmerPosterProps> = ({ src, alt, className = "" }) => {
  return (
    <div className={`relative group overflow-hidden rounded-[24px] ${className}`}>
      {/* Base Image */}
      <Image 
        src={src} 
        alt={alt} 
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Aggregate Shimmer Layer */}
      <div className="absolute inset-0 shimmer-mask opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Glass Overlay (on hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          className="liquid-glass p-4 text-center"
        >
          <span className="text-sm font-bold tracking-widest text-primary uppercase">View Details</span>
        </motion.div>
      </div>
      
      {/* Premium Border (Glass) */}
      <div className="absolute inset-0 border border-white/10 rounded-[24px] pointer-events-none group-hover:border-white/30 transition-colors duration-300" />
    </div>
  );
};
