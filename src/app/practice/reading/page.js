import React from 'react';
import { PublicShell } from '@/layouts/PublicShell';
import { ReadingPracticeView } from '@/modules/public/ReadingPracticeView';

export const metadata = {
  title: 'IELTS Academic Reading Practice & Comprehensive Guide | IELTS Ultimate',
  description:
    'Master all 14 IELTS Academic Reading question types, 3-passage architecture, Cambridge IELTS Books 9–25 test library, time management strategies, and band conversion tables.',
};

export default function ReadingPracticePage() {
  return (
    <PublicShell>
      <ReadingPracticeView />
    </PublicShell>
  );
}

