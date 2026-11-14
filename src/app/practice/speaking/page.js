import React from 'react';
import { PublicShell } from '@/layouts/PublicShell';
import { SpeakingPracticeView } from '@/modules/public/SpeakingPracticeView';

export const metadata = {
  title: 'IELTS Speaking Practice & Comprehensive Preparation Guide | IELTS Ultimate',
  description:
    'Prepare for IELTS Speaking Parts 1, 2, and 3 with official scoring rubrics, 1-minute cue card frameworks, PEEC discussion strategies, and Whisper AI evaluation.',
};

export default function SpeakingPracticePage() {
  return (
    <PublicShell>
      <SpeakingPracticeView />
    </PublicShell>
  );
}

