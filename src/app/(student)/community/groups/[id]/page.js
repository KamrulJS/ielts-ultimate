import { StudentShell } from '@/layouts/StudentShell';
import { GroupDetailView } from '@/modules/community/GroupDetailView';

export default async function CommunityGroupPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <GroupDetailView groupId={id} />
    </StudentShell>
  );
}

