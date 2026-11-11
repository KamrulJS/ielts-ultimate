import { PublicShell } from '@/layouts/PublicShell';
import { LiveClassesView } from '@/modules/public/LiveClassesView';

export const metadata = {
  title: 'Live Free Class — IELTS Ultimate',
  description:
    'Join free upcoming live IELTS strategy clinics, register your online seat, and preview recorded study workshops.',
};

export default function LiveClassesPage() {
  return (
    <PublicShell>
      <LiveClassesView />
    </PublicShell>
  );
}

