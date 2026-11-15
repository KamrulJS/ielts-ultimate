'use client';
import styles from './MyProfileView.module.css';

import React, { useState } from 'react';
import Link from 'next/link';
import { Edit3, Settings, Target, Calendar, Award, Flame } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge, StatCard } from '@/components/common/UiPrimitives';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import { EditProfileModal, TargetBandModal, ScheduleExamModal } from '@/components/modals/DashboardModals';

export function MyProfileView() {
  const { auth, profile, updateProfile } = useApp();
  const displayName = auth?.isAuthenticated && auth?.name ? auth.name : profile.name;
  const displayEmail = auth?.isAuthenticated && auth?.email ? auth.email : profile.email;
  const displayAvatar = auth?.isAuthenticated ? (auth.avatar || null) : profile.avatar;

  const [editOpen, setEditOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);

  return (
    <div className={styles.mypr_div_1}>
      <PageHeader
        title="My Profile"
        description="Manage your student details, target IELTS band, exam timeline, and study preferences."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'My Profile' }]}
        actions={
          <div className={styles.mypr_div_2}>
            <Link href="/settings" className="btn btn-secondary btn-sm">
              <Settings size={14} /> Account Settings
            </Link>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditOpen(true)}>
              <Edit3 size={14} /> Edit Profile
            </button>
          </div>
        }
      />

      <div className={`card ${styles.mypr_div_3}`} >
        <div
          style={{
            height: 130,
            background: 'linear-gradient(120deg, #242424 0%, #3E3356 60%, #F6BD28 150%)',
            backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{ padding: '0 24px 24px', marginTop: -36, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div className={styles.mypr_div_4}>
            <SafeAvatar
              src={displayAvatar}
              name={displayName}
              size={84}
              radius="18px"
              className={styles.mypr_safeavatar_5}
            />
            <div className={styles.mypr_div_6}>
              <div className={styles.mypr_div_7}>
                <h2 className="h2">{displayName}</h2>
                <Badge variant="purple">{profile.track}</Badge>
                <Badge variant="yellow">{profile.plan}</Badge>
              </div>
              <div className="text-sm text-muted">
                {profile.city}, {profile.country} • {displayEmail}
              </div>
            </div>
          </div>

          <div className={styles.mypr_div_8}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setTargetOpen(true)}>
              Target: {profile.targetBand}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setExamOpen(true)}>
              Exam: {profile.examDate}
            </button>
          </div>
        </div>
      </div>

      <div className="grid-4">
        <StatCard label="Current Estimated" value={profile.currentBand.toFixed(1)} icon={Award} dark />
        <StatCard label="Target Band" value={profile.targetBand.toFixed(1)} icon={Target} />
        <StatCard label="Study Streak" value={`${profile.streakDays} days`} icon={Flame} />
        <StatCard label="Exam Sitting" value={profile.examDate} icon={Calendar} />
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className={`h3 ${styles.mypr_h3_9}`} >Academic Objective & Bio</h3>
          <p className={`text-sm text-muted ${styles.mypr_p_10}`} >{profile.bio}</p>
        </div>

        <div className="card">
          <h3 className={`h3 ${styles.mypr_h3_11}`} >Learning Preferences</h3>
          <div className={styles.mypr_div_12}>
            <div className="field-group">
              <label className="field-label" htmlFor="pref-accent">Preferred Listening Accent</label>
              <select
                id="pref-accent"
                className="select"
                value={profile.preferences.preferredAccent}
                onChange={(e) => updateProfile({ preferences: { preferredAccent: e.target.value } })}
              >
                <option value="British (RP)">British (RP)</option>
                <option value="North American">North American</option>
                <option value="Australian / NZ">Australian / NZ</option>
                <option value="Mixed Academic">Mixed Academic</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="pref-goal">Daily Study Goal (Minutes)</label>
              <select
                id="pref-goal"
                className="select"
                value={profile.preferences.dailyGoalMinutes}
                onChange={(e) => updateProfile({ preferences: { dailyGoalMinutes: Number(e.target.value) } })}
              >
                {[45, 60, 90, 120, 150].map((m) => (
                  <option key={m} value={m}>{m} minutes / day</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <TargetBandModal open={targetOpen} onClose={() => setTargetOpen(false)} />
      <ScheduleExamModal open={examOpen} onClose={() => setExamOpen(false)} />
    </div>
  );
}

