'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '@/hooks/use-magnetic';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  'aria-label'?: string;
  title?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = "", 
  onClick, 
  type = "button",
  disabled = false,
  'aria-label': ariaLabel,
  title,
}) => {
  const { ref, x, y } = useMagnetic<HTMLButtonElement>(0.3);

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className={`relative ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
};
