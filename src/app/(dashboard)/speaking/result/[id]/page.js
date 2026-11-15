import { StudentShell } from '@/layouts/StudentShell';
import { SpeakingResultView } from '@/modules/dashboard/speaking/SpeakingResultView';

export default async function SpeakingResultPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <SpeakingResultView resultId={id} />
    </StudentShell>
  );
}

