"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitConcessionOrder } from "@/app/actions/concessionActions";
import { useSubBass } from "@/lib/hooks/useSubBass";
import { useConcessionStore, selectBucketItems } from "@/lib/store/concessionStore";

export function ConcessionDeliverySync({ safeAmbientColor }: { safeAmbientColor: string }) {
  const bucketItems = useConcessionStore(selectBucketItems);
  const [isPending, startTransition] = useTransition();
  const { triggerSubBass } = useSubBass();
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    if (orderStatus === "PENDING") {
      const t1 = setTimeout(() => {
        setOrderStatus("PREPARING");
        triggerSubBass();
      }, 600);
      const t2 = setTimeout(() => {
        setOrderStatus("ON_THE_WAY");
        triggerSubBass();
      }, 1200);
      const t3 = setTimeout(() => {
        setOrderStatus("DELIVERED");
        triggerSubBass();
      }, 1800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [orderStatus, triggerSubBass]);

  const handleCheckout = () => {
    if (bucketItems.length === 0) return;
    triggerSubBass();
    
    setOrderStatus("PENDING");
    
    startTransition(async () => {
      const payload = {
        bookingId: "TEST_BOOKING_99",
        seatId: "VIP-A1",
        items: bucketItems.map(i => ({ itemId: i.id, quantity: 1, price: i.price })),
        totalCost: bucketItems.reduce((acc, item) => acc + item.price, 0)
      };
      
      const res = await submitConcessionOrder(payload);
      if (!res.success) {
        console.error("Order failed via Server Action:", res.error);
        setOrderStatus(null);
      }
    });
  };

  const getStatusText = () => {
    switch(orderStatus) {
      case "PENDING": return "ההזמנה התקבלה...";
      case "PREPARING": return "בהכנה בעמדה...";
      case "ON_THE_WAY": return "בדרך אליך למושב...";
      case "DELIVERED": return "נמסר. תהנה מהסרט!";
      default: return "";
    }
  };

  return (
    <div className="mt-5" dir="rtl">
      <AnimatePresence mode="wait">
        {!orderStatus ? (
          <motion.button
            key="checkout-btn"
            disabled={isPending || bucketItems.length === 0}
            onClick={handleCheckout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-5 rounded-2xl text-white font-outfit text-lg font-bold tracking-wide disabled:opacity-50"
            style={{ 
              backgroundColor: safeAmbientColor,
              boxShadow: `0 0 25px ${safeAmbientColor}70`,
              willChange: "transform"
            }}
          >
            {isPending ? "מעבד דרך השרת..." : "הוסף לכרטיס ושלם"}
          </motion.button>
        ) : (
          <motion.div 
            key="sync-timeline"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl"
            style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-outfit text-white text-lg font-semibold">סנכרון חי אל המושב</span>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: safeAmbientColor, boxShadow: `0 0 10px ${safeAmbientColor}` }} />
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden" dir="ltr">
              <motion.div 
                className="h-full"
                style={{ backgroundColor: safeAmbientColor, willChange: "width" }}
                initial={{ width: "10%" }}
                animate={{ 
                  width: orderStatus === "PENDING" ? "10%" : 
                         orderStatus === "PREPARING" ? "50%" : 
                         orderStatus === "ON_THE_WAY" ? "80%" : "100%" 
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </div>
            <p className="font-inter text-white/90 mt-3 text-base text-center font-medium">
              {getStatusText()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
