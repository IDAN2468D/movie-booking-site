'use client';

import React, { useEffect, useRef } from 'react';

interface SoundtrackVisualizerProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
}

export function SoundtrackVisualizer({ analyserNode, isPlaying }: SoundtrackVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bufferLength = 32;
    let dataArray = new Uint8Array(bufferLength);

    if (analyserNode) {
      bufferLength = analyserNode.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    const renderFrame = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
      }

      const barCount = 28;
      const barWidth = (width / barCount) - 3;
      let x = 0;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isPlaying) {
          const val = dataArray[i * 2] || (Math.sin(Date.now() / 200 + i) * 30 + 40);
          barHeight = Math.max(6, (val / 255) * height * 0.85);
        } else {
          barHeight = 4;
        }

        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#6366f1'); // Indigo
        gradient.addColorStop(0.5, '#a855f7'); // Purple
        gradient.addColorStop(1, '#ec4899'); // Pink

        ctx.fillStyle = gradient;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = isPlaying ? 10 : 0;
        
        ctx.beginPath();
        ctx.roundRect(x, height - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        x += barWidth + 3;
      }

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [analyserNode, isPlaying]);

  return (
    <div className="w-full h-20 rounded-2xl overflow-hidden bg-black/40 border border-white/10 p-2 flex items-end justify-center backdrop-blur-md relative">
      <canvas ref={canvasRef} width={380} height={64} className="w-full h-full" />
    </div>
  );
}
