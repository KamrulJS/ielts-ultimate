import React, { Suspense } from 'react';
import { LoginView } from '@/modules/public/LoginView';

export const metadata = {
  title: 'Sign In — IELTS Ultimate',
  description:
    'Log in or create a free student account to access the IELTS Ultimate study dashboard, simulations, and admin portal.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }} />}>
      <LoginView />
    </Suspense>
  );
}

