'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Calculator,
  Calendar,
  FileText,
  ChevronRight,
  TrendingUp,
  Video,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { useIsMounted } from '@/hooks/useIsMounted';
import { getGreeting } from '@/lib/utils';
import { Badge, ProgressBar } from '@/components/common/UiPrimitives';
import { BandProgressionChart } from '@/components/charts/BandProgressionChart';
import { Modal } from '@/components/common/Modal';
import overviewData from '@/data/dashboard/overview.json';
import statsData from '@/data/dashboard/statistics.json';

const TOOL_ICONS = {
  Mic,
  Sparkles,
  Calculator,
  Calendar,
  BookOpen,
  FileText,
};

function HeroArtwork({ theme }) {
  if (theme === 'light') {
    return (
      <svg viewBox="0 0 120 84" width="120" height="84" aria-hidden="true">
        <rect x="16" y="18" width="46" height="58" rx="6" fill="#FFFFFF" stroke="#202020" strokeWidth="1.8" />
        <line x1="25" y1="30" x2="53" y2="30" stroke="#8867B8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="25" y1="40" x2="50" y2="40" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="25" y1="49" x2="46" y2="49" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="84" cy="46" r="20" fill="#F6BD28" stroke="#202020" strokeWidth="1.8" />
        <path d="M76 46 L82 52 L93 40" fill="none" stroke="#202020" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (theme === 'yellow') {
    return (
      <svg viewBox="0 0 120 84" width="120" height="84" aria-hidden="true">
        <circle cx="62" cy="54" r="32" fill="none" stroke="#202020" strokeWidth="1.6" />
        <ellipse cx="62" cy="54" rx="14" ry="32" fill="none" stroke="#202020" strokeWidth="1.4" />
        <line x1="30" y1="54" x2="94" y2="54" stroke="#202020" strokeWidth="1.4" />
        <path d="M35 38 Q62 46 89 38" fill="none" stroke="#202020" strokeWidth="1.4" />
        <path d="M35 70 Q62 62 89 70" fill="none" stroke="#202020" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 84" width="120" height="84" aria-hidden="true">
      <rect x="44" y="16" width="32" height="62" rx="3" fill="#F6BD28" stroke="#202020" strokeWidth="1.6" />
      <polygon points="44,16 60,4 76,16" fill="#FAF9F5" stroke="#202020" strokeWidth="1.6" />
      <circle cx="60" cy="34" r="8" fill="#FFFFFF" stroke="#202020" strokeWidth="1.6" />
      <line x1="60" y1="34" x2="60" y2="29" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="60" y1="34" x2="64" y2="36" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="52" y1="52" x2="52" y2="72" stroke="#202020" strokeWidth="1.4" />
      <line x1="60" y1="52" x2="60" y2="72" stroke="#202020" strokeWidth="1.4" />
      <line x1="68" y1="52" x2="68" y2="72" stroke="#202020" strokeWidth="1.4" />
    </svg>
  );
}

export function DashboardClient() {
  const { profile, testResults, showToast } = useApp();
  const rootRef = useGsapEntrance('dashboard');
  const mounted = useIsMounted();

  const [chartMetric, setChartMetric] = useState('overall');
  const [skillTab, setSkillTab] = useState('Writing');
  const [pollDismissed, setPollDismissed] = useState(false);
  const [pollChoice, setPollChoice] = useState('');
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);

  const greetingText = mounted ? getGreeting() : 'Welcome back';
  const todayFormatted = mounted
    ? new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Today’s Study Overview';

  const moduleCards = [
    {
      id: 'Reading',
      title: 'Reading',
      band: profile.moduleBands.reading,
      testsCount: testResults.filter((r) => r.type === 'reading').length + 6,
      progress: 78,
      href: '/reading',
      icon: BookOpen,
      tint: '#EDF4FF',
      iconColor: '#3B6FD4',
    },
    {
      id: 'Listening',
      title: 'Listening',
      band: profile.moduleBands.listening,
      testsCount: testResults.filter((r) => r.type === 'listening').length + 5,
      progress: 75,
      href: '/listening',
      icon: Headphones,
      tint: 'var(--accent-yellow-soft)',
      iconColor: '#A67400',
    },
    {
      id: 'Writing',
      title: 'Writing',
      band: profile.moduleBands.writing,
      testsCount: testResults.filter((r) => r.type === 'writing').length + 4,
      progress: 62,
      href: '/writing',
      icon: PenTool,
      tint: 'var(--error-soft)',
      iconColor: 'var(--error)',
    },
    {
      id: 'Speaking',
      title: 'Speaking',
      band: profile.moduleBands.speaking,
      testsCount: testResults.filter((r) => r.type === 'speaking').length + 5,
      progress: 68,
      href: '/speaking',
      icon: Mic,
      tint: 'var(--success-soft)',
      iconColor: 'var(--success)',
    },
  ];

  const studyRoadmapSteps = [
    { title: 'Diagnostic Band Baseline', desc: 'Initial 4-skill placement scored 6.0', done: true },
    { title: 'Reading TFNG & Skimming', desc: 'Achieved 7.0 across academic sets', done: true },
    { title: 'Listening Map & Note Drills', desc: 'Part 2 & 4 accuracy reached 75%', done: true },
    { title: 'Task 2 Argument Coherence', desc: 'Target: upgrade essay band from 6.0 to 7.0', done: false, active: true },
    { title: 'Full 2h 40m Mock Dress Rehearsal', desc: 'Scheduled Saturday 10:00 AM', done: false },
  ];

  const activeSkills = statsData.skillBreakdown[skillTab] || [];

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Welcome Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1 className="h1">
            {greetingText}, {profile.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted" style={{ marginTop: 2 }}>
            {todayFormatted} • Estimated Overall Band:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{profile.currentBand.toFixed(1)}</strong>{' '}
            (Goal: {profile.targetBand.toFixed(1)})
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/test-results" className="btn btn-secondary btn-sm">
            <TrendingUp size={15} /> Score History
          </Link>
          <Link href="/subscription" className="btn btn-accent btn-sm">
            <Sparkles size={15} /> Upgrade to Plus
          </Link>
        </div>
      </div>

      {/* Filko-Inspired Hero Banner Card */}
      <section
        data-animate="card"
        className="card-warm hero-banner-grid"
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, zIndex: 1 }}>
          <span className="text-sm" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
            Welcome back, {profile.name.split(' ')[0]}!
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.45rem, 2.2vw, 1.95rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
            }}
          >
            You&apos;ve completed {overviewData.weeklyCompletedModules} modules this week
          </h2>
          <p className="text-sm text-muted">
            {profile.completedTests} total practice tests completed • {profile.studyHoursTotal}h logged toward Band {profile.targetBand}.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
            <Link href="/test-results" className="btn btn-primary">
              View Progress <ArrowUpRight size={16} />
            </Link>
            <Link href="/study-plan" className="btn btn-secondary">
              Study Plan
            </Link>
          </div>
        </div>

        {/* 3 Filko-Inspired Vertical Milestone Cards */}
        <div
          className="hero-cards-grid"
          style={{
            zIndex: 1,
          }}
        >
          {overviewData.heroCards.map((hc) => {
            const bg =
              hc.theme === 'yellow'
                ? 'var(--accent-yellow)'
                : hc.theme === 'purple'
                ? 'var(--accent-purple)'
                : 'var(--surface)';
            const fg = hc.theme === 'purple' ? '#FFFFFF' : 'var(--text-primary)';
            return (
              <Link
                key={hc.id}
                href={hc.href}
                className="hero-milestone-card"
                style={{
                  backgroundColor: bg,
                  color: fg,
                  borderRadius: 'var(--radius-md)',
                  border: hc.theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(0,0,0,0.06)',
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div className="text-xs" style={{ fontWeight: 700, opacity: 0.75, marginBottom: 6 }}>
                    {hc.num}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.25 }}>
                    {hc.title}
                  </div>
                  <div className="text-xs" style={{ opacity: 0.8, marginTop: 4 }}>
                    {hc.subtitle}
                  </div>
                </div>
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
                  <HeroArtwork theme={hc.theme} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dark Full Mock Test Banner */}
      <section
        data-animate="card"
        className="card-dark dashboard-mock-banner"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minWidth: 0 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 34px)',
              gap: 6,
              flexShrink: 0,
            }}
          >
            {[BookOpen, Headphones, PenTool, Mic].map((Icon, i) => (
              <span
                key={i}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--dark-border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: i === 1 ? 'var(--accent-yellow)' : '#EAE8E1',
                }}
              >
                <Icon size={15} />
              </span>
            ))}
          </div>
          <div style={{ minWidth: 0, flex: '1 1 200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <h2 className="h2" style={{ color: '#FFFFFF' }}>Full IELTS Mock Test</h2>
              <Badge variant="yellow">2h 40m</Badge>
            </div>
            <p className="text-sm" style={{ color: '#B7B5AD' }}>
              Reading, Listening, Writing, and Speaking back-to-back with automatic progress saving.
            </p>
          </div>
        </div>
        <Link
          href="/mock-test"
          className="btn btn-accent"
          style={{ fontWeight: 700 }}
        >
          <Award size={16} /> Start Full Mock →
        </Link>
      </section>

      {/* Individual IELTS Module Cards (2x2) */}
      <section>
        <div className="section-header">
          <div>
            <h2 className="h2">Individual Module Practice</h2>
            <p className="text-xs text-muted">Pick a module to sharpen your weakest criteria</p>
          </div>
          <Link href="/question-types" className="text-xs" style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>
            Explore Question Types →
          </Link>
        </div>

        <div className="grid-2">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} data-animate="card" className="card card-interactive">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: mod.tint,
                      color: mod.iconColor,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="text-xs text-muted" style={{ fontWeight: 600 }}>
                    {mod.testsCount} tests completed
                  </span>
                </div>

                <h3 className="h3" style={{ fontSize: '1.1rem', marginBottom: 10 }}>
                  {mod.title}
                </h3>

                <ProgressBar value={mod.progress} variant={mod.id === 'Writing' ? 'yellow' : 'purple'} small />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    marginTop: 14,
                  }}
                >
                  <div>
                    <div className="text-xs text-muted">Estimated band</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1 }}>
                      {mod.band.toFixed(1)}
                      <span className="text-sm text-muted" style={{ fontWeight: 500 }}> / 9</span>
                    </div>
                  </div>
                  <Link href={mod.href} className="btn btn-primary btn-sm">
                    Practice <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filko-style Band 7.5 Study Progression Timeline */}
      <section data-animate="card" className="card">
        <div className="section-header">
          <div>
            <span className="text-xs text-muted" style={{ fontWeight: 600 }}>Stage 4 of 5</span>
            <h2 className="h2">Band 7.5 Preparation Path</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
            <ProgressBar value={75} variant="purple" showLabel />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
          {studyRoadmapSteps.map((step) => (
            <div
              key={step.title}
              className={`dashboard-roadmap-row ${step.active ? 'active' : ''}`}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: step.done ? 'var(--accent-yellow-soft)' : 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: step.done ? '#9A6900' : 'var(--text-primary)',
                }}
              >
                {step.done ? <CheckCircle2 size={16} /> : <Clock size={15} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{step.title}</div>
                <div className="text-xs text-muted">{step.desc}</div>
              </div>
              <span className={`badge dashboard-roadmap-badge ${step.done ? 'badge-success' : step.active ? 'badge-yellow' : 'badge-neutral'}`}>
                {step.done ? 'Done' : step.active ? 'In Progress' : 'Upcoming'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Teacher Speaking Feedback Poll Card */}
      {!pollDismissed && (
        <section data-animate="card" className="card" style={{ backgroundColor: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Video size={18} />
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Badge variant="purple">Live Coaching</Badge>
                  <span className="text-xs text-muted">Student Feedback</span>
                </div>
                <h3 className="h3">Speaking mock with a certified IELTS tutor</h3>
                <p className="text-sm text-muted" style={{ marginTop: 3 }}>
                  15-minute live Parts 1-3 interview with written rubric scorecard. Would you book one?
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {['Yes, I would', 'Maybe later', 'Not for me'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`btn btn-sm ${pollChoice === opt ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => {
                        setPollChoice(opt);
                        showToast(`Preference recorded: "${opt}"`, 'success');
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                  <Link href="/people" className="btn btn-ghost btn-sm">
                    Browse Teachers <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={() => setPollDismissed(true)}
              aria-label="Dismiss announcement"
            >
              <X size={16} />
            </button>
          </div>
        </section>
      )}

      {/* Performance Analytics (Recharts) */}
      <section data-animate="card" className="card">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <h2 className="h2">Performance Analytics</h2>
            <p className="text-xs text-muted">Your estimated IELTS band trajectory across recent tests</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div className="filter-pills">
              {[
                { id: 'overall', label: 'Overall' },
                { id: 'reading', label: 'Reading' },
                { id: 'listening', label: 'Listening' },
                { id: 'writing', label: 'Writing' },
                { id: 'speaking', label: 'Speaking' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setChartMetric(m.id)}
                  className={`filter-pill ${chartMetric === m.id ? 'active' : ''}`}
                  style={{ padding: '5px 11px', fontSize: '0.76rem' }}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setAnalyticsModalOpen(true)}
            >
              Details
            </button>
          </div>
        </div>

        <BandProgressionChart data={statsData.bandProgression} activeMetric={chartMetric} height={240} />
      </section>

      {/* Skill Breakdown */}
      <section data-animate="card" className="card">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <h2 className="h2">Skill Breakdown</h2>
            <p className="text-xs text-muted">Criterion-level strengths and focus areas</p>
          </div>
          <div className="tabs-list">
            {['Writing', 'Reading', 'Listening', 'Speaking'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab-trigger ${skillTab === tab ? 'active' : ''}`}
                onClick={() => setSkillTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {activeSkills.map((item) => {
            const pct = Math.round((item.score / 9) * 100);
            const variant =
              item.status === 'Strong' ? 'success' : item.status === 'Focus' ? 'error' : 'yellow';
            return (
              <div
                key={item.criterion}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.criterion}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.score.toFixed(1)}</span>
                    <Badge variant={variant === 'error' ? 'error' : variant === 'success' ? 'success' : 'yellow'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <ProgressBar value={pct} variant={variant} small />
                <p className="text-xs text-muted" style={{ marginTop: 6 }}>{item.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Access Tools */}
      <section>
        <div className="section-header">
          <div>
            <h2 className="h2">Tools & Features</h2>
            <p className="text-xs text-muted">Sharpen every aspect of your preparation</p>
          </div>
          <Link href="/tools" className="text-xs" style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>
            All 10 Tools →
          </Link>
        </div>

        <div className="grid-2">
          {overviewData.quickTools.map((tool) => {
            const Icon = TOOL_ICONS[tool.icon] || Sparkles;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                data-animate="card"
                className="card card-compact card-interactive"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <span
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={17} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tool.title}</span>
                      {tool.badge && <Badge variant="purple">{tool.badge}</Badge>}
                    </div>
                    <p className="text-xs text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tool.description}
                    </p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-muted" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* IELTS Learning Resources */}
      <section>
        <div className="section-header">
          <div>
            <h2 className="h2">IELTS Tips & Guides</h2>
            <p className="text-xs text-muted">High-impact strategies curated by examiners</p>
          </div>
          <Link href="/question-types" className="text-xs" style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>
            View all guides →
          </Link>
        </div>

        <div className="grid-4">
          {overviewData.learningResources.map((res) => (
            <Link
              key={res.id}
              href={res.href}
              data-animate="card"
              className="card card-interactive"
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  height: 112,
                  backgroundColor: 'var(--bg-secondary)',
                  backgroundImage: `url(${res.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderBottom: '1px solid var(--border)',
                }}
              />
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <span className="text-xs" style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>
                  {res.category}
                </span>
                <div style={{ fontWeight: 600, fontSize: '0.86rem', lineHeight: 1.35, flex: 1 }}>
                  {res.title}
                </div>
                <div className="text-xs text-muted">{res.readTime}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Performance Analytics Detail Modal */}
      <Modal
        open={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
        title="Detailed Performance Summary"
        subtitle="Weekly study time and band score progression across all modules."
        large
      >
        <div className="grid-3" style={{ marginBottom: 16 }}>
          <div className="card-warm card-compact">
            <div className="text-xs text-muted">Current Overall</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{profile.currentBand.toFixed(1)}</div>
          </div>
          <div className="card-warm card-compact">
            <div className="text-xs text-muted">30-Day Improvement</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success)' }}>+1.0 Band</div>
          </div>
          <div className="card-warm card-compact">
            <div className="text-xs text-muted">Weekly Hours</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>10.6 hrs</div>
          </div>
        </div>
        <BandProgressionChart data={statsData.bandProgression} activeMetric={chartMetric} height={260} />
      </Modal>
    </div>
  );
}
