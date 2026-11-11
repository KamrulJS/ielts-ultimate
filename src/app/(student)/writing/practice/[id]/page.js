import { WritingWorkspace } from '@/modules/writing/WritingWorkspace';

export const metadata = {
  title: 'Writing Practice — IELTS Ultimate',
  description: 'Distraction-free timed IELTS Writing workspace with word counter and autosave.',
};

export default async function WritingPracticePage({ params }) {
  const { id } = await params;
  return <WritingWorkspace taskId={id} />;
}

