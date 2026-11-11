import { StudentShell } from '@/layouts/StudentShell';
import { MyProfileView } from '@/modules/account/MyProfileView';

export const metadata = { title: 'My Profile — IELTSWIST' };

export default function ProfilePage() {
  return (
    <StudentShell>
      <MyProfileView />
    </StudentShell>
  );
}

