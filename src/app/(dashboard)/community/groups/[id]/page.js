import { StudentShell } from '@/layouts/StudentShell';
import { GroupDetailView } from '@/modules/dashboard/community/GroupDetailView';

export default async function CommunityGroupPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <GroupDetailView groupId={id} />
    </StudentShell>
  );
}

