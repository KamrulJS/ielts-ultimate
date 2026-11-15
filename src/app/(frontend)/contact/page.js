import React, { Suspense } from 'react';
import { PublicShell } from '@/layouts/PublicShell';
import { ContactView } from '@/modules/frontend/ContactView';

export const metadata = {
  title: 'Contact — IELTS Ultimate',
  description:
    'Contact the IELTS Ultimate student advisory, live classes, proofreading, or study abroad mentoring support desk.',
};

export default function ContactPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="page-loading-skeleton-compact" />}>
        <ContactView />
      </Suspense>
    </PublicShell>
  );
}

