import { StudentShell } from '@/layouts/StudentShell';
import { InviteFriendsView } from '@/modules/referrals/InviteFriendsView';

export const metadata = {
  title: 'Invite Friends — IELTS Ultimate',
  description: 'Share your IELTS Ultimate referral link and earn complimentary Plus membership days.',
};

export default function InviteFriendsPage() {
  return (
    <StudentShell>
      <InviteFriendsView />
    </StudentShell>
  );
}

