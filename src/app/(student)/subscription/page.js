import { StudentShell } from '@/layouts/StudentShell';
import { SubscriptionView } from '@/modules/account/SubscriptionView';

export const metadata = { title: 'Subscription — IELTSWIST' };

export default function SubscriptionPage() {
  return (
    <StudentShell>
      <SubscriptionView />
    </StudentShell>
  );
}

