'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ElementalSplash } from '@/components/splash/ElementalSplash';

export default function SplashPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/');
  };

  return (
    <ElementalSplash onComplete={handleComplete} />
  );
}
