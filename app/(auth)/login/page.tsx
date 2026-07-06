'use client';

import React from 'react';
import AuthGateForm from '@/components/auth/AuthGateForm';

export default function LoginPage() {
  return <AuthGateForm initialView="login" />;
}
