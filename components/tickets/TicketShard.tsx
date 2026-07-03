'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TicketShardProps {
  isAssembled: boolean;
}

export default function TicketShard({ isAssembled }: TicketShardProps) {
  const shards = [
    { x: -100, y: -80, rotate: -45, scale: 0.8 },
    { x: 120, y: -120, rotate: 30, scale: 0.7 },
    { x: -90, y: 150, rotate: -25, scale: 0.9 },
    { x: 140, y: 100, rotate: 40, scale: 0.75 },
  ];

  if (isAssembled) return null;

  return (
    <>
      {shards.map((shard, idx) => (
        <motion.div
          key={idx}
          initial={{ x: shard.x, y: shard.y, rotate: shard.rotate, opacity: 0, scale: shard.scale }}
          animate={{ x: 0, y: 0, rotate: 0, opacity: 0.6, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 border border-white/10 rounded-[40px] pointer-events-none bg-white/[0.02] backdrop-blur-sm z-20"
        />
      ))}
    </>
  );
}
