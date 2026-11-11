import { StudentShell } from '@/layouts/StudentShell';
import { TestResultsView } from '@/modules/results/TestResultsView';

export const metadata = {
  title: 'Test Results — IELTSWIST',
  description: 'Review your full IELTS mock tests and individual Reading, Listening, Writing, and Speaking scores.',
};

export default function TestResultsPage() {
  return (
    <StudentShell>
      <TestResultsView />
    </StudentShell>
  );
}

