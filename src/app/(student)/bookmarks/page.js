import { StudentShell } from '@/layouts/StudentShell';
import { BookmarksView } from '@/modules/account/BookmarksView';

export const metadata = { title: 'My Bookmarks — IELTSWIST' };

export default function BookmarksPage() {
  return (
    <StudentShell>
      <BookmarksView />
    </StudentShell>
  );
}

