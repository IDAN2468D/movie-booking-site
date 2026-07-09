"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useConcessionStore, selectAmbientColor, selectAvailableItems, selectAddItemToBucket, selectSetAvailableItems } from "@/lib/store/concessionStore";
import { ensureWCAGContrast } from "@/lib/utils/colorUtils";
import { ConcessionBucket } from "./ConcessionBucket";
import { useSubBass } from "@/lib/hooks/useSubBass";

export default function ConcessionMatrix() {
  const ambientColor = useConcessionStore(selectAmbientColor);
  const availableItems = useConcessionStore(selectAvailableItems);
  const setAvailableItems = useConcessionStore(selectSetAvailableItems);
  const addItemToBucket = useConcessionStore(selectAddItemToBucket);
  const { triggerSubBass } = useSubBass();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setAvailableItems([
      { id: "pop1", name: "פופקורן סייבר", price: 25, color: "#FDE047" },
      { id: "soda1", name: "קולה ניאון", price: 15, color: "#ef4444" },
      { id: "nacho1", name: "נאצ'וס פלזמה", price: 22, color: "#f97316" }
    ]);
  }, [setAvailableItems]);

  const safeAmbientColor = isClient ? ensureWCAGContrast(ambientColor) : "#FF1464";

  if (!isClient) return null;

  return (
    <div 
      dir="rtl"
      className="relative min-h-[600px] w-full max-w-5xl mx-auto rounded-[32px] p-8 border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.5)] backdrop-blur-[50px] saturate-[250%] brightness-110 contrast-110 bg-neutral-950/40 transition-colors duration-1000 overflow-hidden"
      style={{
        "--ambient-flavor-glow": safeAmbientColor,
        boxShadow: `0 35px 60px -15px rgba(0, 0, 0, 0.8), 0 0 50px ${safeAmbientColor}50, inset 0 0 0 1px rgba(255, 255, 255, 0.15)`
      } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row gap-10 h-full z-10 relative">
        <div className="flex-1 space-y-6">
          <h2 className="font-outfit text-3xl text-white font-bold tracking-tight mb-8" style={{ textShadow: `0 0 15px ${safeAmbientColor}` }}>
            דוכן קומבו קינטי
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {availableItems.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`item-source-${item.id}`}
                drag
                dragSnapToOrigin
                onDragEnd={(_, info) => {
                  if (info.offset.x > 80 || info.offset.x < -80 || info.offset.y > 80) {
                    addItemToBucket(item);
                    triggerSubBass();
                  }
                }}
                className="cursor-grab active:cursor-grabbing p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 flex flex-col justify-between h-36 backdrop-blur-md"
                style={{ transform: "translateZ(0)", willChange: "transform" }}
                whileHover={{ scale: 1.05, y: -5, boxShadow: `0 10px 20px ${item.color}30` }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-full mb-3" style={{ backgroundColor: item.color, boxShadow: `0 0 20px ${item.color}` }} />
                <div>
                  <p className="font-inter text-white font-medium text-lg">{item.name}</p>
                  <p className="font-inter text-white/70 text-md">₪{item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 border-r border-white/10 pr-10 h-[520px]">
           <ConcessionBucket safeAmbientColor={safeAmbientColor} />
        </div>
      </div>
      
      {/* Background glow injected strictly via GPU-accelerated inline styles */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 blur-[120px]"
        style={{
          background: `radial-gradient(circle at center, var(--ambient-flavor-glow) 0%, transparent 65%)`,
          willChange: "opacity, background",
          transform: "translateZ(0)"
        }}
      />
    </div>
  );
}
