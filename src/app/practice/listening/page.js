import React from 'react';
import { PublicShell } from '@/layouts/PublicShell';
import { ListeningPracticeView } from '@/modules/public/ListeningPracticeView';

export const metadata = {
  title: 'IELTS Listening Practice & Preparation Guide | IELTS Ultimate',
  description:
    'Prepare for IELTS Listening with 52 graded mock tests across Sections 1 to 4, question format guides, scoring band tables, distractor strategies, and interactive practice drills.',
};

export default function ListeningPracticePage() {
  return (
    <PublicShell>
      <ListeningPracticeView />
    </PublicShell>
  );
}

