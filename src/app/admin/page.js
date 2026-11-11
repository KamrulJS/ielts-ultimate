import { AdminConsoleView } from '@/modules/admin/AdminConsoleView';

export const metadata = {
  title: 'Admin Console — IELTS Ultimate',
  description: 'Manage IELTS Ultimate students, instructors, mock examinations, content libraries, and analytics.',
};

export default function AdminPage() {
  return <AdminConsoleView />;
}

