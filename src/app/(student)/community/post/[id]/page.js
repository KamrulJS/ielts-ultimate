import { StudentShell } from '@/layouts/StudentShell';
import { PostDetailView } from '@/modules/community/PostDetailView';

export default async function CommunityPostPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <PostDetailView postId={id} />
    </StudentShell>
  );
}

