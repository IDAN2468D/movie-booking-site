'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GatewayFeatureData } from '@/lib/validations/gatewaySchema';

interface FeaturesGridProps {
  features: GatewayFeatureData[];
}

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4 mt-12 pb-24">
      {features.map((feature) => (
        <motion.div
          key={feature.id}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] p-6 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] group transform-gpu"
          style={{ willChange: 'transform' }}
        >
          {/* Subtle inner hover glow */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8A5CFF]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" 
          />
          
          <div className="flex items-start gap-4 flex-row-reverse text-right">
            <div 
              className="p-3 bg-white/5 rounded-xl border border-white/10 text-[#8A5CFF] group-hover:text-white group-hover:bg-[#8A5CFF]/20 transition-all duration-300 transform-gpu" 
              style={{ willChange: 'transform' }}
            >
              {feature.iconSvg === 'brain' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                  />
                </svg>
              )}
              {feature.iconSvg === 'ticket' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" 
                  />
                </svg>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-between h-full min-h-[120px]">
              <div>
                <h3 className="font-semibold text-lg text-white mb-2 font-display">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
              
              {feature.callToAction && (
                <div className="mt-6 flex justify-end">
                  <Link
                    href={feature.callToAction.href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 text-white/90 hover:text-white transition-all duration-300 text-sm font-medium transform-gpu"
                    style={{ willChange: 'transform' }}
                  >
                    <span>{feature.callToAction.label}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
