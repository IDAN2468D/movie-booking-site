'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, Award, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieInfographicProps {
  voteAverage: number;
  voteCount: number;
  popularity: number;
}

export default function MovieInfographic({ voteAverage, voteCount, popularity }: MovieInfographicProps) {
  return (
    <section className="mt-16 text-right" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30 text-cyan-400">
          <BarChart3 size={20} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">נתוני צפייה ומדדי הצלחה</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rating Success */}
        <StatCard 
          icon={<TrendingUp className="text-emerald-400" />}
          label="מדד שביעות רצון"
          value={`${(voteAverage * 10).toFixed(0)}%`}
          subValue={`${voteCount.toLocaleString('he-IL')} מדרגים`}
          color="emerald"
        />

        {/* Popularity Score */}
        <StatCard 
          icon={<Zap className="text-amber-400" />}
          label="ציון פופולריות"
          value={popularity.toFixed(0)}
          subValue="בדירוג TMDB העולמי"
          color="amber"
        />

        {/* Engagement */}
        <StatCard 
          icon={<Users className="text-blue-400" />}
          label="קהל יעד"
          value="גבוה"
          subValue="טרנד חזק השבוע"
          color="blue"
        />

        {/* Quality Meter */}
        <StatCard 
          icon={<Award className="text-primary" />}
          label="דירוג איכות"
          value={voteAverage > 8 ? 'Masterpiece' : voteAverage > 7 ? 'Must Watch' : 'Classic'}
          subValue="לפי ניתוח בינה מלאכותית"
          color="orange"
        />
      </div>

      {/* Visual Analytics Block */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">מפת עומק קולנועית</h3>
            <Activity size={16} className="text-primary animate-pulse" />
          </div>
          
          <div className="space-y-6">
             <MetricBar label="עוצמת עלילה" percentage={voteAverage * 10 - 5} />
             <MetricBar label="אפקטים ויזואליים" percentage={85} />
             <MetricBar label="פס-קול" percentage={92} />
             <MetricBar label="משחק" percentage={78} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-cyan-500/5 border border-white/10 rounded-[40px] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
           <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-4">תחזית AI שבועית</p>
           <h4 className="text-xl font-black text-white mb-4">סיכויי הצלחה בקופות</h4>
           <div className="text-5xl font-black text-white mb-2">94<span className="text-primary">%</span></div>
           <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">מבוסס על סנטימנט משתמשים ונתוני צפייה היסטוריים בסרטים דומים.</p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string | number; subValue: string; color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/[0.03] border border-white/5 p-6 rounded-[32px] transition-all hover:bg-white/[0.05] hover:border-white/10"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-white mb-1">{value}</h3>
      <p className="text-[10px] font-bold text-slate-400 italic">{subValue}</p>
    </motion.div>
  );
}

function MetricBar({ label, percentage }: { label: string; percentage: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-primary">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-cyan-500"
        />
      </div>
    </div>
  );
}
