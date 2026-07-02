'use client';

import React from 'react';
import AuthGate from '@/components/auth/AuthGate';

export default function RegisterPage() {
  return <AuthGate initialView="register" />;
}
