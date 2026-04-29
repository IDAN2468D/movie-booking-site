'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EffectIDChipProps {
  id: string;
  className?: string;
}

/**
 * EffectIDChip - The standardized copy-chip UI pattern used for interacting 
 * with design identifiers and video effect catalogs.
 */
export const EffectIDChip = ({ id, className = '' }: EffectIDChipProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative inline-flex items-center gap-2 px-3 py-1.5 
        bg-[#0A0A0A] border border-white/10 rounded-lg
        font-mono text-[11px] tracking-tight transition-all duration-200
        hover:border-[#FF1464]/40 hover:bg-[#111111]
        ${copied ? 'border-[#FF1464] bg-[#FF1464]/10' : ''}
        ${className}
      `}
    >
      {/* Icon */}
      <span className={`
        text-[10px] transition-colors duration-200
        ${copied ? 'text-white' : 'text-[#FF1464]'}
      `}>
        {copied ? '✓' : '◐'}
      </span>

      {/* ID Text */}
      <span className={`
        transition-colors duration-200
        ${copied ? 'text-white' : 'text-[#E5FF00] group-hover:text-white'}
      `}>
        {id}
      </span>

      {/* "Copied" Tooltip */}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#FF1464] text-white text-[10px] font-black uppercase tracking-widest rounded shadow-xl pointer-events-none whitespace-nowrap z-50"
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>

      {/* Subtle glow on hover */}
      <span className="absolute inset-0 rounded-lg bg-[#FF1464]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.button>
  );
};
