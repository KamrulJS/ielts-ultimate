'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Calendar,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Copy,
  ArrowUpRight,
  Edit3,
  Clock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useIsMounted } from '@/hooks/useIsMounted';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import { formatReadableDate, getDaysRemaining } from '@/lib/utils';
import overviewData from '@/data/dashboard/overview.json';
import {
  EditProfileModal,
  TargetBandModal,
  ScheduleExamModal,
  CreateStudyTaskModal,
} from '@/components/modals/DashboardModals';

export function RightUtilityPanel() {
  const {
    profile,
    studyTasks,
    toggleStudyTask,
    testResults,
    referrals,
    showToast,
  } = useApp();

  const [calMode, setCalMode] = useState('week');
  const [selectedDay, setSelectedDay] = useState('2026-11-11');
  const [editOpen, setEditOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const mounted = useIsMounted();

  const daysLeft = mounted ? getDaysRemaining(profile.examDate) : null;
  const todayTasks = studyTasks.filter((t) => t.day === 'Today');
  const calendarDays =
    calMode === 'week'
      ? profile.streakCalendar.slice(7, 14)
      : profile.streakCalendar;
  const activeDayInfo = profile.streakCalendar.find((d) => d.date === selectedDay);

  const handleCopyInvite = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(referrals.referralLink).catch(() => {});
    }
    showToast('Referral link copied to clipboard', 'success');
  };

  return (
    <aside className="app-utility-column" aria-label="Student summary and schedule">
      {/* 1. Student Profile Summary Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            height: 68,
            background: 'linear-gradient(120deg, #F1EFE6 0%, #FEF6DD 55%, #F3EEFA 100%)',
            position: 'relative',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ position: 'absolute', top: 10, right: 10, padding: '4px 10px', fontSize: '0.75rem' }}
          >
            <Edit3 size={12} /> Edit
          </button>
        </div>
        <div style={{ padding: '0 16px 16px', marginTop: -24, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
            <SafeAvatar
              src={profile.avatar}
              name={profile.name}
              size={52}
              radius="14px"
              style={{ border: '3px solid var(--surface)', boxShadow: 'var(--shadow-xs)' }}
            />
            <Link href="/profile" className="text-xs" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
              View profile →
            </Link>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{profile.name}</div>
          <div className="text-xs text-muted" style={{ marginBottom: 12 }}>
            {profile.track} • {profile.plan}
          </div>

          {/* Target & Exam Countdown boxes */}
          <div className="grid-2" style={{ gap: 8 }}>
            <button
              type="button"
              onClick={() => setTargetOpen(true)}
              style={{
                textAlign: 'left',
                padding: '10px 11px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Target size={12} style={{ color: 'var(--accent-purple)' }} /> Target
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: 2 }}>
                Band {profile.targetBand}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setExamOpen(true)}
              style={{
                textAlign: 'left',
                padding: '10px 11px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={12} style={{ color: 'var(--accent-yellow)' }} /> Exam
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginTop: 3 }}>
                {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days left` : formatReadableDate(profile.examDate)}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Study Streak & Interactive Calendar */}
      <div className="card card-compact">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: 'var(--accent-yellow-soft)',
                color: '#9C6B00',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flame size={15} />
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{profile.streakDays}-day streak</div>
              <div className="text-xs text-muted">Keep the momentum going</div>
            </div>
          </div>
          <div className="tabs-list" style={{ padding: 2, flexWrap: 'nowrap', flexShrink: 0 }}>
            <button
              type="button"
              className={`tab-trigger ${calMode === 'week' ? 'active' : ''}`}
              style={{ padding: '4px 8px', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
              onClick={() => setCalMode('week')}
            >
              Week
            </button>
            <button
              type="button"
              className={`tab-trigger ${calMode === 'month' ? 'active' : ''}`}
              style={{ padding: '4px 8px', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
              onClick={() => setCalMode('month')}
            >
              14d
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: 6,
            marginBottom: 8,
          }}
        >
          {calendarDays.map((d) => {
            const dayNum = d.date.slice(8);
            const isSelected = d.date === selectedDay;
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDay(d.date)}
                style={{
                  padding: '6px 0',
                  borderRadius: 8,
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: isSelected ? '1.5px solid var(--dark-section)' : '1px solid var(--border)',
                  backgroundColor: d.completed
                    ? isSelected
                      ? 'var(--dark-section)'
                      : 'var(--accent-yellow-soft)'
                    : 'var(--bg-primary)',
                  color: d.completed && isSelected ? '#FFFFFF' : 'var(--text-primary)',
                }}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
        {activeDayInfo && (
          <div className="text-xs text-muted" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{formatReadableDate(activeDayInfo.date)}</span>
            <span style={{ fontWeight: 600, color: activeDayInfo.completed ? 'var(--success)' : 'var(--text-secondary)' }}>
              {activeDayInfo.completed ? `${activeDayInfo.minutes} min studied` : 'Scheduled ahead'}
            </span>
          </div>
        )}
      </div>

      {/* 3. Today's Study Plan */}
      <div className="card card-compact">
        <div className="section-header" style={{ marginBottom: 10 }}>
          <h3 className="h3" style={{ fontSize: '0.94rem' }}>Today&apos;s plan</h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.76rem' }}
            onClick={() => setTaskModalOpen(true)}
          >
            <Plus size={14} /> Add
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {todayTasks.slice(0, 4).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleStudyTask(t.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 9,
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: t.completed ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                textAlign: 'left',
              }}
            >
              {t.completed ? (
                <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
              ) : (
                <Circle size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: t.completed ? 'line-through' : 'none',
                    color: t.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                  }}
                >
                  {t.title}
                </div>
                <div className="text-xs text-muted">{t.module} • {t.duration}</div>
              </div>
            </button>
          ))}
        </div>

        <Link href="/study-plan" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
          Open Study Plan →
        </Link>
      </div>

      {/* 4. Scheduled / Upcoming Sessions (Filko-inspired) */}
      <div className="card card-compact">
        <div className="section-header" style={{ marginBottom: 10 }}>
          <h3 className="h3" style={{ fontSize: '0.94rem' }}>Scheduled</h3>
          <Link href="/people" className="text-xs text-muted" style={{ fontWeight: 600 }}>
            See all
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {overviewData.upcomingSessions.map((sess) => (
            <Link
              key={sess.id}
              href="/people"
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-xs text-muted" style={{ fontWeight: 600 }}>{sess.dayLabel}</span>
                <span
                  className="text-xs"
                  style={{
                    backgroundColor: 'var(--surface)',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontWeight: 600,
                    border: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '999px',
                      marginRight: 5,
                      backgroundColor:
                        sess.tag === 'Group'
                          ? 'var(--error)'
                          : sess.tag === 'Personal'
                          ? 'var(--accent-yellow)'
                          : 'var(--accent-purple)',
                    }}
                  />
                  {sess.tag}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{sess.title}</div>
              <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={12} /> {sess.time}
              </div>
              {sess.avatars && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                  {sess.avatars.map((av, idx) => (
                    <SafeAvatar
                      key={idx}
                      src={av}
                      name="Peer"
                      size={24}
                      style={{ marginLeft: idx > 0 ? -6 : 0, border: '2px solid var(--surface)' }}
                    />
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Recent Activity Preview */}
      <div className="card card-compact">
        <div className="section-header" style={{ marginBottom: 10 }}>
          <h3 className="h3" style={{ fontSize: '0.94rem' }}>Recent Activity</h3>
          <Link href="/test-results" className="text-xs" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
            View all
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          {testResults.slice(0, 3).map((res) => (
            <Link
              key={res.id}
              href={`/test-results/${res.type}/${res.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-primary)',
                minWidth: 0,
                maxWidth: '100%',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.81rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {res.title}
                </div>
                <div className="text-xs text-muted">{res.type.toUpperCase()} • {res.date}</div>
              </div>
              <span className="badge badge-dark" style={{ flexShrink: 0 }}>{res.bandScore.toFixed(1)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. Invite Friends Dark Card */}
      <div className="card-dark">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>IELTSWIST</span>
          <span className="badge badge-yellow">New</span>
        </div>
        <h3 className="h3" style={{ color: '#FFFFFF', marginBottom: 4 }}>Invite friends</h3>
        <p className="text-xs" style={{ color: '#B7B5AD', marginBottom: 14 }}>
          Your friend gets 7 extra Plus days on sign-up, and you earn 7 days too.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={handleCopyInvite}
            className="btn btn-sm"
            style={{ backgroundColor: '#FFFFFF', color: 'var(--text-primary)', width: '100%' }}
          >
            <Copy size={14} /> Copy invite link
          </button>
          <Link
            href="/invite-friends"
            className="btn btn-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', width: '100%' }}
          >
            See your invites <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
      <TargetBandModal open={targetOpen} onClose={() => setTargetOpen(false)} />
      <ScheduleExamModal open={examOpen} onClose={() => setExamOpen(false)} />
      <CreateStudyTaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
    </aside>
  );
}

