import React, { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function StudentPortalLayout({ children }) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }} />}>
      <AuthGuard requiredRole="student">{children}</AuthGuard>
    </Suspense>
  );
}

