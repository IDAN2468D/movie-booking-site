'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { processOmniQueryAction } from '@/app/actions/gatewayActions';
import { OmniResponse } from '@/lib/validations/gatewaySchema';

const initialState: OmniResponse = {
  success: false,
};

export default function OmniBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [state, formAction, isPending] = useActionState(processOmniQueryAction, initialState);

  useEffect(() => {
    if (state.success && state.data?.redirectUrl) {
      router.push(state.data.redirectUrl);
    }
  }, [state, router]);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4">
      {/* AI Glow Background Aura */}
      <AnimatePresence>
        {(isFocused || isPending) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 0.15, scale: 1.02 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[#8A5CFF] blur-2xl rounded-full transform-gpu pointer-events-none"
            style={{ willChange: 'transform, opacity' }}
          />
        )}
      </AnimatePresence>

      <form action={formAction} className="relative w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required
            placeholder="חפש סרט, כרטיס או גלה לפי מצב רוח..."
            className="w-full px-8 py-5 text-right text-white placeholder-white/30 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full focus:outline-none focus:border-[#8A5CFF]/40 focus:bg-white/10 transition-all duration-300 pr-16 pl-24 shadow-[inset_0_0_12px_rgba(255,255,255,0.02)]"
            disabled={isPending}
            dir="rtl"
          />

          <div className="absolute left-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform active:scale-95 bg-[#8A5CFF] text-white hover:bg-[#7245e5] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(138,92,255,0.3)] transform-gpu"
              style={{ willChange: 'transform' }}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full transform-gpu"
                    style={{ willChange: 'transform' }}
                  />
                  <span>מעבד...</span>
                </div>
              ) : (
                <span>גלה</span>
              )}
            </button>
          </div>
        </div>
      </form>

      {state.error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-3 text-right pr-6 font-medium tracking-wide"
        >
          {state.error}
        </motion.p>
      )}
    </div>
  );
}
