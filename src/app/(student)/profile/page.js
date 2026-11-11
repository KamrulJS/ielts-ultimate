import { StudentShell } from '@/layouts/StudentShell';
import { MyProfileView } from '@/modules/account/MyProfileView';

export const metadata = { title: 'My Profile — IELTS Ultimate' };

export default function ProfilePage() {
  return (
    <StudentShell>
      <MyProfileView />
    </StudentShell>
  );
}

