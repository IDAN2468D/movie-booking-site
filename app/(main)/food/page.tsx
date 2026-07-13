'use client';

import { VisualCateringGrid } from "@/components/catering/VisualCateringGrid";
import { useBookingStore } from "@/lib/store";

export default function FoodPage() {
  const selectedFood = useBookingStore(state => state.selectedFood);
  const updateFoodQuantity = useBookingStore(state => state.updateFoodQuantity);

  return (
    <main className="min-h-screen bg-neutral-950 pt-24 px-4 md:px-8 pb-12 overflow-x-hidden relative">
      {/* Volumetric background ambient beam effect */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none transform-gpu" />
      
      <div className="max-w-7xl mx-auto space-y-10 relative z-10" dir="rtl">
        {/* Section Premium Typography Header */}
        <div className="space-y-3 border-b border-white/5 pb-6">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit text-white tracking-tight">
            המזנון הסינמטי המשודרג
          </h1>
          <p className="text-neutral-400 font-inter text-sm md:text-base max-w-2xl">
            חוויה קולינרית רפרקטיבית המותאמת אישית לז'אנר הסרט ומצב הרוח הסינמטי שלך.
          </p>
        </div>
        
        {/* High-Fidelity Bento Grid Image Stand Mount */}
        <VisualCateringGrid selectedFood={selectedFood} updateFoodQuantity={updateFoodQuantity} />
      </div>
    </main>
  );
}
