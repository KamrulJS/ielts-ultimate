import { StudentShell } from '@/layouts/StudentShell';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const metadata = {
  title: 'Dashboard — IELTS Ultimate',
  description: 'Track your IELTS band progression, study streak, upcoming sessions, and daily preparation plan.',
};

export default function DashboardPage() {
  return (
    <StudentShell showUtilityPanel>
      <DashboardClient />
    </StudentShell>
  );
}

