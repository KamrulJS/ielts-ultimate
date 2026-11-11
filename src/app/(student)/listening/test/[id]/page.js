import { ListeningExamInterface } from '@/modules/listening/ListeningExamInterface';

export const metadata = {
  title: 'Listening Exam — IELTS Ultimate',
  description: 'Distraction-free IELTS Listening audio practice session.',
};

export default async function ListeningTestPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  return <ListeningExamInterface testId={id} initialPart={sp?.part || 1} />;
}

