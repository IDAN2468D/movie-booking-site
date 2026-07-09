"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useConcessionStore, selectBucketItems, selectRemoveItemFromBucket } from "@/lib/store/concessionStore";
import { ConcessionDeliverySync } from "./ConcessionDeliverySync";

export function ConcessionBucket({ safeAmbientColor }: { safeAmbientColor: string }) {
  const bucketItems = useConcessionStore(selectBucketItems);
  const removeItemFromBucket = useConcessionStore(selectRemoveItemFromBucket);

  const total = bucketItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="flex flex-col h-full relative z-20" dir="rtl">
      <h3 className="font-outfit text-2xl text-white/90 font-bold mb-5">הדלי שלך</h3>
      <motion.div 
        className="flex-1 rounded-[20px] border-2 border-dashed border-white/20 p-6 flex flex-col gap-4 overflow-hidden relative"
        style={{ boxShadow: `inset 0 0 50px ${safeAmbientColor}15` }}
      >
        <AnimatePresence>
          {bucketItems.map((item, idx) => (
            <motion.div
              key={`${item.id}-${idx}`}
              layoutId={`item-${item.id}-${idx}`}
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={() => removeItemFromBucket(item.id)}
              className="p-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg cursor-pointer flex justify-between items-center"
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                <span className="font-inter text-white font-medium text-lg">{item.name}</span>
              </div>
              <span className="font-inter text-white/90 font-semibold">₪{item.price}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {bucketItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-inter text-white/40 text-center px-4 text-lg">
              גרור ושחרר פריטים קינטיים לכאן כדי לבנות את הקומבו שלך
            </p>
          </div>
        )}
      </motion.div>
      
      <div className="mt-6 p-5 rounded-2xl border border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-lg shadow-lg">
        <span className="font-outfit text-white/80 text-lg">סך הכל</span>
        <span className="font-outfit text-3xl text-white font-bold" style={{ textShadow: `0 0 15px ${safeAmbientColor}` }}>
          ₪{total}
        </span>
      </div>
      
      <ConcessionDeliverySync safeAmbientColor={safeAmbientColor} />
    </div>
  );
}
