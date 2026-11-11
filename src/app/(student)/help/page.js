import { StudentShell } from '@/layouts/StudentShell';
import { HelpCenterView } from '@/modules/account/HelpCenterView';

export const metadata = { title: 'Help Center — IELTSWIST' };

export default function HelpPage() {
  return (
    <StudentShell>
      <HelpCenterView />
    </StudentShell>
  );
}

