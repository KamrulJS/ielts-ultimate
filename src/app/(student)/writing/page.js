import { StudentShell } from '@/layouts/StudentShell';
import { WritingLibraryView } from '@/modules/writing/WritingLibraryView';

export const metadata = {
  title: 'Writing Studio — IELTS Ultimate',
  description: 'Academic Task 1 & Task 2 IELTS Writing prompts, visual charts, timed editor, and demo rubric evaluation.',
};

export default function WritingPage() {
  return (
    <StudentShell>
      <WritingLibraryView />
    </StudentShell>
  );
}

