'use client';

import React, { useState } from 'react';
import { Shield, Lock, Bell, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

export function AccountSettingsView() {
  const { profile, updateProfile, resetDemoProgress, showToast } = useApp();
  const [email, setEmail] = useState(profile.email);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [resetOpen, setResetOpen] = useState(false);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    updateProfile({ email: email.trim() });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPwd.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setCurrentPwd('');
    setNewPwd('');
    showToast('Password updated (local demo demonstration)', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="Account Settings"
        description="Manage login credentials, study notifications, and browser LocalStorage persistence."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Profile', href: '/profile' },
          { label: 'Settings' },
        ]}
      />

      <div className="grid-2">
        <form onSubmit={handleSaveAccount} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={17} style={{ color: 'var(--accent-purple)' }} />
            <h2 className="h3">Email & Identity</h2>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="set-email">Account Email</label>
            <input id="set-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="set-track">Default IELTS Track</label>
            <select
              id="set-track"
              className="select"
              value={profile.track}
              onChange={(e) => updateProfile({ track: e.target.value })}
            >
              <option value="Academic">Academic</option>
              <option value="General Training">General Training</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            Save Account Details
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={17} style={{ color: 'var(--accent-purple)' }} />
              <h2 className="h3">Security & Password</h2>
            </div>
            <Badge variant="yellow">Demo Mode</Badge>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="pwd-curr">Current Password</label>
            <input id="pwd-curr" type="password" className="input" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="pwd-new">New Password</label>
            <input id="pwd-new" type="password" className="input" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="Minimum 6 characters" />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
            Update Password
          </button>
        </form>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={17} style={{ color: 'var(--accent-purple)' }} />
          <h2 className="h3">Preferences & Local Storage</h2>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Daily Study Reminder Alerts</div>
            <div className="text-xs text-muted">Notify before scheduled study plan targets</div>
          </div>
          <input
            type="checkbox"
            checked={profile.preferences.remindersEnabled}
            onChange={(e) => updateProfile({ preferences: { remindersEnabled: e.target.checked } })}
          />
        </label>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 6 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Reset Demo Browser Progress</div>
            <div className="text-xs text-muted">Restore default Emily Johnson sample data in LocalStorage</div>
          </div>
          <button type="button" className="btn btn-danger btn-sm" onClick={() => setResetOpen(true)}>
            <RotateCcw size={14} /> Reset Local State
          </button>
        </div>
      </div>

      <ConfirmationDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={resetDemoProgress}
        title="Reset Local Demo State?"
        message="This clears locally added test results, custom study tasks, bookmarks, and profile edits back to the default sample dataset."
        confirmLabel="Reset Data"
        danger
      />
    </div>
  );
}

