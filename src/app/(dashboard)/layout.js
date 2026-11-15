import React, { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function StudentPortalLayout({ children }) {
  return (
    <Suspense fallback={<div className="page-loading-skeleton" />}>
      <AuthGuard requiredRole="student">{children}</AuthGuard>
    </Suspense>
  );
}

