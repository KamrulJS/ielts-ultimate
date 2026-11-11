import { AdminConsoleView } from '@/modules/admin/AdminConsoleView';

export const metadata = {
  title: 'Admin Console — IELTSWIST',
  description: 'Manage IELTSWIST students, instructors, mock examinations, content libraries, and analytics.',
};

export default function AdminPage() {
  return <AdminConsoleView />;
}

