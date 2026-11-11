import { SpeakingSimulator } from '@/modules/speaking/SpeakingSimulator';

export const metadata = {
  title: 'Speaking Simulator — IELTS Ultimate',
  description: 'Distraction-free IELTS Speaking Parts 1-3 examination simulator.',
};

export default async function SpeakingPracticePage({ params }) {
  const { id } = await params;
  return <SpeakingSimulator topicId={id} />;
}

