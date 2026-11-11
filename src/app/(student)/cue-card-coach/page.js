import { StudentShell } from '@/layouts/StudentShell';
import { CueCardCoachView } from '@/modules/cue-card/CueCardCoachView';

export const metadata = {
  title: 'Cue Card Coach — IELTSWIST',
  description: 'Prepare for IELTS Speaking Part 2 with random cue cards, timers, recording, and Band 8.0 samples.',
};

export default function CueCardCoachPage() {
  return (
    <StudentShell>
      <CueCardCoachView />
    </StudentShell>
  );
}

