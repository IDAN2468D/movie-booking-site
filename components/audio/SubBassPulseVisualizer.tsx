'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Activity, Zap } from 'lucide-react';

interface SubBassPulseVisualizerProps {
  isPlaying?: boolean;
  frequencyHz?: number;
}

export const SubBassPulseVisualizer: React.FC<SubBassPulseVisualizerProps> = ({
  isPlaying = true,
  frequencyHz = 40,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeResonance] = useState<number>(frequencyHz);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (isPlaying) {
        angle += 0.05;
        const radius = 25 + Math.sin(angle) * 12;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 15;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="relative w-full p-4 rounded-2xl bg-neutral-950/80 border border-white/10 text-white backdrop-blur-xl" dir="rtl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-pink-500 animate-pulse" />
          <span className="font-['Outfit'] font-bold text-sm text-pink-300">
            תהודת סאב-בס מרחבית (Sub-Bass Wavefront)
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-neutral-400">
          <Zap className="w-3.5 h-3.5 text-yellow-400" /> {activeResonance}Hz
        </div>
      </div>
      
      <div className="relative flex items-center justify-center h-24 rounded-xl bg-black/50 overflow-hidden">
        <canvas ref={canvasRef} width={280} height={96} className="w-full h-full" />
      </div>
    </div>
  );
};
