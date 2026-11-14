import React from 'react';
import { PublicShell } from '@/layouts/PublicShell';
import { PricingView } from '@/modules/public/PricingView';

export const metadata = {
  title: 'Pricing & Plans | IELTS Ultimate',
  description: 'Explore IELTS Ultimate preparation plans: Free Starter, Pro Academic, and Ultimate AI Coach.',
};

export default function PricingPage() {
  return (
    <PublicShell>
      <PricingView />
    </PublicShell>
  );
}
