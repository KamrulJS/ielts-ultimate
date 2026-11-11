import { StudentShell } from '@/layouts/StudentShell';
import { AccountSettingsView } from '@/modules/account/AccountSettingsView';

export const metadata = { title: 'Account Settings — IELTSWIST' };

export default function SettingsPage() {
  return (
    <StudentShell>
      <AccountSettingsView />
    </StudentShell>
  );
}

