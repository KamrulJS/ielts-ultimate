import { StudentShell } from '@/layouts/StudentShell';
import { NotificationsView } from '@/modules/account/NotificationsView';

export const metadata = { title: 'Notifications — IELTS Ultimate' };

export default function NotificationsPage() {
  return (
    <StudentShell>
      <NotificationsView />
    </StudentShell>
  );
}

