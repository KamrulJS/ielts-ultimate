import { StudentShell } from '@/layouts/StudentShell';
import { MockTestLibraryView } from '@/modules/mock/MockTestLibraryView';

export const metadata = {
  title: 'Full Mock Test — IELTSWIST',
  description: 'Take complete 2h 40m IELTS Academic and General Training mock examinations.',
};

export default function MockTestPage() {
  return (
    <StudentShell>
      <MockTestLibraryView />
    </StudentShell>
  );
}

