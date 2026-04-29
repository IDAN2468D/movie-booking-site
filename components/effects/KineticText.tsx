'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface KineticTextProps {
  text: string;
  className?: string;
  stagger?: number;
  once?: boolean;
  tag?: React.ElementType;
  delay?: number;
}

export const KineticText: React.FC<KineticTextProps> = ({ 
  text, 
  className = "", 
  stagger = 0.02,
  once = true,
  tag = "div",
  delay = 0
}) => {
  const isRTL = /[\u0590-\u05FF]/.test(text);
  const words = text.split(" ");
  
  // Fix: Correctly handle dynamic tags for framer-motion without creating components during render
  const Tag = React.useMemo(() => {
    if (typeof tag === 'string') {
      const motionTag = (motion as unknown as Record<string, React.ElementType>)[tag];
      return motionTag || motion.div;
    }
    return motion(tag);
  }, [tag]);

  const container: Variants = React.useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }), [stagger, delay]);

  const child: Variants = React.useMemo(() => ({
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
      },
    },
    hidden: {
      opacity: 0,
      y: "100%",
      rotateX: 45,
      scale: 0.9,
    },
  }), []);

  return React.createElement(
    Tag,
    {
      style: { 
        overflow: "hidden", 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "0.25em",
        direction: isRTL ? 'rtl' : 'ltr'
      },
      variants: container,
      initial: "hidden",
      whileInView: "visible",
      viewport: { once, amount: 0.1 },
      className: className
    },
    words.map((word, wordIndex) => (
      <span 
        key={wordIndex} 
        style={{ display: "inline-block", whiteSpace: "nowrap" }}
      >
        {word.split("").map((char, charIndex) => (
          <motion.span
            key={charIndex}
            variants={child}
            style={{ display: "inline-block" }}
            className="gpu-accelerated"
          >
            {char}
          </motion.span>
        ))}
      </span>
    ))
  );
};
