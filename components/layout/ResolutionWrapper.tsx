'use client';

import React from 'react';
import { useUIStore } from '@/lib/store/ui-store';
import { cn } from '@/lib/utils';

interface ResolutionWrapperProps {
  children: React.ReactNode;
}

export default function ResolutionWrapper({ children }: ResolutionWrapperProps) {
  const { resolution } = useUIStore();

  const getWrapperClass = () => {
    switch (resolution) {
      case 'fullhd': return 'res-fullhd';
      case 'laptop': return 'res-laptop';
      case 'mobile': return 'res-mobile-view';
      default: return '';
    }
  };

  return (
    <div id="main-content-wrapper-outer" className={cn("w-full transition-all duration-500", getWrapperClass())}>
      <div id="main-content-wrapper" className="min-h-screen">
        {children}
      </div>
    </div>
  );
}
