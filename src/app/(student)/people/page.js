import { StudentShell } from '@/layouts/StudentShell';
import { PeopleDirectoryView } from '@/modules/people/PeopleDirectoryView';

export const metadata = {
  title: 'Students & Teachers — IELTSWIST',
  description: 'Connect with verified IELTS instructors and fellow learners for consultations and practice.',
};

export default function PeoplePage() {
  return (
    <StudentShell>
      <PeopleDirectoryView />
    </StudentShell>
  );
}

