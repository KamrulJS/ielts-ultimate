import { StudentShell } from '@/layouts/StudentShell';
import { WritingResultView } from '@/modules/writing/WritingResultView';

export default async function WritingResultPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <WritingResultView submissionId={id} />
    </StudentShell>
  );
}

