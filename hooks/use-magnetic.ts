'use client';

import { useRef, useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * useMagnetic Hook
 * Creates a magnetic pull effect towards the cursor.
 * @param strength - How strong the pull is (0 to 1)
 * @param springConfig - Custom spring configuration
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.5, springOptions = { damping: 15, stiffness: 150, mass: 0.1 }) {
  const ref = useRef<T>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      // Only pull if within a certain range (e.g., 100px)
      const proximity = 100;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < proximity) {
        x.set(distanceX * strength);
        y.set(distanceY * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const element = ref.current;
    window.addEventListener('mousemove', handleMouseMove);
    element?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, x, y]);

  return { ref, x: springX, y: springY };
}
