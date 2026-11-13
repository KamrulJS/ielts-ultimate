import React from 'react';
import { PublicShell } from '@/layouts/PublicShell';
import { WritingPracticeView } from '@/modules/public/WritingPracticeView';

export const metadata = {
  title: 'IELTS Writing Practice & Complete Preparation Guide | IELTS WIST',
  description:
    'Master IELTS Writing Task 1 visual reports and Task 2 discursive essays with official band descriptors, time management strategies, Band 9 model answers, and instant AI evaluation.',
};

export default function WritingPracticePage() {
  return (
    <PublicShell>
      <WritingPracticeView />
    </PublicShell>
  );
}

