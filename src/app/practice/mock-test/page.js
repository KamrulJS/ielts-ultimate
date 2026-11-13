import React from 'react';
import { PublicShell } from '@/layouts/PublicShell';
import { FullTestPracticeView } from '@/modules/public/FullTestPracticeView';

export const metadata = {
  title: 'IELTS Full Mock Test Simulation & Exam Day Preparation Guide | IELTS WIST',
  description:
    'Experience authentic 2h 40m computer-delivered IELTS exam simulations covering Listening, Reading, Writing, and Speaking with live composite band calculations.',
};

export default function MockTestPracticePage() {
  return (
    <PublicShell>
      <FullTestPracticeView />
    </PublicShell>
  );
}

