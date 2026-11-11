import { StudentShell } from '@/layouts/StudentShell';
import { ToolsHubView } from '@/modules/tools/ToolsHubView';

export const metadata = {
  title: 'More Tools — IELTS Ultimate',
  description: 'Band score calculator, writing templates, typing drill, reading speed tracker, and study timer.',
};

export default async function ToolsPage({ searchParams }) {
  const sp = await searchParams;
  return (
    <StudentShell>
      <ToolsHubView initialTool={sp?.tool || 'band-calculator'} />
    </StudentShell>
  );
}

