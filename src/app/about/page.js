import { PublicShell } from '@/layouts/PublicShell';
import { AboutView } from '@/modules/public/AboutView';

export const metadata = {
  title: 'About — IELTS Ultimate',
  description:
    'Learn about IELTS Ultimate’s teaching philosophy, mission, educators, and why learners rely on our structured IELTS preparation platform.',
};

export default function AboutPage() {
  return (
    <PublicShell>
      <AboutView />
    </PublicShell>
  );
}

