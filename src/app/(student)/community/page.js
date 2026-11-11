import { StudentShell } from '@/layouts/StudentShell';
import { CommunityView } from '@/modules/community/CommunityView';

export const metadata = {
  title: 'Community — IELTSWIST',
  description: 'Discuss IELTS strategies, swap essay reviews, and join study groups.',
};

export default function CommunityPage() {
  return (
    <StudentShell>
      <CommunityView />
    </StudentShell>
  );
}

