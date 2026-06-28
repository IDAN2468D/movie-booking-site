'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MgmSplashScreen } from '@/components/ui/MgmSplashScreen';

export default function SplashPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/');
  };

  return (
    <MgmSplashScreen onComplete={handleComplete} />
  );
}
