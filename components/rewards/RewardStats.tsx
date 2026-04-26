'use client';

import React from 'react';
import { Star, ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface RewardStatsProps {
  totalPoints: number;
  isLoading?: boolean;
}

export const RewardStats = ({ totalPoints, isLoading }: RewardStatsProps) => {
  return (
    <div 
      className="relative rounded-[48px] p-12 overflow-hidden border border-white/5 transition-all duration-700"
      style={{
        background: 'rgba(255, 159, 10, 0.02)',
        backdropFilter: 'blur(30px) saturate(200%)',
        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Refractive Orb Background Decoration */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -ml-40 -mt-40 animate-pulse" />
      
      <div className="flex items-center gap-4 mb-12 flex-row relative z-10">
         <div className="p-4 bg-primary rounded-2xl text-background shadow-[0_0_30px_rgba(255,159,10,0.3)]">
            <Star size={28} className="fill-background" />
         </div>
         <div>
            <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">
              תכנית <span className="text-primary">נאמנות</span>
            </h1>
            <p className="text-slate-400 font-medium">צבור נקודות על כל חוויה קולנועית</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <StatBox 
            label="סה&quot;כ נקודות" 
            value={isLoading ? '---' : totalPoints.toLocaleString('he-IL')} 
            sub="+12% החודש" 
            subIcon={<ArrowUpRight size={14} />} 
            isLoading={isLoading}
          />
         
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 backdrop-blur-md">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">דירוג נוכחי</p>
             {isLoading ? (
               <div className="h-12 w-24 bg-white/10 rounded-xl animate-pulse mb-2" />
             ) : (
               <p className="text-5xl font-black text-white mb-2 tracking-tighter">זהב</p>
             )}
             <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: isLoading ? 0 : '75%' }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-primary to-orange-300 shadow-[0_0_10px_rgba(255,159,10,0.5)]" 
               />
             </div>
             <p className="text-[10px] text-slate-500 font-bold mt-3 text-left">550 נקודות ליהלום</p>
          </div>

          <StatBox 
            label="סה&quot;כ נחסך" 
            value="₪142" 
            sub="הטבות לכל החיים" 
            subIcon={<TrendingUp size={14} />} 
            subColor="text-green-400"
            isLoading={isLoading}
          />
      </div>
    </div>
  );
};

const StatBox = ({ label, value, sub, subIcon, subColor = "text-primary", isLoading }: { label: string; value: string; sub: string; subIcon: React.ReactNode; subColor?: string; isLoading?: boolean }) => (
  <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors" data-testid="stat-box">
     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2" data-testid="stat-label">{label}</p>
     {isLoading ? (
       <div className="h-12 w-full bg-white/10 rounded-xl animate-pulse mb-2" />
     ) : (
       <p className="text-5xl font-black text-white mb-2 tracking-tighter" data-testid="stat-value">{value}</p>
     )}
     <div className={`flex items-center gap-1.5 text-xs ${subColor} font-bold justify-start`}>
       {sub} {subIcon}
     </div>
  </div>
);
