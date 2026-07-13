'use client';

import { VisualCateringGrid } from "@/components/catering/VisualCateringGrid";
import { useBookingStore } from "@/lib/store";

export default function FoodPage() {
  const selectedFood = useBookingStore(state => state.selectedFood);
  const updateFoodQuantity = useBookingStore(state => state.updateFoodQuantity);

  return (
    <main className="fixed inset-0 bg-neutral-950 pt-16 px-4 md:px-8 pb-4 overflow-hidden flex flex-col z-40">
      {/* Volumetric background ambient beam effect */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none transform-gpu" />
      
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-4 relative z-10 min-h-0" dir="rtl">
        {/* Section Premium Typography Header */}
        <div className="space-y-1 border-b border-white/5 pb-2 shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold font-outfit text-white tracking-tight">
            המזנון הסינמטי המשודרג
          </h1>
          <p className="text-neutral-400 font-inter text-xs md:text-sm max-w-2xl hidden sm:block">
            חוויה קולינרית רפרקטיבית המותאמת אישית לז'אנר הסרט ומצב הרוח הסינמטי שלך.
          </p>
        </div>
        
        {/* High-Fidelity Bento Grid Image Stand Mount */}
        <VisualCateringGrid selectedFood={selectedFood} updateFoodQuantity={updateFoodQuantity} />
      </div>
    </main>
  );
}
