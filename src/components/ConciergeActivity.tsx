"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useExecutionState, useConciergeActiveTask } from '@/lib/store/conciergeStore';
import { Settings, Cpu, Loader, CheckCircle } from 'lucide-react';

export const ConciergeActivity = () => {
  const executionState = useExecutionState();
  const activeTask = useConciergeActiveTask();

  if (executionState === 'idle') return null;

  const getStatusConfig = () => {
    switch (executionState) {
      case 'planning':
        return {
          icon: <Settings className="w-4 h-4 text-cyan-400 animate-spin" />,
          color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
          glow: 'rgba(6,182,212,0.15)',
          title: 'Planning Scope',
        };
      case 'compiling':
        return {
          icon: <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />,
          color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
          glow: 'rgba(168,85,247,0.15)',
          title: 'Compiling Workspace',
        };
      case 'self-healing':
        return {
          icon: <Loader className="w-4 h-4 text-amber-400 animate-spin" />,
          color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
          glow: 'rgba(245,158,11,0.15)',
          title: 'Self-Healing Active',
        };
      default:
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
          color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
          glow: 'rgba(16,185,129,0.15)',
          title: 'Aura Idle',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px ${config.glow}, inset 0 0 0 1px rgba(255, 255, 255, 0.15)`,
        willChange: 'transform',
      }}
      className={`mx-6 my-3 p-4 rounded-2xl bg-gradient-to-r ${config.color} backdrop-blur-[40px] saturate-[250%] brightness-105 contrast-110 border border-white/[0.12] transform-gpu`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="flex-grow">
          <h4 className="text-xs font-semibold text-white/90 font-outfit uppercase tracking-wider">
            {config.title}
          </h4>
          {activeTask && (
            <p className="text-[10px] text-white/60 font-sans mt-0.5 truncate">
              {activeTask}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
