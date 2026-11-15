'use client';
import styles from './DashboardClient.module.css';

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
  const { auth, profile, testResults, showToast } = useApp();
  const rootRef = useGsapEntrance('dashboard');
  const mounted = useIsMounted();

  const studentDisplayName = (auth?.isAuthenticated && auth?.name) ? auth.name : profile.name;
  const studentFirstName = studentDisplayName.split(' ')[0] || studentDisplayName;

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
    <div ref={rootRef} className={styles.dash_div_1}>
      {/* Welcome Header */}
      <div
        className={styles.dash_div_2}
      >
        <div className={styles.dash_div_3}>
          <h1 className="h1">
            {greetingText}, {studentFirstName}
          </h1>
          <p className={`text-sm text-muted ${styles.dash_p_4}`} >
            {todayFormatted} • Estimated Overall Band:{' '}
            <strong className={styles.dash_strong_5}>{profile.currentBand.toFixed(1)}</strong>{' '}
            (Goal: {profile.targetBand.toFixed(1)})
          </p>
        </div>
        <div className={styles.dash_div_6}>
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
        className={`card-warm hero-banner-grid ${styles.dash_section_7}`}
        
      >
        <div className={styles.dash_div_8}>
          <span className={`text-sm ${styles.dash_span_9}`} >
            Welcome back, {studentFirstName}!
          </span>
          <h2
            className={styles.dash_h2_10}
          >
            You&apos;ve completed {overviewData.weeklyCompletedModules} modules this week
          </h2>
          <p className="text-sm text-muted">
            {profile.completedTests} total practice tests completed • {profile.studyHoursTotal}h logged toward Band {profile.targetBand}.
          </p>
          <div className={styles.dash_div_11}>
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
          className={`hero-cards-grid ${styles.dash_div_12}`}
          
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
                  <div className={`text-xs ${styles.dash_div_13}`} >
                    {hc.num}
                  </div>
                  <div className={styles.dash_div_14}>
                    {hc.title}
                  </div>
                  <div className={`text-xs ${styles.dash_div_15}`} >
                    {hc.subtitle}
                  </div>
                </div>
                <div className={styles.dash_div_16}>
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
        <div className={styles.dash_div_17}>
          <div
            className={styles.dash_div_18}
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
          <div className={styles.dash_div_19}>
            <div className={styles.dash_div_20}>
              <h2 className={`h2 ${styles.dash_h2_21}`} >Full IELTS Mock Test</h2>
              <Badge variant="yellow">2h 40m</Badge>
            </div>
            <p className={`text-sm ${styles.dash_p_22}`} >
              Reading, Listening, Writing, and Speaking back-to-back with automatic progress saving.
            </p>
          </div>
        </div>
        <Link
          href="/mock-test"
          className={`btn btn-accent ${styles.dash_link_23}`}
          
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
          <Link href="/question-types" className={`text-xs ${styles.dash_link_24}`} >
            Explore Question Types →
          </Link>
        </div>

        <div className="grid-2">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} data-animate="card" className="card card-interactive">
                <div className={styles.dash_div_25}>
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
                  <span className={`text-xs text-muted ${styles.dash_span_26}`} >
                    {mod.testsCount} tests completed
                  </span>
                </div>

                <h3 className={`h3 ${styles.dash_h3_27}`} >
                  {mod.title}
                </h3>

                <ProgressBar value={mod.progress} variant={mod.id === 'Writing' ? 'yellow' : 'purple'} small />

                <div
                  className={styles.dash_div_28}
                >
                  <div>
                    <div className="text-xs text-muted">Estimated band</div>
                    <div className={styles.dash_div_29}>
                      {mod.band.toFixed(1)}
                      <span className={`text-sm text-muted ${styles.dash_span_30}`} > / 9</span>
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
      <section id="roadmap" data-animate="card" className="card">
        <div className="section-header">
          <div>
            <span className={`text-xs text-muted ${styles.dash_span_26}`} >Stage 4 of 5</span>
            <h2 className="h2">Band 7.5 Preparation Path</h2>
          </div>
          <div className={styles.dash_div_31}>
            <ProgressBar value={75} variant="purple" showLabel />
          </div>
        </div>

        <div className={styles.dash_div_32}>
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
              <div className={styles.dash_div_3}>
                <div className={styles.dash_div_33}>{step.title}</div>
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
        <section data-animate="card" className={`card ${styles.dash_section_34}`} >
          <div className={styles.dash_div_35}>
            <div className={styles.dash_div_36}>
              <span
                className={styles.dash_span_37}
              >
                <Video size={18} />
              </span>
              <div>
                <div className={styles.dash_div_38}>
                  <Badge variant="purple">Live Coaching</Badge>
                  <span className="text-xs text-muted">Student Feedback</span>
                </div>
                <h3 className="h3">Speaking mock with a certified IELTS tutor</h3>
                <p className={`text-sm text-muted ${styles.dash_p_39}`} >
                  15-minute live Parts 1-3 interview with written rubric scorecard. Would you book one?
                </p>
                <div className={styles.dash_div_40}>
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
          className={styles.dash_div_41}
        >
          <div>
            <h2 className="h2">Performance Analytics</h2>
            <p className="text-xs text-muted">Your estimated IELTS band trajectory across recent tests</p>
          </div>
          <div className={styles.dash_div_42}>
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
                  className={`filter-pill ${chartMetric === m.id ? 'active' : ''} ${styles.dash_button_43}`}
                  
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
          className={styles.dash_div_44}
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

        <div className={styles.dash_div_45}>
          {activeSkills.map((item) => {
            const pct = Math.round((item.score / 9) * 100);
            const variant =
              item.status === 'Strong' ? 'success' : item.status === 'Focus' ? 'error' : 'yellow';
            return (
              <div
                key={item.criterion}
                className={styles.dash_div_46}
              >
                <div
                  className={styles.dash_div_47}
                >
                  <span className={styles.dash_span_48}>{item.criterion}</span>
                  <div className={styles.dash_div_49}>
                    <span className={styles.dash_span_50}>{item.score.toFixed(1)}</span>
                    <Badge variant={variant === 'error' ? 'error' : variant === 'success' ? 'success' : 'yellow'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <ProgressBar value={pct} variant={variant} small />
                <p className={`text-xs text-muted ${styles.dash_p_51}`} >{item.note}</p>
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
          <Link href="/tools" className={`text-xs ${styles.dash_link_24}`} >
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
                className={`card card-compact card-interactive ${styles.dash_link_52}`}
                
              >
                <div className={styles.dash_div_53}>
                  <span
                    className={styles.dash_span_54}
                  >
                    <Icon size={17} />
                  </span>
                  <div className={styles.dash_div_3}>
                    <div className={styles.dash_div_55}>
                      <span className={styles.dash_div_33}>{tool.title}</span>
                      {tool.badge && <Badge variant="purple">{tool.badge}</Badge>}
                    </div>
                    <p className={`text-xs text-muted ${styles.dash_p_56}`} >
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
          <Link href="/question-types" className={`text-xs ${styles.dash_link_24}`} >
            View all guides →
          </Link>
        </div>

        <div className="grid-4">
          {overviewData.learningResources.map((res) => (
            <Link
              key={res.id}
              href={res.href}
              data-animate="card"
              className={`card card-interactive ${styles.dash_link_57}`}
              
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
              <div className={styles.dash_div_58}>
                <span className={`text-xs ${styles.dash_span_59}`} >
                  {res.category}
                </span>
                <div className={styles.dash_div_60}>
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
        <div className={`grid-3 ${styles.dash_div_61}`} >
          <div className="card-warm card-compact">
            <div className="text-xs text-muted">Current Overall</div>
            <div className={styles.dash_div_62}>{profile.currentBand.toFixed(1)}</div>
          </div>
          <div className="card-warm card-compact">
            <div className="text-xs text-muted">30-Day Improvement</div>
            <div className={styles.dash_div_63}>+1.0 Band</div>
          </div>
          <div className="card-warm card-compact">
            <div className="text-xs text-muted">Weekly Hours</div>
            <div className={styles.dash_div_62}>10.6 hrs</div>
          </div>
        </div>
        <BandProgressionChart data={statsData.bandProgression} activeMetric={chartMetric} height={260} />
      </Modal>
    </div>
  );
}
