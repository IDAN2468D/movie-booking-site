'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumLogo } from '@/components/ui/PremiumLogo';

export default function SplashPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Wait 2.5 seconds, then start fade out, then redirect
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        router.push('/');
      }, 500); // 500ms for the exit animation to finish
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] bg-[#051424] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          >
            <PremiumLogo size="hero" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
