import { StudentShell } from '@/layouts/StudentShell';
import { ResultDetailView } from '@/modules/results/ResultDetailView';

export default async function MockResultDetailPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <ResultDetailView resultId={id} expectedType="mock" />
    </StudentShell>
  );
}

