'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Ticket, 
  Scan, 
  Settings, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  Home
} from 'lucide-react';
import { useERPStore } from '@/lib/store/useERPStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'דאשבורד', icon: LayoutDashboard, href: '/erp' },
  { id: 'bookings', label: 'ניהול הזמנות', icon: Ticket, href: '/erp/bookings' },
  { id: 'scanner', label: 'מצב סורק', icon: Scan, href: '/erp/scanner' },
  { id: 'settings', label: 'הגדרות', icon: Settings, href: '/erp/settings' },
];

export default function ERPSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useERPStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 280 : 80 }}
      className="fixed top-0 right-0 h-full z-50 bg-[#0A0A0A]/40 backdrop-blur-3xl border-l border-white/5 flex flex-col transition-all duration-500 ease-out"
    >
      {/* Brand Header */}
      <div className="h-24 flex items-center px-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="text-primary" size={24} />
        </div>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mr-4 overflow-hidden whitespace-nowrap"
          >
            <h2 className="text-lg font-black text-white tracking-tighter">LIQUID ERP</h2>
            <p className="text-[10px] text-primary font-black uppercase tracking-widest">Admin Control</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2">
        {/* Back to Site Link */}
        <Link href="/">
          <div className="flex items-center h-12 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-300 mb-6">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Home size={20} />
            </div>
            {isSidebarOpen && (
              <span className="mr-2 font-bold text-sm">חזרה לאתר</span>
            )}
          </div>
        </Link>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.id} href={item.href}>
              <div
                className={cn(
                  "group relative flex items-center h-12 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary/5 rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 z-10">
                  <Icon size={20} className={cn("transition-transform duration-300 group-hover:scale-110", isActive && "text-primary")} />
                </div>

                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mr-2 font-bold text-sm z-10"
                  >
                    {item.label}
                  </motion.span>
                )}

                {isSidebarOpen && isActive && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mr-auto ml-4"
                  >
                    <ChevronRight size={14} className="text-primary/50" />
                  </motion.div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5">
        <button className="w-full h-12 flex items-center rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 px-4 group">
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          {isSidebarOpen && (
            <span className="mr-4 font-bold text-sm">התנתק</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
