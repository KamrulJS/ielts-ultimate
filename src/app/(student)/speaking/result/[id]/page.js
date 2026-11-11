import { StudentShell } from '@/layouts/StudentShell';
import { SpeakingResultView } from '@/modules/speaking/SpeakingResultView';

export default async function SpeakingResultPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <SpeakingResultView resultId={id} />
    </StudentShell>
  );
}

