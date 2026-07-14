'use client';

import React, { useEffect, useRef } from 'react';
import { useScroll, useVelocity, useSpring } from 'framer-motion';

export function ParticleUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Connect to global scroll context
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use standard 2D canvas with highly managed memory for 120Hz performance base layer
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: { x: number; y: number; z: number; speed: number; color: string }[] = [];
    // Deep cinema ambient colors
    const colors = ['rgba(6, 182, 212, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(236, 72, 153, 0.6)', 'rgba(255, 255, 255, 0.3)'];

    const resize = () => {
      // Manage device pixel ratio for retina displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Cap at 500 for strict performance budget
      const count = Math.min(window.innerWidth / 2, 500); 
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: Math.random() * 2 + 0.1, // Depth layer
          speed: Math.random() * 0.3 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let animationFrameId: number;

    const render = () => {
      // Clear frame
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Calculate scroll momentum vector
      const velocity = smoothVelocity.get();
      // Base upward drift + downward scroll momentum inverse mapping
      const scrollOffset = velocity * 0.05;

      // Draw all particles directly (avoiding object creation/GC thrashing)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Z-Index Parallax: closer objects (higher Z) move faster with scroll
        p.y -= (p.speed + scrollOffset * (p.z * 0.5));

        // Wrap around logic
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.z * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        // Blur distance scaling based on depth
        ctx.globalAlpha = Math.min(1, p.z / 2.5);
        ctx.fill();
      }

      // Lock to 120Hz loop
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [smoothVelocity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] opacity-70 mix-blend-screen"
      style={{ 
        willChange: 'transform',
        filter: 'blur(2px) contrast(120%)' // Liquid glass ambient baseline filter
      }}
    />
  );
}
