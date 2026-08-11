'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * ⚡ Ultra-Smooth 120Hz GPU Page Transition.
 * Uses GPU-accelerated opacity & translateZ without heavy blur filters
 * to eliminate navigation flickering and repaints when going back/forward.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      className="w-full h-full [transform:translateZ(0)] will-change-[opacity]"
    >
      {children}
    </motion.div>
  );
}
