'use client';

import React, { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';

interface ScrollStepTriggerProps {
  children: React.ReactNode;
  index: number;
  onVisible: (index: number) => void;
}

export function ScrollStepTrigger({ children, index, onVisible }: ScrollStepTriggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    margin: '-45% 0px -45% 0px',
  });

  useEffect(() => {
    if (isInView) {
      onVisible(index);
    }
  }, [isInView, index, onVisible]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 transform translate-x-0' : 'opacity-25 transform translate-x-2'
      }`}
    >
      {children}
    </div>
  );
}
