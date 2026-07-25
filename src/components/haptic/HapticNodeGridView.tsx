'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HapticNode } from '@/lib/validations/haptic';
import { Activity, Zap, Radio, Volume2 } from 'lucide-react';

interface HapticNodeGridViewProps {
  nodes: HapticNode[];
  activeNodeId: string | null;
  onNodeClick: (node: HapticNode) => void;
}

export const HapticNodeGridView: React.FC<HapticNodeGridViewProps> = ({
  nodes,
  activeNodeId,
  onNodeClick,
}) => {
  return (
    <div className="relative w-full p-6 rounded-3xl bg-neutral-950/40 backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden">
      {/* Background visual aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">מטריצת צמתי תהודה (3D Node Grid)</h3>
            <p className="text-xs text-slate-400 font-inter">לחץ על צומת להפעלת תדר סאב-באס ופולס הפטי</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-bold">
          120Hz GPU
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        {nodes.map((node) => {
          const isActive = activeNodeId === node.id;
          return (
            <motion.button
              key={node.id}
              onClick={() => onNodeClick(node)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 transform-gpu ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_30px_rgba(56,189,248,0.4)]'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-sm pointer-events-none"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div className={`p-3 rounded-xl border ${isActive ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                {node.frequency < 100 ? (
                  <Radio className="w-5 h-5" />
                ) : node.frequency < 400 ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <Zap className="w-5 h-5" />
                )}
              </div>

              <div className="text-center">
                <div className="font-bold text-sm font-outfit text-white">{node.label}</div>
                <div className="text-[11px] font-mono text-cyan-400/80 mt-0.5">{node.frequency} Hz</div>
              </div>

              {isActive && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-3 right-3" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
