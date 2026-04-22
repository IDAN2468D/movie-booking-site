'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, Shield, Bell, CreditCard, LogOut, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import PersonalInfoSettings from '@/components/settings/PersonalInfoSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PaymentSettings from '@/components/settings/PaymentSettings';

type TabType = 'personal' | 'security' | 'notifications' | 'payments';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  const tabs = [
    { id: 'personal', label: 'מידע אישי', icon: User },
    { id: 'security', label: 'אבטחה', icon: Shield },
    { id: 'notifications', label: 'התראות', icon: Bell },
    { id: 'payments', label: 'תשלומים', icon: CreditCard },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'personal': return <PersonalInfoSettings />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'payments': return <PaymentSettings />;
      default: return <PersonalInfoSettings />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-right" dir="rtl">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">הגדרות <span className="text-primary">חשבון</span></h1>
        <p className="text-slate-400 font-medium">נהל את הפרופיל, האבטחה וההעדפות שלך</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="glass-orange rounded-[32px] p-8 border border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -ml-12 -mt-12" />
            
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-primary/20 flex items-center justify-center text-primary text-3xl font-black overflow-hidden">
                {session?.user?.image ? (
                  <NextImage src={session.user.image} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
                ) : (
                  session?.user?.name?.[0] || 'U'
                )}
              </div>
              <button className="absolute bottom-0 left-0 p-2 bg-primary rounded-full border-4 border-[#1A1A1A] text-background hover:scale-110 transition-transform">
                <Camera size={14} />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1">{session?.user?.name || 'משתמש'}</h2>
            <p className="text-sm text-slate-500 font-medium mb-2">{session?.user?.email}</p>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">מחובר דרך Google</span>
              </div>
            </div>
            
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-red-400 hover:bg-red-400/10 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <LogOut size={14} className="rotate-180" />
              התנתק
            </button>
          </div>

          <div className="glass rounded-[32px] p-6 border border-white/5 space-y-2">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-background font-black shadow-lg shadow-primary/20' 
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Settings Content */}
        <div className="md:col-span-2 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
