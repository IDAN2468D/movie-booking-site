"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Utensils, Clock, Check, Sparkles, ShoppingBag } from "lucide-react";
import { getSmartTrayRecommendationAction } from "@/app/actions/smartTrayActions";
import { SmartTrayResponse } from "@/lib/validations/smartTray";

interface SmartTrayConciergeProps {
  movieGenre?: string;
  seatNumber?: string;
}

export function SmartTrayConcierge({ movieGenre = "Action", seatNumber = "E-12" }: SmartTrayConciergeProps) {
  const [recommendation, setRecommendation] = useState<SmartTrayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    getSmartTrayRecommendationAction(movieGenre).then((res) => {
      if (res.success && res.data) {
        setRecommendation(res.data);
      }
      setLoading(false);
    });
  }, [movieGenre]);

  const handleOrder = () => {
    setOrdered(true);
    setTimeout(() => setOrdered(false), 4000);
  };

  if (loading) {
    return (
      <div className="p-6 bg-neutral-950/60 rounded-3xl border border-white/10 text-center text-xs text-white/50 animate-pulse">
        מחשב המלצות מזנון מותאמות אישית לסרט...
      </div>
    );
  }

  if (!recommendation) return null;

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-6 bg-neutral-950/80 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]" dir="rtl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-outfit text-lg font-bold text-white">{recommendation.comboName}</h4>
            <span className="text-xs text-white/50 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> הגשה למושב {seatNumber} תוך {recommendation.estimatedDeliveryMin} דקות
            </span>
          </div>
        </div>
        <span className="text-xs bg-amber-500/10 text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
          Smart AI Menu
        </span>
      </div>

      <div className="space-y-2 mb-6">
        {recommendation.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-sm font-semibold text-white">{item.name}</span>
            <span className="text-xs font-mono font-bold text-amber-400">{item.price} ₪</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-xs text-white/50 block">סה"כ לתשלום:</span>
          <span className="text-xl font-bold font-mono text-white">{recommendation.totalPrice} ₪</span>
        </div>

        <button
          onClick={handleOrder}
          className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] ${
            ordered
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white"
          }`}
        >
          {ordered ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {ordered ? "ההזמנה נשלחה למזנון!" : "הזמן מראש למושב"}
        </button>
      </div>
    </div>
  );
}
