import { StudentShell } from '@/layouts/StudentShell';
import { ListeningLibraryView } from '@/modules/listening/ListeningLibraryView';

export const metadata = {
  title: 'Listening Library — IELTS Ultimate',
  description: '4-part IELTS Listening practice sets with demo audio playback and detailed transcripts.',
};

export default function ListeningPage() {
  return (
    <StudentShell>
      <ListeningLibraryView />
    </StudentShell>
  );
}

