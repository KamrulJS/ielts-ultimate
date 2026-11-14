import { StudentShell } from '@/layouts/StudentShell';
import { ReadingLibraryView } from '@/modules/reading/ReadingLibraryView';

export const metadata = {
  title: 'Reading Library — IELTS Ultimate',
  description: 'Authentic IELTS Academic Reading passages, collections, and split-screen practice exams.',
};

export default function ReadingPage() {
  return (
    <StudentShell>
      <ReadingLibraryView />
    </StudentShell>
  );
}

