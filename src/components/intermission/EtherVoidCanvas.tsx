'use client';

import React, { useRef, useEffect } from 'react';
import { VoidEntity } from '@/lib/validations/void';

interface EtherVoidCanvasProps {
  entities: VoidEntity[];
  onEntityPing: (entity: VoidEntity) => void;
}

export const EtherVoidCanvas: React.FC<EtherVoidCanvasProps> = ({ entities, onEntityPing }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render glass sphere entities
      entities.forEach((ent) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(ent.x, ent.y, ent.radius, 0, Math.PI * 2);

        // Glass sphere glow gradient
        const grad = ctx.createRadialGradient(
          ent.x - ent.radius * 0.3,
          ent.y - ent.radius * 0.3,
          ent.radius * 0.1,
          ent.x,
          ent.y,
          ent.radius
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.5, ent.refractionColor);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

        ctx.fillStyle = grad;
        ctx.shadowColor = ent.refractionColor;
        ctx.shadowBlur = 15;
        ctx.fill();

        // Refractive inner ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ent.username, ent.x, ent.y + ent.radius + 14);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [entities]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clicked = entities.find((ent) => {
      const dist = Math.hypot(ent.x - clickX, ent.y - clickY);
      return dist <= ent.radius;
    });

    if (clicked) {
      onEntityPing(clicked);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={240}
      onClick={handleCanvasClick}
      className="w-full h-60 rounded-2xl bg-neutral-950/80 border border-white/10 cursor-pointer shadow-inner"
    />
  );
};
