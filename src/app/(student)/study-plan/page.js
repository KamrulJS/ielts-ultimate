import { StudentShell } from '@/layouts/StudentShell';
import { StudyPlanView } from '@/modules/study-plan/StudyPlanView';

export const metadata = {
  title: 'Study Plan — IELTS Ultimate',
  description: 'Build and track your personalized IELTS preparation calendar and daily task checklist.',
};

export default function StudyPlanPage() {
  return (
    <StudentShell showUtilityPanel>
      <StudyPlanView />
    </StudentShell>
  );
}

