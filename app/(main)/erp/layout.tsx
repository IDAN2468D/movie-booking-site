'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import ERPSidebar from '@/components/erp/ERPSidebar';
import { useERPStore } from '@/lib/store/useERPStore';
import { useUIStore } from '@/lib/store/ui-store';
import { 
  ShieldAlert, 
  ShieldCheck,
  Loader2, 
  LayoutDashboard, 
  Ticket, 
  Scan, 
  Settings,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { isSidebarOpen } = useERPStore();
  const { resolution } = useUIStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isWindowMobile, setIsWindowMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsWindowMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    // Admin Check
    const isAdmin = session.user?.email === 'idankzm@gmail.com' || session.user?.email === 'test@example.com';
    
    if (!isAdmin) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [session, status, router]);

  const isMobileView = resolution === 'mobile' || isWindowMobile;

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center z-[100]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-primary mb-4"
        >
          <Loader2 size={40} />
        </motion.div>
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Initializing ERP Environment...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center z-[100] px-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500 mb-8">
          <ShieldAlert size={40} />
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Access Denied</h1>
        <p className="text-slate-400 max-w-md leading-relaxed mb-8">
          This area is restricted to authorized personnel.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-colors"
        >
          Return to Cinema
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#1a1a1a_0%,transparent_50%)] opacity-50" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(0,255,255,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Mobile Header (Only in mobile view) */}
      {isMobileView && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-2xl border-b border-white/5 z-50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <ShieldCheck className="text-primary" size={18} />
            </div>
            <span className="text-sm font-black text-white tracking-tighter uppercase">Liquid ERP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {!isMobileView && <ERPSidebar />}

      <motion.main
        initial={false}
        animate={{ 
          marginRight: isMobileView ? 0 : (isSidebarOpen ? 280 : 80),
          width: isMobileView ? '100%' : `calc(100% - ${isSidebarOpen ? 280 : 80}px)` 
        }}
        className={cn(
          "min-h-screen p-4 md:p-8 lg:p-12 transition-all duration-500 ease-out",
          isMobileView && "pt-24 pb-40"
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Mobile Floating Menu (Only in mobile view) */}
      {isMobileView && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex gap-2 p-2 bg-[#0A0A0A]/60 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {[
            { href: '/', icon: Home },
            { href: '/erp', icon: LayoutDashboard },
            { href: '/erp/bookings', icon: Ticket },
            { href: '/erp/scanner', icon: Scan },
            { href: '/erp/settings', icon: Settings },
          ].map((item) => (
             <button 
               key={item.href}
               onClick={() => router.push(item.href)}
               className={cn(
                 "p-4 rounded-full transition-all duration-300",
                 pathname === item.href 
                  ? "bg-primary text-black shadow-[0_0_20px_rgba(255,159,10,0.4)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
               )}
             >
               <item.icon size={20} />
             </button>
          ))}
        </div>
      )}
    </div>
  );
}
