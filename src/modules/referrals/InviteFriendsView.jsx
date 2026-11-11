'use client';

import React, { useState } from 'react';
import { Copy, Share2, Gift, Users, CheckCircle2, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge, StatCard } from '@/components/common/UiPrimitives';
import { DataTable } from '@/components/common/DataControls';
import { Modal } from '@/components/common/Modal';

export function InviteFriendsView() {
  const { referrals, addReferralInvite, showToast } = useApp();
  const rootRef = useGsapEntrance('invite-friends');

  const [shareOpen, setShareOpen] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(referrals.referralLink).catch(() => {});
    }
    showToast('Unique referral link copied!', 'success');
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!friendName.trim() || !friendEmail.trim()) return;
    addReferralInvite(friendName.trim(), friendEmail.trim());
    setFriendName('');
    setFriendEmail('');
    setShareOpen(false);
  };

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0, width: '100%', maxWidth: '100%' }}>
      <PageHeader
        title="Invite Friends & Earn Plus Days"
        description="Every friend who completes their first practice test unlocks 7 free days of IELTS Ultimate Plus for both of you."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Invite Friends' }]}
        actions={
          <button type="button" className="btn btn-accent" onClick={() => setShareOpen(true)}>
            <Share2 size={16} /> Send Invite
          </button>
        }
      />

      <div className="grid-3">
        <StatCard label="Earned Plus Time" value={`${referrals.rewardSummary.totalEarnedDays} Days`} hint="From verified sign-ups" icon={Gift} dark />
        <StatCard label="Friends Invited" value={referrals.rewardSummary.invitedCount} hint="Track status below" icon={Users} />
        <StatCard label="Reward Credited" value={referrals.rewardSummary.convertedCount} hint={referrals.rewardSummary.perInviteReward + ' each'} icon={CheckCircle2} />
      </div>

      {/* Referral Link Box */}
      <div data-animate="card" className="card-warm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="field-label">Your Unique Referral Link</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <input
            readOnly
            className="input"
            value={referrals.referralLink}
            style={{ flex: '1 1 200px', minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
          <button type="button" className="btn btn-primary" onClick={handleCopy}>
            <Copy size={15} /> Copy Link
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setShareOpen(true)}>
            <Send size={15} /> Invite by Email
          </button>
        </div>
      </div>

      {/* Referral History */}
      <div style={{ minWidth: 0, width: '100%' }}>
        <h2 className="h2" style={{ marginBottom: 12 }}>Invitation & Reward History</h2>
        <DataTable
          data={referrals.invitedFriends}
          columns={[
            { key: 'name', label: 'Friend' },
            { key: 'email', label: 'Email' },
            { key: 'date', label: 'Invited On' },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <Badge variant={r.status === 'Reward Credited' ? 'success' : 'yellow'}>
                  {r.status}
                </Badge>
              ),
            },
            { key: 'reward', label: 'Reward' },
          ]}
        />
      </div>

      {/* Invite Share Popup */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Send Personal Invitation" subtitle="Simulate inviting a friend via email (demo).">
        <form onSubmit={handleSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="inv-name">Friend&apos;s Name</label>
            <input id="inv-name" className="input" required value={friendName} onChange={(e) => setFriendName(e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="inv-email">Friend&apos;s Email</label>
            <input id="inv-email" type="email" className="input" required value={friendEmail} onChange={(e) => setFriendEmail(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShareOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Send Invitation</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

