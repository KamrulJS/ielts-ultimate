import { PublicShell } from '@/layouts/PublicShell';
import { PublicHomeView } from '@/modules/public/PublicHomeView';

export const metadata = {
  title: 'IELTS Ultimate — Complete IELTS Preparation Platform',
  description:
    'Prepare for IELTS Academic and General Training with full timed simulations, AI Writing & Speaking criterion evaluation, personalized study plans, vocabulary mastery, and live mentorship.',
};

export default function HomePage() {
  return (
    <PublicShell>
      <PublicHomeView />
    </PublicShell>
  );
}
