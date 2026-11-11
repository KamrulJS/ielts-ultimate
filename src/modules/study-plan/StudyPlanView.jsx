'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Plus,
  Edit3,
  Target,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge, ProgressBar, StatCard } from '@/components/common/UiPrimitives';
import { Modal } from '@/components/common/Modal';
import { CreateStudyTaskModal } from '@/components/modals/DashboardModals';
import { getDaysRemaining } from '@/lib/utils';

export function StudyPlanView() {
  const { studyPlan, studyTasks, toggleStudyTask, saveStudyPlan, profile } = useApp();
  const rootRef = useGsapEntrance('study-plan');

  const [viewMode, setViewMode] = useState('weekly'); // weekly | monthly | progress
  const [wizardOpen, setWizardOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const [formState, setFormState] = useState({
    title: studyPlan.title,
    targetBand: String(studyPlan.targetBand),
    currentLevel: studyPlan.currentLevel,
    examDate: studyPlan.examDate,
    dailyHours: String(studyPlan.dailyHours),
    weakestModule: studyPlan.weakestModule,
  });

  const completedTasks = studyTasks.filter((t) => t.completed);
  const pendingTasks = studyTasks.filter((t) => !t.completed);
  const completionPct = studyTasks.length
    ? Math.round((completedTasks.length / studyTasks.length) * 100)
    : 0;
  const daysLeft = getDaysRemaining(studyPlan.examDate);

  const weeklyCards = useMemo(() => {
    return studyPlan.weeklyDistribution || [];
  }, [studyPlan.weeklyDistribution]);

  const handleSaveWizard = (e) => {
    e.preventDefault();
    saveStudyPlan({
      ...formState,
      targetBand: Number(formState.targetBand),
      dailyHours: Number(formState.dailyHours),
    });
    setWizardOpen(false);
  };

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title={studyPlan.title}
        description={`Target Band ${studyPlan.targetBand} • Weakest module focus: ${studyPlan.weakestModule} • ${studyPlan.dailyHours} hrs/day`}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Study Plan' }]}
        actions={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setWizardOpen(true)}>
              <Edit3 size={14} /> Edit / Create Plan
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setAddTaskOpen(true)}>
              <Plus size={14} /> Add Task
            </button>
          </div>
        }
      />

      {/* Top Metrics */}
      <div className="grid-4">
        <StatCard label="Target Band" value={`Band ${studyPlan.targetBand}`} hint={`Current: ${profile.currentBand}`} icon={Target} dark />
        <StatCard
          label="Exam Countdown"
          value={daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days` : studyPlan.examDate}
          hint={`Sitting on ${studyPlan.examDate}`}
          icon={CalendarCheck}
        />
        <StatCard
          label="Tasks Completed"
          value={`${completedTasks.length} / ${studyTasks.length}`}
          hint={`${completionPct}% completion rate`}
          icon={CheckCircle2}
        />
        <StatCard
          label="Daily Study Budget"
          value={`${studyPlan.dailyHours} hrs`}
          hint={`Focus: ${studyPlan.weakestModule}`}
          icon={Clock}
        />
      </div>

      {/* View Switcher */}
      <div className="tabs-list">
        {[
          { id: 'weekly', label: 'Weekly Schedule & Tasks' },
          { id: 'monthly', label: 'Streak & 14-Day Calendar' },
          { id: 'progress', label: 'Study Progress Report' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-trigger ${viewMode === tab.id ? 'active' : ''}`}
            onClick={() => setViewMode(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {viewMode === 'weekly' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 7-Day Focus Strip */}
          <div className="card">
            <h2 className="h2" style={{ marginBottom: 14 }}>Weekly Study Distribution</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 10 }}>
              {weeklyCards.map((d) => (
                <div key={d.day} className="card-warm card-compact">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>{d.day}</span>
                    <Badge variant="purple">{d.minutes}m</Badge>
                  </div>
                  <p className="text-xs text-muted">{d.focus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Task Checklist */}
          <div className="grid-2">
            <div className="card">
              <div className="section-header">
                <h2 className="h3">Pending Tasks ({pendingTasks.length})</h2>
                <Badge variant="yellow">Active</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingTasks.length === 0 ? (
                  <p className="text-sm text-muted">All scheduled tasks completed! Add a new drill or start a mock test.</p>
                ) : (
                  pendingTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        padding: 12,
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-primary)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleStudyTask(t.id)}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left', flex: 1 }}
                      >
                        <Circle size={18} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.title}</div>
                          <div className="text-xs text-muted">{t.day} • {t.module} • {t.duration}</div>
                        </div>
                      </button>
                      <Link href={t.href} className="btn btn-secondary btn-sm">
                        Open <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="section-header">
                <h2 className="h3">Completed Tasks ({completedTasks.length})</h2>
                <Badge variant="success">+15 XP each</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {completedTasks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleStudyTask(t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: 12,
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--success-soft)',
                      textAlign: 'left',
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', textDecoration: 'line-through' }}>{t.title}</div>
                      <div className="text-xs text-muted">{t.module} • {t.duration}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'monthly' && (
        <div className="card">
          <h2 className="h2" style={{ marginBottom: 14 }}>Study Consistency Calendar (November 2026)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(125px, 1fr))', gap: 10 }}>
            {profile.streakCalendar.map((day) => (
              <div
                key={day.date}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  backgroundColor: day.completed ? 'var(--accent-yellow-soft)' : 'var(--bg-primary)',
                }}
              >
                <div className="text-xs text-muted">{day.date}</div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>
                  {day.completed ? `${day.minutes} min` : 'Planned'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'progress' && (
        <div className="card">
          <h2 className="h2" style={{ marginBottom: 14 }}>Study Progress Report</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>Overall Checklist Completion</span>
                <span style={{ fontWeight: 700 }}>{completionPct}%</span>
              </div>
              <ProgressBar value={completionPct} variant="purple" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>Weekly Study Minutes Goal ({studyPlan.completedMinutesThisWeek} / {studyPlan.weeklyGoalMinutes} min)</span>
                <span style={{ fontWeight: 700 }}>
                  {Math.min(100, Math.round((studyPlan.completedMinutesThisWeek / studyPlan.weeklyGoalMinutes) * 100))}%
                </span>
              </div>
              <ProgressBar
                value={Math.round((studyPlan.completedMinutesThisWeek / studyPlan.weeklyGoalMinutes) * 100)}
                variant="yellow"
              />
            </div>
          </div>
        </div>
      )}

      {/* Study Plan Wizard Modal */}
      <Modal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Customise IELTS Study Plan"
        subtitle="Update your target band, exam date, and weakest module focus."
      >
        <form onSubmit={handleSaveWizard} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="plan-title">Plan Title</label>
            <input
              id="plan-title"
              className="input"
              value={formState.title}
              onChange={(e) => setFormState((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div className="grid-2">
            <div className="field-group">
              <label className="field-label" htmlFor="plan-target">Target Band</label>
              <select
                id="plan-target"
                className="select"
                value={formState.targetBand}
                onChange={(e) => setFormState((p) => ({ ...p, targetBand: e.target.value }))}
              >
                {['6.5', '7.0', '7.5', '8.0', '8.5'].map((b) => (
                  <option key={b} value={b}>Band {b}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="plan-weakest">Weakest Module</label>
              <select
                id="plan-weakest"
                className="select"
                value={formState.weakestModule}
                onChange={(e) => setFormState((p) => ({ ...p, weakestModule: e.target.value }))}
              >
                <option value="Writing">Writing</option>
                <option value="Reading">Reading</option>
                <option value="Listening">Listening</option>
                <option value="Speaking">Speaking</option>
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="field-group">
              <label className="field-label" htmlFor="plan-date">Target Exam Date</label>
              <input
                id="plan-date"
                type="date"
                className="input"
                value={formState.examDate}
                onChange={(e) => setFormState((p) => ({ ...p, examDate: e.target.value }))}
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="plan-hours">Daily Study Hours</label>
              <input
                id="plan-hours"
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                className="input"
                value={formState.dailyHours}
                onChange={(e) => setFormState((p) => ({ ...p, dailyHours: e.target.value }))}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setWizardOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Plan</button>
          </div>
        </form>
      </Modal>

      <CreateStudyTaskModal open={addTaskOpen} onClose={() => setAddTaskOpen(false)} />
    </div>
  );
}

