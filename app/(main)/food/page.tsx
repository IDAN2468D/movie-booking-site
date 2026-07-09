"use client";

import ConcessionMatrix from "@/components/food/ConcessionMatrix";

export default function FoodPage() {
  return (
    <div className="min-h-screen pt-20 px-4 md:px-10 pb-32 bg-background">
      <h1 className="text-4xl md:text-5xl text-white font-black font-outfit mb-10 tracking-tight text-center" dir="rtl">
        המזנון הקינטי <span className="text-[#FF1464] drop-shadow-[0_0_15px_rgba(255,20,100,0.5)]">החדש</span>
      </h1>
      <ConcessionMatrix />
    </div>
  );
}
