'use client';
import styles from './AccountSettingsView.module.css';

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
    <div className={styles.acco_div_1}>
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
        <form onSubmit={handleSaveAccount} className={`card ${styles.acco_form_2}`} >
          <div className={styles.acco_div_3}>
            <Shield size={17} className={styles.acco_shield_4} />
            <h2 className="h3">Email & Identity</h2>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="set-email">Account Email</label>
            <input id="set-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="set-track">Examination Stream</label>
            <select
              id="set-track"
              className={`select ${styles.acco_select_5}`}
              value="Academic"
              disabled
              
            >
              <option value="Academic">IELTS Academic (Dedicated)</option>
            </select>
          </div>
          <button type="submit" className={`btn btn-primary ${styles.acco_button_6}`} >
            Save Account Details
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className={`card ${styles.acco_form_2}`} >
          <div className={styles.acco_div_7}>
            <div className={styles.acco_div_3}>
              <Lock size={17} className={styles.acco_shield_4} />
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
          <button type="submit" className={`btn btn-secondary ${styles.acco_button_6}`} >
            Update Password
          </button>
        </form>
      </div>

      <div className={`card ${styles.acco_form_2}`} >
        <div className={styles.acco_div_3}>
          <Bell size={17} className={styles.acco_shield_4} />
          <h2 className="h3">Preferences & Local Storage</h2>
        </div>

        <label className={styles.acco_label_8}>
          <div>
            <div className={styles.acco_div_9}>Daily Study Reminder Alerts</div>
            <div className="text-xs text-muted">Notify before scheduled study plan targets</div>
          </div>
          <input
            type="checkbox"
            checked={profile.preferences.remindersEnabled}
            onChange={(e) => updateProfile({ preferences: { remindersEnabled: e.target.checked } })}
          />
        </label>

        <div className={styles.acco_div_10}>
          <div>
            <div className={styles.acco_div_9}>Reset Demo Browser Progress</div>
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

