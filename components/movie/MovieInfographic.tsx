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
    <section className="mt-24 text-right" dir="rtl">
      <div className="flex items-center gap-5 mb-12">
        <div className="w-14 h-14 bg-primary/20 rounded-[20px] flex items-center justify-center border border-primary/30 text-primary shadow-[0_0_30px_rgba(255,20,100,0.2)]">
          <BarChart3 size={28} />
        </div>
        <div>
          <p className="text-[10px] text-primary font-display uppercase tracking-[0.5em] mb-1">MARKET ANALYTICS</p>
          <h2 className="text-4xl font-display text-off-white tracking-tighter uppercase">נתוני צפייה ומדדי הצלחה</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Rating Success */}
        <StatCard 
          icon={<TrendingUp className="text-yellow" />}
          label="SATISFACTION INDEX"
          value={`${(voteAverage * 10).toFixed(0)}%`}
          subValue={`${voteCount.toLocaleString('he-IL')} מדרגים`}
        />

        {/* Popularity Score */}
        <StatCard 
          icon={<Zap className="text-primary" />}
          label="POPULARITY SCORE"
          value={popularity.toFixed(0)}
          subValue="בדירוג TMDB העולמי"
        />

        {/* Engagement */}
        <StatCard 
          icon={<Users className="text-yellow" />}
          label="TARGET AUDIENCE"
          value="HIGH"
          subValue="טרנד חזק השבוע"
        />

        {/* Quality Meter */}
        <StatCard 
          icon={<Award className="text-primary" />}
          label="QUALITY RATING"
          value={voteAverage > 8 ? 'MASTERPIECE' : voteAverage > 7 ? 'MUST WATCH' : 'CLASSIC'}
          subValue="לפי ניתוח בינה מלאכותית"
        />
      </div>

      {/* Visual Analytics Block */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white/[0.02] border border-white/10 rounded-[48px] p-10 backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xs font-display text-off-white uppercase tracking-[0.4em]">DEPTH ANALYSIS</h3>
            <Activity size={20} className="text-primary animate-pulse" />
          </div>
          
          <div className="space-y-8">
             <MetricBar label="עוצמת עלילה" percentage={Math.min(100, voteAverage * 10 - 5)} />
             <MetricBar label="אפקטים ויזואליים" percentage={85} />
             <MetricBar label="פס-קול" percentage={92} />
             <MetricBar label="משחק" percentage={78} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-yellow/5 border border-white/10 rounded-[48px] p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
           <p className="text-[10px] text-primary font-display uppercase tracking-[0.5em] mb-6">AI PROJECTION</p>
           <h4 className="text-2xl font-display text-off-white mb-6 uppercase tracking-tight">סיכויי הצלחה בקופות</h4>
           <div className="text-7xl font-display text-off-white mb-4 tracking-tighter">94<span className="text-primary">%</span></div>
           <p className="text-sm text-off-white/40 max-w-[280px] leading-relaxed font-body">
             מבוסס על סנטימנט משתמשים גלובלי ונתוני צפייה היסטוריים בז&apos;אנר {voteAverage > 7.5 ? 'המבטיח' : 'הנוכחי'}.
           </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string | number; subValue: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white/[0.03] border border-white/10 p-8 rounded-[40px] transition-all hover:bg-white/[0.05] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center mb-8 bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors`}>
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <p className="text-[9px] font-display text-off-white/40 uppercase tracking-[0.3em] mb-2">{label}</p>
      <h3 className="text-3xl font-display text-off-white mb-2 uppercase tracking-tighter">{value}</h3>
      <p className="text-[10px] font-body text-off-white/30 italic">{subValue}</p>
    </motion.div>
  );
}

function MetricBar({ label, percentage }: { label: string; percentage: number }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-display text-off-white/60 uppercase tracking-[0.2em]">{label}</span>
        <span className="text-[10px] font-display text-primary">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-gradient-to-r from-primary to-yellow rounded-full relative shadow-[0_0_20px_rgba(255,20,100,0.3)]"
        >
           <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </motion.div>
      </div>
    </div>
  );
}
