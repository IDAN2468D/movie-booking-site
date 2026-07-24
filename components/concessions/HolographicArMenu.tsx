'use client';

import React, { useState } from 'react';
import { MOCK_HOLO_CONCESSIONS, HoloConcessionItem, FlavorProfile, HoloCartItem } from '@/lib/types/concession';
import { Holo3dItemViewer } from './Holo3dItemViewer';
import { KineticFlavorRadar } from './KineticFlavorRadar';
import { AiSnackPairer } from './AiSnackPairer';
import { ConcessionCartDrawer } from './ConcessionCartDrawer';
import { useConcessionAudio } from '@/lib/hooks/useConcessionAudio';

export const HolographicArMenu: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<HoloConcessionItem>(MOCK_HOLO_CONCESSIONS[0]);
  const [currentFlavor, setCurrentFlavor] = useState<FlavorProfile>(MOCK_HOLO_CONCESSIONS[0].flavor);
  const [cart, setCart] = useState<HoloCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { playHoloSelect, playAddToCart, playRadarAdjust } = useConcessionAudio();

  const handleSelectItem = (item: HoloConcessionItem) => {
    setSelectedItem(item);
    setCurrentFlavor(item.flavor);
    playHoloSelect();
  };

  const handleAddToCart = (item: HoloConcessionItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { item, quantity: 1 }];
    });
    playAddToCart();
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.item.id === itemId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const totalCartItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="w-full flex flex-col space-y-6 relative" dir="rtl">
      {/* Category Chips Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        {MOCK_HOLO_CONCESSIONS.map((item) => {
          const isActive = selectedItem.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-outfit font-medium shrink-0 transition-all duration-200 border ${
                isActive
                  ? 'bg-white/15 text-white border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105'
                  : 'bg-white/5 text-neutral-400 hover:text-white border-white/10'
              }`}
            >
              {item.icon} {item.name}
            </button>
          );
        })}
      </div>

      {/* Main Grid Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center Panel: 3D Holographic Item Viewer */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <Holo3dItemViewer item={selectedItem} onAddToCart={handleAddToCart} />
        </div>

        {/* Right Panel: Flavor Radar & AI Snack Pairing */}
        <div className="lg:col-span-5 space-y-4">
          <KineticFlavorRadar
            flavor={currentFlavor}
            onChange={setCurrentFlavor}
            targetFlavor={selectedItem.flavor}
            onAudioFeedback={playRadarAdjust}
          />

          <AiSnackPairer currentFlavor={currentFlavor} onSelectRecommended={handleSelectItem} />
        </div>
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 left-6 z-40 px-5 py-3 rounded-full bg-neutral-900/90 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 font-outfit text-sm font-semibold flex items-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-transform"
      >
        <span>🛒</span>
        <span>המגש ההולוגרפי שלי</span>
        {totalCartItemsCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-xs font-bold font-mono flex items-center justify-center">
            {totalCartItemsCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <ConcessionCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCart([])}
      />
    </div>
  );
};
