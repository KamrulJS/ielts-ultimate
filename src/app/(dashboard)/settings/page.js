import { StudentShell } from '@/layouts/StudentShell';
import { AccountSettingsView } from '@/modules/dashboard/account/AccountSettingsView';

export const metadata = { title: 'Account Settings — IELTS Ultimate' };

export default function SettingsPage() {
  return (
    <StudentShell>
      <AccountSettingsView />
    </StudentShell>
  );
}

