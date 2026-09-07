'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Film, Users, DollarSign } from 'lucide-react';
import { playCockpitTick } from './LiquidCockpitAudio';

interface WaveCardData {
  id: string;
  title: string;
  category: string;
  value: string;
  delta: string;
  isPositive: boolean;
  sparklinePoints: string;
}

const DEFAULT_WAVES: WaveCardData[] = [
  {
    id: 'box-office',
    title: 'מדד קופות ראשי (Box Office)',
    category: 'REVENUE',
    value: '₪148,920',
    delta: '+8.4% (היום)',
    isPositive: true,
    sparklinePoints: 'M0,80 L20,70 L40,75 L60,40 L80,45 L100,15',
  },
  {
    id: 'occupancy',
    title: 'שיעור תפוסת אולמות ארצי',
    category: 'OCCUPANCY',
    value: '74.2%',
    delta: '+12.1% (פריים טיים)',
    isPositive: true,
    sparklinePoints: 'M0,85 L20,65 L40,60 L60,35 L80,25 L100,10',
  },
  {
    id: 'cancellation',
    title: 'שיעור ביטולים וחריגות',
    category: 'RISK',
    value: '1.8%',
    delta: '-0.4% (יציב)',
    isPositive: false,
    sparklinePoints: 'M0,20 L20,30 L40,25 L60,55 L80,50 L100,85',
  },
];

export const ERPMarketWaveCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full" dir="rtl">
      {DEFAULT_WAVES.map((wave) => (
        <motion.div
          key={wave.id}
          whileHover={{ y: -3 }}
          onClick={() => playCockpitTick(820)}
          className="relative overflow-hidden rounded-[28px] bg-black/50 border border-white/10 p-6 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] group cursor-pointer transition-all hover:border-white/25"
        >
          {/* Top specular highlight edge */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">{wave.title}</h3>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest font-black border ${
                wave.isPositive
                  ? 'bg-[#00FFA3]/10 text-[#00FFA3] border-[#00FFA3]/30'
                  : 'bg-[#FF2E5B]/10 text-[#FF2E5B] border-[#FF2E5B]/30'
              }`}
            >
              {wave.category}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between relative z-10">
            <div>
              <span className="text-3xl font-black text-white font-['Outfit'] tracking-tight">{wave.value}</span>
              <p
                className={`mt-1 text-xs font-bold flex items-center gap-1 ${
                  wave.isPositive ? 'text-[#00FFA3]' : 'text-[#FF2E5B]'
                }`}
              >
                {wave.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{wave.delta}</span>
              </p>
            </div>
          </div>

          {/* Sparkline Graphic Area */}
          <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id={`grad-${wave.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={wave.isPositive ? '#00FFA3' : '#FF2E5B'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={wave.isPositive ? '#00FFA3' : '#FF2E5B'} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={`${wave.sparklinePoints} L100,100 L0,100 Z`}
                fill={`url(#grad-${wave.id})`}
              />
              <path
                d={wave.sparklinePoints}
                fill="none"
                stroke={wave.isPositive ? '#00FFA3' : '#FF2E5B'}
                strokeWidth="2.5"
                className="transform-gpu"
              />
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
