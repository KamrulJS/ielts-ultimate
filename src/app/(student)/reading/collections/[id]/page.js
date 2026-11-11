import { StudentShell } from '@/layouts/StudentShell';
import { ReadingCollectionView } from '@/modules/reading/ReadingCollectionView';

export default async function ReadingCollectionPage({ params }) {
  const { id } = await params;
  return (
    <StudentShell>
      <ReadingCollectionView collectionId={id} />
    </StudentShell>
  );
}

