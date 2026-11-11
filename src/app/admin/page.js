import React, { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AdminConsoleView } from '@/modules/admin/AdminConsoleView';

export const metadata = {
  title: 'Admin Console — IELTS Ultimate',
  description: 'Manage IELTS Ultimate students, instructors, mock examinations, content libraries, and analytics.',
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }} />}>
      <AuthGuard requiredRole="admin">
        <AdminConsoleView />
      </AuthGuard>
    </Suspense>
  );
}

