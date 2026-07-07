'use client';

import { useEffect, useRef } from 'react';
import { useLiquidGlassStore } from '@/lib/store/liquidGlassStore';
import { SnackDraggableItem } from '@/components/food/SnackDraggableItem';

// Represents virtual cup holders and tray slots in the cinema
const TRAY_SLOTS = [
  { id: 'seat-a1-cup', x: 80, y: 120, label: 'A1 Holder' },
  { id: 'seat-a2-cup', x: 280, y: 120, label: 'A2 Holder' },
  { id: 'seat-a3-cup', x: 480, y: 120, label: 'A3 Holder' },
];

export function DynamicSnackTrayCanvas() {
  const snackItems = useLiquidGlassStore((state) => state.snackItems);
  const addSnackItem = useLiquidGlassStore((state) => state.addSnackItem);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Pre-hydrate some draggable snacks on mount if none exist
  useEffect(() => {
    const store = useLiquidGlassStore.getState();
    if (store.snackItems.length === 0) {
      store.addSnackItem({ id: 'popcorn-xl', name: 'Caramel XL', x: 80, y: 350, isPlaced: false });
      store.addSnackItem({ id: 'cola-zero', name: 'Zero Cola', x: 280, y: 350, isPlaced: false });
      store.addSnackItem({ id: 'nachos', name: 'Hot Nachos', x: 480, y: 350, isPlaced: false });
    }
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[600px] bg-neutral-950/60 backdrop-blur-[40px] border border-white/[0.12] rounded-[32px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)]">
      <div className="absolute top-8 w-full text-center z-10 pointer-events-none">
        <h2 className="font-outfit text-3xl text-white font-bold tracking-tight drop-shadow-md">Culinary Canvas</h2>
        <p className="font-inter text-neutral-400 text-sm mt-2">Drag provisions directly into your designated cup holders.</p>
      </div>
      
      {/* Structural Rendering for Drop Zones */}
      <div ref={canvasRef} className="absolute inset-0 pointer-events-none">
        {TRAY_SLOTS.map(slot => (
          <div 
            key={slot.id}
            className="absolute w-28 h-28 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center transform-gpu will-change-transform bg-white/5 backdrop-blur-sm"
            style={{ left: slot.x, top: slot.y }}
          >
            <span className="font-inter text-xs text-white/50 tracking-wider font-medium">{slot.label}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 w-full text-center pointer-events-none">
         <span className="font-inter text-xs text-white/30 tracking-widest uppercase">Preparation Zone</span>
         <div className="mx-auto mt-4 w-[80%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Render Draggable Hardware-Accelerated Items */}
      <div className="absolute inset-0">
        {snackItems.map((item) => (
          <SnackDraggableItem key={item.id} item={item} dropZones={TRAY_SLOTS} />
        ))}
      </div>
    </div>
  );
}
