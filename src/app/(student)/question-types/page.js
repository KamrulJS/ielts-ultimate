import { StudentShell } from '@/layouts/StudentShell';
import { QuestionTypesLibraryView } from '@/modules/question-types/QuestionTypesLibraryView';

export const metadata = {
  title: 'Question Types — IELTS Ultimate',
  description: 'Learn solving strategies and practice every IELTS Reading, Listening, Writing, and Speaking question type.',
};

export default function QuestionTypesPage() {
  return (
    <StudentShell>
      <QuestionTypesLibraryView />
    </StudentShell>
  );
}

