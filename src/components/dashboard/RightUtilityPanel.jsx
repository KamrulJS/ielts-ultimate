'use client';
import styles from './RightUtilityPanel.module.css';

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
    auth,
    profile,
    studyTasks,
    toggleStudyTask,
    testResults,
    referrals,
    showToast,
  } = useApp();

  const displayName = auth?.isAuthenticated && auth?.name ? auth.name : profile.name;
  const displayAvatar = auth?.isAuthenticated ? (auth.avatar || null) : profile.avatar;

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
      <div className={`card ${styles.righ_div_1}`} >
        <div
          className={styles.righ_div_2}
        >
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className={`btn btn-secondary btn-sm ${styles.righ_button_3}`}
            
          >
            <Edit3 size={12} /> Edit
          </button>
        </div>
        <div style={{ padding: '0 16px 16px', marginTop: -24, position: 'relative', zIndex: 2 }}>
          <div className={styles.righ_div_4}>
            <SafeAvatar
              src={displayAvatar}
              name={displayName}
              size={52}
              radius="14px"
              className={styles.righ_safeavatar_5}
            />
            <Link href="/profile" className={`text-xs ${styles.righ_link_6}`} >
              View profile →
            </Link>
          </div>
          <div className={styles.righ_div_7}>{displayName}</div>
          <div className={`text-xs text-muted ${styles.righ_div_8}`} >
            {profile.track} • {profile.plan}
          </div>

          {/* Target & Exam Countdown boxes */}
          <div className={`grid-2 ${styles.righ_div_9}`} >
            <button
              type="button"
              onClick={() => setTargetOpen(true)}
              className={styles.righ_button_10}
            >
              <div className={`text-xs text-muted ${styles.righ_div_11}`} >
                <Target size={12} className={styles.righ_target_12} /> Target
              </div>
              <div className={styles.righ_div_13}>
                Band {profile.targetBand}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setExamOpen(true)}
              className={styles.righ_button_10}
            >
              <div className={`text-xs text-muted ${styles.righ_div_11}`} >
                <Calendar size={12} className={styles.righ_calendar_14} /> Exam
              </div>
              <div className={styles.righ_div_15}>
                {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days left` : formatReadableDate(profile.examDate)}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Study Streak & Interactive Calendar */}
      <div className="card card-compact">
        <div className={styles.righ_div_16}>
          <div className={styles.righ_div_17}>
            <span
              className={styles.righ_span_18}
            >
              <Flame size={15} />
            </span>
            <div>
              <div className={styles.righ_div_19}>{profile.streakDays}-day streak</div>
              <div className="text-xs text-muted">Keep the momentum going</div>
            </div>
          </div>
          <div className={`tabs-list ${styles.righ_div_20}`} >
            <button
              type="button"
              className={`tab-trigger ${calMode === 'week' ? 'active' : ''} ${styles.righ_button_21}`}
              
              onClick={() => setCalMode('week')}
            >
              Week
            </button>
            <button
              type="button"
              className={`tab-trigger ${calMode === 'month' ? 'active' : ''} ${styles.righ_button_21}`}
              
              onClick={() => setCalMode('month')}
            >
              14d
            </button>
          </div>
        </div>

        <div
          className={styles.righ_div_22}
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
          <div className={`text-xs text-muted ${styles.righ_div_23}`} >
            <span>{formatReadableDate(activeDayInfo.date)}</span>
            <span style={{ fontWeight: 600, color: activeDayInfo.completed ? 'var(--success)' : 'var(--text-secondary)' }}>
              {activeDayInfo.completed ? `${activeDayInfo.minutes} min studied` : 'Scheduled ahead'}
            </span>
          </div>
        )}
      </div>

      {/* 3. Today's Study Plan */}
      <div className="card card-compact">
        <div className={`section-header ${styles.righ_div_24}`} >
          <h3 className={`h3 ${styles.righ_h3_25}`} >Today&apos;s plan</h3>
          <button
            type="button"
            className={`btn btn-ghost btn-sm ${styles.righ_button_26}`}
            
            onClick={() => setTaskModalOpen(true)}
          >
            <Plus size={14} /> Add
          </button>
        </div>

        <div className={styles.righ_div_27}>
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
                <CheckCircle2 size={16} className={styles.righ_checkcircle2_28} />
              ) : (
                <Circle size={16} className={styles.righ_circle_29} />
              )}
              <div className={styles.righ_div_30}>
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

        <Link href="/study-plan" className={`btn btn-primary btn-sm ${styles.righ_link_31}`} >
          Open Study Plan →
        </Link>
      </div>

      {/* 4. Scheduled / Upcoming Sessions (Filko-inspired) */}
      <div className="card card-compact">
        <div className={`section-header ${styles.righ_div_24}`} >
          <h3 className={`h3 ${styles.righ_h3_25}`} >Scheduled</h3>
          <Link href="/people" className={`text-xs text-muted ${styles.righ_link_32}`} >
            See all
          </Link>
        </div>

        <div className={styles.righ_div_33}>
          {overviewData.upcomingSessions.map((sess) => (
            <Link
              key={sess.id}
              href="/people"
              className={styles.righ_link_34}
            >
              <div className={styles.righ_div_35}>
                <span className={`text-xs text-muted ${styles.righ_link_32}`} >{sess.dayLabel}</span>
                <span
                  className={`text-xs ${styles.righ_span_36}`}
                  
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
              <div className={styles.righ_div_37}>{sess.title}</div>
              <div className={`text-xs text-muted ${styles.righ_div_11}`} >
                <Clock size={12} /> {sess.time}
              </div>
              {sess.avatars && (
                <div className={styles.righ_div_38}>
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
        <div className={`section-header ${styles.righ_div_24}`} >
          <h3 className={`h3 ${styles.righ_h3_25}`} >Recent Activity</h3>
          <Link href="/test-results" className={`text-xs ${styles.righ_link_6}`} >
            View all
          </Link>
        </div>
        <div className={styles.righ_div_39}>
          {testResults.slice(0, 3).map((res) => (
            <Link
              key={res.id}
              href={`/test-results/${res.type}/${res.id}`}
              className={styles.righ_link_40}
            >
              <div className={styles.righ_div_30}>
                <div className={styles.righ_div_41}>
                  {res.title}
                </div>
                <div className="text-xs text-muted">{res.type.toUpperCase()} • {res.date}</div>
              </div>
              <span className={`badge badge-dark ${styles.righ_span_42}`} >{res.bandScore.toFixed(1)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. Invite Friends Dark Card */}
      <div className="card-dark">
        <div className={styles.righ_div_43}>
          <span className={styles.righ_span_44}>IELTS Ultimate</span>
          <span className="badge badge-yellow">New</span>
        </div>
        <h3 className={`h3 ${styles.righ_h3_45}`} >Invite friends</h3>
        <p className={`text-xs ${styles.righ_p_46}`} >
          Your friend gets 7 extra Plus days on sign-up, and you earn 7 days too.
        </p>
        <div className={styles.righ_div_47}>
          <button
            type="button"
            onClick={handleCopyInvite}
            className={`btn btn-sm ${styles.righ_button_48}`}
            
          >
            <Copy size={14} /> Copy invite link
          </button>
          <Link
            href="/invite-friends"
            className={`btn btn-sm ${styles.righ_link_49}`}
            
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

