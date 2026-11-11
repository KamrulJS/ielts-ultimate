import { StudentShell } from '@/layouts/StudentShell';
import { QuestionTypeDetailView } from '@/modules/question-types/QuestionTypeDetailView';

export default async function QuestionTypeDetailPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <QuestionTypeDetailView guideId={id} />
    </StudentShell>
  );
}

