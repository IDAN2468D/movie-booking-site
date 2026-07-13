'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ScratchPassDesign } from './ScratchPassDesign';
import { useScratchAudio } from '../../hooks/useScratchAudio';

interface ScratchCanvasProps {
  tierName?: string;
  onComplete: () => void;
}

const CARD_WIDTH = 340;
const CARD_HEIGHT = 220;
const GRID_SIZE = 10;

export function ScratchCanvas({
  tierName = 'NEURAL ELITE',
  onComplete,
}: ScratchCanvasProps) {
  const [isFading, setIsFading] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { initAudio, updateScratchAudio } = useScratchAudio();

  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastTouchTime = useRef(0);

  // 10x10 Matrix Grid
  const grid = useRef<boolean[]>(new Array(GRID_SIZE * GRID_SIZE).fill(false));
  const clearedCells = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    updateMask();
  }, []);

  const updateMask = () => {
    const canvas = canvasRef.current;
    const cover = coverRef.current;
    if (!canvas || !cover) return;
    try {
      const dataUrl = canvas.toDataURL();
      cover.style.maskImage = `url(${dataUrl})`;
      cover.style.webkitMaskImage = `url(${dataUrl})`;
    } catch (_) {}
  };

  const handleScratchProgress = (x: number, y: number) => {
    const col = Math.floor((x / CARD_WIDTH) * GRID_SIZE);
    const row = Math.floor((y / CARD_HEIGHT) * GRID_SIZE);

    if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
      const idx = row * GRID_SIZE + col;
      if (!grid.current[idx]) {
        grid.current[idx] = true;
        clearedCells.current += 1;

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(8);
        }

        const progress = (clearedCells.current / (GRID_SIZE * GRID_SIZE)) * 100;
        if (progress > 70 && !isFading) {
          setIsFading(true);
          updateScratchAudio(0);
          setTimeout(() => {
            onComplete();
          }, 450);
        }
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isFading) return;
    initAudio();
    isDrawing.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    lastX.current = e.clientX - rect.left;
    lastY.current = e.clientY - rect.top;
    lastTouchTime.current = Date.now();
    
    // Set pointer capture to track gestures outside boundary
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Specular tilt calculations
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -12;
    const ry = ((x - cx) / cx) * 12;
    setTiltStyle({ transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)` });
    setGlareStyle({ transform: `translate3d(${(x - cx) * 0.35}px, ${(y - cy) * 0.35}px, 0)` });

    if (!isDrawing.current || isFading) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Rough material friction stroke simulation
      ctx.lineWidth = 36;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.globalCompositeOperation = 'destination-out';

      ctx.beginPath();
      ctx.moveTo(lastX.current, lastY.current);
      ctx.lineTo(x, y);
      ctx.stroke();

      updateMask();
      handleScratchProgress(x, y);

      const now = Date.now();
      const dt = now - lastTouchTime.current;
      if (dt > 0) {
        const dx = x - lastX.current;
        const dy = y - lastY.current;
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        updateScratchAudio(speed);
      }
      lastTouchTime.current = now;
    }

    lastX.current = x;
    lastY.current = y;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDrawing.current = false;
    updateScratchAudio(0);
    setTiltStyle({ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)', transition: 'all 0.3s ease' });
    setGlareStyle({ transform: 'translate3d(0, 0, 0)', transition: 'all 0.3s ease' });
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  return (
    <div
      ref={containerRef}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      className={`relative rounded-3xl overflow-hidden select-none touch-none transition-opacity duration-300 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        ref={coverRef}
        className="absolute inset-0 z-10"
        style={{
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      >
        <ScratchPassDesign
          tiltStyle={tiltStyle}
          glareStyle={glareStyle}
          tierName={tierName}
        />
      </div>

      <canvas
        ref={canvasRef}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        className="hidden"
      />
    </div>
  );
}
