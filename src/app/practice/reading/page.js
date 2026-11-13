import React from 'react';
import { PublicShell } from '@/layouts/PublicShell';
import { ReadingPracticeView } from '@/modules/public/ReadingPracticeView';

export const metadata = {
  title: 'IELTS Reading Practice & Comprehensive Guide | IELTS WIST',
  description:
    'Master all 14 IELTS Reading question types, academic vs general training formats, Cambridge IELTS Books 9–25 test library, time management strategies, and band conversion tables.',
};

export default function ReadingPracticePage() {
  return (
    <PublicShell>
      <ReadingPracticeView />
    </PublicShell>
  );
}

