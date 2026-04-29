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
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = "", 
  onClick, 
  type = "button",
  disabled = false
}) => {
  const { ref, x, y } = useMagnetic(0.3);

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`relative ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
};
