import { StudentShell } from '@/layouts/StudentShell';
import { HelpCenterView } from '@/modules/account/HelpCenterView';

export const metadata = { title: 'Help Center — IELTS Ultimate' };

export default function HelpPage() {
  return (
    <StudentShell>
      <HelpCenterView />
    </StudentShell>
  );
}

