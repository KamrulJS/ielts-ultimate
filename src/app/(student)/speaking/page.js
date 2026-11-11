import { StudentShell } from '@/layouts/StudentShell';
import { SpeakingLibraryView } from '@/modules/speaking/SpeakingLibraryView';

export const metadata = {
  title: 'Speaking Studio — IELTSWIST',
  description: 'Practice IELTS Speaking Parts 1, 2, and 3 with microphone recording and cue card timers.',
};

export default function SpeakingPage() {
  return (
    <StudentShell>
      <SpeakingLibraryView />
    </StudentShell>
  );
}

