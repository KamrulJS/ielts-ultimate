import { MockExamSession } from '@/modules/mock/MockExamSession';

export const metadata = {
  title: 'Mock Exam Session — IELTS Ultimate',
  description: 'Distraction-free timed 4-module IELTS mock examination.',
};

export default async function MockSessionPage({ params }) {
  const { id } = await params;
  return <MockExamSession mockId={id} />;
}

