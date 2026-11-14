import { StudentShell } from '@/layouts/StudentShell';
import { MockTestLibraryView } from '@/modules/mock/MockTestLibraryView';

export const metadata = {
  title: 'Full Mock Test — IELTS Ultimate',
  description: 'Take complete 2h 40m IELTS Academic mock examinations.',
};

export default function MockTestPage() {
  return (
    <StudentShell>
      <MockTestLibraryView />
    </StudentShell>
  );
}

