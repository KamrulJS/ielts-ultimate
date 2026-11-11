import { StudentShell } from '@/layouts/StudentShell';
import { InviteFriendsView } from '@/modules/referrals/InviteFriendsView';

export const metadata = {
  title: 'Invite Friends — IELTSWIST',
  description: 'Share your IELTSWIST referral link and earn complimentary Plus membership days.',
};

export default function InviteFriendsPage() {
  return (
    <StudentShell>
      <InviteFriendsView />
    </StudentShell>
  );
}

