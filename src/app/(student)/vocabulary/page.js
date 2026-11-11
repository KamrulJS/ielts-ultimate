import { StudentShell } from '@/layouts/StudentShell';
import { VocabularyView } from '@/modules/vocabulary/VocabularyView';

export const metadata = {
  title: 'Vocabulary — IELTSWIST',
  description: 'Academic IELTS vocabulary flashcards, definitions, audio pronunciation, and interactive quizzes.',
};

export default function VocabularyPage() {
  return (
    <StudentShell>
      <VocabularyView />
    </StudentShell>
  );
}

