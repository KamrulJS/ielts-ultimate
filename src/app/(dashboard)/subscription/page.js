import { StudentShell } from '@/layouts/StudentShell';
import { SubscriptionView } from '@/modules/dashboard/account/SubscriptionView';

export const metadata = { title: 'Subscription — IELTS Ultimate' };

export default function SubscriptionPage() {
  return (
    <StudentShell>
      <SubscriptionView />
    </StudentShell>
  );
}

