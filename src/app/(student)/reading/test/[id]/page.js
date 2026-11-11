import { ReadingExamInterface } from '@/modules/reading/ReadingExamInterface';

export const metadata = {
  title: 'Reading Exam — IELTSWIST',
  description: 'Distraction-free split-screen IELTS Reading examination.',
};

export default async function ReadingTestPage({ params }) {
  const { id } = await params;
  return <ReadingExamInterface passageId={id} />;
}

