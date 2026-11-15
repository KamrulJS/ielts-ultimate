import React, { Suspense } from 'react';
import { LoginView } from '@/modules/frontend/LoginView';

export const metadata = {
  title: 'Sign In — IELTS Ultimate',
  description:
    'Log in or create a free student account to access the IELTS Ultimate study dashboard, simulations, and admin portal.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="page-loading-skeleton" />}>
      <LoginView />
    </Suspense>
  );
}

