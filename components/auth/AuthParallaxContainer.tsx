'use client';

import React, { useRef, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { ProjectorBeamLayer } from './layers/ProjectorBeamLayer';
import { AnamorphicFlareLayer } from './layers/AnamorphicFlareLayer';
import { ShutterFlickerLayer } from './layers/ShutterFlickerLayer';
import { FilmstripLayer } from './layers/FilmstripLayer';
import { TypographyParallaxLayer } from './layers/TypographyParallaxLayer';
import { CinematicDustLayer } from './layers/CinematicDustLayer';
import { DeepBaseLayer } from './layers/DeepBaseLayer';
import { FocusLaserLayer } from './layers/FocusLaserLayer';
import { PosterGalleryLayer } from './layers/PosterGalleryLayer'; // Fixed cache

interface Props {
  children: React.ReactNode;
  images?: string[];
}

export function AuthParallaxContainer({ children, images = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll({
    container: containerRef,
  });

  // Auto-scroll mechanism
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;

    const scrollStep = () => {
      container.scrollTop += 0.8; // Scroll speed
      
      // Loop seamlessly if we reach the bottom
      if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
        container.scrollTop = 0;
      }
      
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-[#0A0A0A]"
    >
      {/* Background Scrolling Canvas - strictly h-[2000vh] to enable massive scroll range */}
      <div className="relative w-full h-[2000vh] pointer-events-none">
        <DeepBaseLayer scrollY={scrollY} imageSrc={images[0]} />
        <ProjectorBeamLayer scrollY={scrollY} />
        <AnamorphicFlareLayer scrollY={scrollY} />
        <ShutterFlickerLayer />
        <TypographyParallaxLayer scrollY={scrollY} />
        <FilmstripLayer scrollY={scrollY} imageSrc={images[1]} />
        
        {/* Massive scattered poster gallery layer using remaining images */}
        <PosterGalleryLayer scrollY={scrollY} images={images.slice(4)} />

        <CinematicDustLayer scrollY={scrollY} imageSrc={images[2]} />
        <FocusLaserLayer scrollY={scrollY} imageSrc={images[3]} />
      </div>
      
      {/* Layer 4 - Static Foreground Grid */}
      <div className="fixed inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col pointer-events-none">
          {children}
        </div>
      </div>
    </div>
  );
}
