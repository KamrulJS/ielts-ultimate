import { StudentShell } from '@/layouts/StudentShell';
import { AchievementsView } from '@/modules/account/AchievementsView';

export const metadata = { title: 'Achievements — IELTS Ultimate' };

export default function AchievementsPage() {
  return (
    <StudentShell>
      <AchievementsView />
    </StudentShell>
  );
}

