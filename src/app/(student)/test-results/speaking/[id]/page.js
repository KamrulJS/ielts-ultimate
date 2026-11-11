import { StudentShell } from '@/layouts/StudentShell';
import { ResultDetailView } from '@/modules/results/ResultDetailView';

export default async function SpeakingResultDetailPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <ResultDetailView resultId={id} expectedType="speaking" />
    </StudentShell>
  );
}

