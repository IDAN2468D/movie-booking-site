'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useScratchAudio } from '../../hooks/useScratchAudio';

interface ScratchCircleProps {
  id: number;
  prizeText: string;
  locked: boolean;
  onReveal: (id: number, cx: number, cy: number) => void;
}

const SIZE = 96;
const RADIUS = SIZE / 2;

export function ScratchCircle({ id, prizeText, locked, onReveal }: ScratchCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const { initAudio, updateScratchAudio, stopAudio } = useScratchAudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw gorgeous metallic silver/latex gradient circle
    const grad = ctx.createRadialGradient(RADIUS, RADIUS, 5, RADIUS, RADIUS, RADIUS);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#E2E8F0');
    grad.addColorStop(0.7, '#CBD5E1');
    grad.addColorStop(1, '#94A3B8');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(RADIUS, RADIUS, RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw sub-pixel border ring
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw central engraved star (dark indented look)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.font = 'bold 26px font-inter, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 0.5;
    ctx.shadowOffsetY = 0.5;
    ctx.fillText('★', RADIUS, RADIUS);
  }, []);

  const calculateScratchProgress = (ctx: CanvasRenderingContext2D): boolean => {
    try {
      const imgData = ctx.getImageData(0, 0, SIZE, SIZE);
      const data = imgData.data;
      let transparent = 0;
      let total = 0;

      // Sample every 4th pixel inside the circle radius
      for (let y = 0; y < SIZE; y += 4) {
        for (let x = 0; x < SIZE; x += 4) {
          const dx = x - RADIUS;
          const dy = y - RADIUS;
          if (dx * dx + dy * dy <= RADIUS * RADIUS) {
            total++;
            const alphaIndex = (y * SIZE + x) * 4 + 3;
            if (data[alphaIndex] < 50) {
              transparent++;
            }
          }
        }
      }

      const percent = (transparent / total) * 100;
      if (percent > 65 && !isRevealed && !locked) {
        setIsRevealed(true);
        stopAudio(); // Silence & destroy audio immediately
        if (canvasRef.current && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const parentRect = containerRef.current.parentElement?.getBoundingClientRect();
          const cx = rect.left - (parentRect?.left || 0) + RADIUS;
          const cy = rect.top - (parentRect?.top || 0) + RADIUS;
          onReveal(id, cx, cy);
        }
        return true;
      }
    } catch (_) {}
    return false;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (locked || isRevealed) return;
    initAudio();
    isDrawing.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    lastX.current = e.clientX - rect.left;
    lastY.current = e.clientY - rect.top;
    lastTime.current = Date.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || locked || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.globalCompositeOperation = 'destination-out';

    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    const revealed = calculateScratchProgress(ctx);
    if (revealed) return;

    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      const dx = x - lastX.current;
      const dy = y - lastY.current;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      updateScratchAudio(speed);
    }

    lastX.current = x;
    lastY.current = y;
    lastTime.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = false;
    stopAudio();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  return (
    <div
      ref={containerRef}
      style={{ width: SIZE, height: SIZE }}
      className={`relative rounded-full overflow-hidden select-none bg-[#05070B] border border-amber-500/10 flex items-center justify-center transition-all duration-300 ${
        locked && !isRevealed ? 'opacity-30 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Underlying Reward Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center bg-gradient-to-br from-[#10131B] to-[#0A0C10] rounded-full">
        <span className="text-[10px] font-black text-amber-400 font-outfit uppercase leading-tight">
          WINNER
        </span>
        <span className="text-[9px] font-bold text-slate-300 leading-tight max-w-[65px] truncate-2-lines">
          {prizeText}
        </span>
      </div>

      {/* Erasable Canvas Overlay */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="absolute inset-0 z-10 cursor-pointer rounded-full"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      )}
    </div>
  );
}
