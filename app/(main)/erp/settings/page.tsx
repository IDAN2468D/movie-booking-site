'use client';

import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Palette, 
  Bell, 
  Shield, 
  Database,
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/store/ui-store';

export default function ERPSettings() {
  const [activeTab, setActiveTab] = useState('display');
  const [isSaved, setIsSaved] = useState(false);
  const { resolution, setResolution } = useUIStore();

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const TABS = [
    { id: 'display', label: 'תצוגה ורזולוציה', icon: Monitor },
    { id: 'appearance', label: 'מראה ועיצוב', icon: Palette },
    { id: 'notifications', label: 'התראות', icon: Bell },
    { id: 'security', label: 'אבטחה', icon: Shield },
    { id: 'database', label: 'מסד נתונים', icon: Database },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">הגדרות מערכת</h1>
          <p className="text-slate-400">נהל את תצורת המערכת, הרזולוציה והמראה של ה-ERP.</p>
        </div>
        <button 
          onClick={handleSave}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-2xl font-black transition-all",
            isSaved 
              ? "bg-green-500 text-white" 
              : "bg-primary text-black hover:scale-105 active:scale-95"
          )}
        >
          {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {isSaved ? 'הגדרות נשמרו' : 'שמור שינויים'}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0 space-y-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-right",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[40px] p-8 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {activeTab === 'display' && (
              <motion.div
                key="display"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Monitor className="text-primary" size={20} />
                    הגדרות רזולוציה ו-Responsive
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">התאם את הממשק למסכי לפטופ, טאבלט או מובייל.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'auto', label: 'אוטומטי', icon: Monitor, desc: 'התאמה לפי המכשיר' },
                      { id: 'fullhd', label: 'FullHD 1080p', icon: Monitor, desc: '1920x1080' },
                      { id: 'laptop', label: 'לפטופ / רחב', icon: Monitor, desc: '1440px ומעלה' },
                      { id: 'mobile', label: 'מובייל', icon: Smartphone, desc: 'מצב סדרן שטח' },
                    ].map((mode) => (
                      <button 
                        key={mode.id}
                        onClick={() => setResolution(mode.id as any)}
                        className={cn(
                          "p-6 bg-white/5 border rounded-3xl text-right transition-all group relative overflow-hidden",
                          resolution === mode.id 
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                            : "border-white/10 hover:border-white/20"
                        )}
                      >
                        <mode.icon className={cn(
                          "mb-4 transition-colors",
                          resolution === mode.id ? "text-primary" : "text-slate-500 group-hover:text-slate-300"
                        )} size={24} />
                        <p className={cn(
                          "font-bold mb-1 transition-colors",
                          resolution === mode.id ? "text-primary" : "text-white"
                        )}>{mode.label}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">{mode.desc}</p>
                        
                        {resolution === mode.id && (
                          <motion.div 
                            layoutId="activeRes"
                            className="absolute inset-0 bg-primary/5 -z-10"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h4 className="text-white font-bold mb-4">צפיפות ממשק (UI Density)</h4>
                  <div className="flex gap-4">
                    {['דחוס', 'רגיל', 'מרווח'].map((density) => (
                      <button 
                        key={density}
                        className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl text-slate-400 font-bold hover:text-white hover:bg-white/10 transition-all"
                      >
                        {density}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Palette className="text-primary" size={20} />
                    מראה המערכת
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <p className="text-white font-bold">מצב לילה (Dark Mode)</p>
                        <p className="text-xs text-slate-500">הפעלת ערכת נושא כהה לכל הממשק</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1">
                        <div className="w-4 h-4 bg-black rounded-full" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <p className="text-white font-bold">אפקט זכוכית (Glassmorphism)</p>
                        <p className="text-xs text-slate-500">הפעלת טשטוש רקע (Backdrop Blur)</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1">
                        <div className="w-4 h-4 bg-black rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
