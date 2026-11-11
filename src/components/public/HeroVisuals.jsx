'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Play,
  Calendar,
  FileCheck2,
  GraduationCap,
  Users,
  ShieldCheck,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { Badge, ProgressBar } from '@/components/common/UiPrimitives';
import { SafeAvatar } from '@/components/common/SafeAvatar';

function MockWindowFrame({ title, rightBadge, dark = false, children }) {
  return (
    <div
      className={dark ? 'card-dark' : 'card'}
      style={{
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          paddingBottom: 12,
          borderBottom: `1px solid ${dark ? 'var(--dark-border)' : 'var(--border)'}`,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: 'var(--accent-yellow)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: dark ? '#FFFFFF' : 'var(--text-primary)',
            }}
          >
            {title}
          </span>
        </div>
        {rightBadge}
      </div>
      {children}
    </div>
  );
}

export function ResourceHeroVisual({ slug }) {
  if (slug === 'roadmap') {
    return (
      <MockWindowFrame
        title="IELTS Progression Path"
        rightBadge={<Badge variant="yellow">Band 5.5 → 7.5 Target</Badge>}
      >
        <div
          className="card-warm card-compact"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
        >
          <div>
            <div className="text-xs text-muted" style={{ fontWeight: 600 }}>Trajectory Forecast</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.35rem' }}>
              Stage 3 of 5 Active
            </div>
          </div>
          <svg viewBox="0 0 130 44" width="130" height="44" aria-hidden="true">
            <path d="M8 36 Q42 32 66 20 T122 8" fill="none" stroke="#8867B8" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="8" cy="36" r="4" fill="#242424" />
            <circle cx="66" cy="20" r="4.5" fill="#F6BD28" stroke="#242424" strokeWidth="1.5" />
            <circle cx="122" cy="8" r="4.5" fill="#39966B" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { stage: '01', name: 'Baseline Diagnostic', status: 'Done', pct: 100 },
            { stage: '02', name: 'Question Mechanics & Traps', status: 'Done', pct: 100 },
            { stage: '03', name: 'Task 2 Cohesion & Structure', status: '75%', pct: 75, active: true },
            { stage: '04', name: 'Full 2h 40m Mock Prediction', status: 'Next', pct: 15 },
          ].map((row) => (
            <div
              key={row.stage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                backgroundColor: row.active ? 'var(--accent-yellow-soft)' : 'var(--bg-primary)',
                border: '1px solid var(--border)',
              }}
            >
              <span className={row.active ? 'badge badge-dark' : 'badge badge-neutral'} style={{ padding: '2px 8px' }}>
                {row.stage}
              </span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: '0.86rem' }}>{row.name}</span>
              <span className="text-xs" style={{ fontWeight: 700, color: row.status === 'Done' ? 'var(--success)' : 'var(--text-primary)' }}>
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </MockWindowFrame>
    );
  }

  if (slug === 'study-planner') {
    return (
      <MockWindowFrame
        title="Weekly Study Planner"
        rightBadge={<Badge variant="yellow"><Flame size={12} /> 12-Day Streak</Badge>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 6 }}>
          {['08', '09', '10', '11', '12', '13', '14'].map((day, idx) => {
            const active = day === '11';
            const done = idx < 3;
            return (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  padding: '8px 0',
                  borderRadius: 9,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: active ? '1.5px solid var(--dark-section)' : '1px solid var(--border)',
                  backgroundColor: active ? 'var(--dark-section)' : done ? 'var(--accent-yellow-soft)' : 'var(--bg-primary)',
                  color: active ? '#FFFFFF' : 'var(--text-primary)',
                }}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600 }}>
            <span>Today&apos;s Daily Goal</span>
            <span>45 / 60 min</span>
          </div>
          <ProgressBar value={75} variant="purple" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            { label: 'Passage 2: Thermal Albedo & TFNG', meta: 'Reading • 25 min', done: true },
            { label: 'Body Paragraph Cohesion Rewrite', meta: 'Writing • 20 min', done: true },
            { label: '15 Academic Urbanism Flashcards', meta: 'Vocabulary • 15 min', done: false },
          ].map((task) => (
            <div
              key={task.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 11px',
                borderRadius: 10,
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
              }}
            >
              <CheckCircle2
                size={16}
                style={{ color: task.done ? 'var(--success)' : 'var(--text-muted)', flexShrink: 0 }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', textDecoration: task.done ? 'line-through' : 'none' }}>
                  {task.label}
                </div>
                <div className="text-xs text-muted">{task.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </MockWindowFrame>
    );
  }

  if (slug === 'simulation') {
    return (
      <MockWindowFrame
        title="Computer-Delivered Mock Interface"
        rightBadge={<Badge variant="dark"><Clock size={12} /> 47:12</Badge>}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { label: 'Listening', icon: Headphones, done: true },
            { label: 'Reading', icon: BookOpen, active: true },
            { label: 'Writing', icon: PenTool },
            { label: 'Speaking', icon: Mic },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <span
                key={mod.label}
                className={`badge ${mod.active ? 'badge-yellow' : mod.done ? 'badge-success' : 'badge-neutral'}`}
                style={{ padding: '5px 10px' }}
              >
                <Icon size={12} /> {mod.label}
              </span>
            );
          })}
        </div>

        <div className="grid-2" style={{ gap: 10 }}>
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              fontSize: '0.82rem',
              lineHeight: 1.55,
            }}
          >
            <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 4 }}>PASSAGE VIEW (50/50)</div>
            Vegetated urban rooftops <mark style={{ backgroundColor: 'var(--accent-yellow-soft)', padding: '0 3px', borderRadius: 3 }}>mitigated peak heat by 3.2°C</mark> across test districts.
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div className="text-xs" style={{ fontWeight: 700 }}>Q14 • True / False / Not Given</div>
            {['True ✓', 'False', 'Not Given'].map((opt, idx) => (
              <div
                key={opt}
                style={{
                  padding: '5px 9px',
                  borderRadius: 7,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: idx === 0 ? 'var(--dark-section)' : 'var(--surface)',
                  color: idx === 0 ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      </MockWindowFrame>
    );
  }

  if (slug === 'vocabulary') {
    return (
      <MockWindowFrame
        title="Lexical Resource Card Studio"
        rightBadge={<Badge variant="purple">Band 7.5+ Deck</Badge>}
      >
        <div className="card-warm" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.1 }}>
                mitigate
              </div>
              <div className="text-xs text-muted">/ˈmɪt.ɪ.ɡeɪt/ • verb • Environment &amp; Cities</div>
            </div>
            <Badge variant="yellow">Word of the Day</Badge>
          </div>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--text-primary)' }}>
            To make something harmful, inconvenient, or severe less intense.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['mitigate the impact', 'mitigate risk', 'alleviate'].map((tag) => (
              <Badge key={tag} variant="neutral">{tag}</Badge>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600 }}>
            <span>Deck Retention &amp; Recall</span>
            <span>248 words mastered</span>
          </div>
          <ProgressBar value={78} variant="yellow" />
        </div>
      </MockWindowFrame>
    );
  }

  if (slug === 'ai-coach') {
    return (
      <MockWindowFrame
        title="IELTS AI Coach Session"
        rightBadge={<Badge variant="success">24/7 Guided Prep</Badge>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              alignSelf: 'flex-end',
              maxWidth: '88%',
              padding: '10px 14px',
              borderRadius: '14px 14px 4px 14px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              fontSize: '0.88rem',
              fontWeight: 500,
            }}
          >
            &ldquo;Why did my Writing Coherence stay at 6.0 even with transition words?&rdquo;
          </div>

          <div
            className="card-dark card-compact"
            style={{
              borderRadius: '14px 14px 14px 4px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} style={{ color: 'var(--accent-yellow)' }} />
              <span className="text-xs" style={{ fontWeight: 700, color: 'var(--accent-yellow)' }}>Coach Diagnosis</span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.55, color: '#EAE8E1' }}>
              Body paragraph 2 shifts to municipal budgets without referencing your thesis. Connect paragraphs with pronoun framing, then drill one 10-minute topic sentence rewrite.
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Badge variant="yellow">Recommended: 10m Cohesion Drill</Badge>
            </div>
          </div>
        </div>
      </MockWindowFrame>
    );
  }

  if (slug === 'ai-examiner') {
    return (
      <MockWindowFrame
        title="4-Criterion Examiner Scorecard"
        rightBadge={<Badge variant="dark">Writing Task 2 • Evaluated</Badge>}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 14, borderRadius: 12, backgroundColor: 'var(--dark-section)', color: '#FFFFFF' }}>
          <div>
            <div className="text-xs" style={{ color: '#B7B5AD' }}>Estimated Overall Score</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.1rem', color: 'var(--accent-yellow)', lineHeight: 1.1 }}>
              Band 7.0
            </div>
          </div>
          <Badge variant="yellow">±0.25 Rubric Calibrated</Badge>
        </div>

        <div className="grid-2" style={{ gap: 8 }}>
          {[
            { name: 'Task Response', score: '7.0', pct: 78 },
            { name: 'Coherence & Cohesion', score: '6.5', pct: 70 },
            { name: 'Lexical Resource', score: '7.5', pct: 84 },
            { name: 'Grammatical Range', score: '7.0', pct: 78 },
          ].map((c) => (
            <div key={c.name} className="card-warm card-compact" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                <span>{c.name}</span>
                <span>{c.score}</span>
              </div>
              <ProgressBar value={c.pct} variant={c.score === '6.5' ? 'yellow' : 'purple'} />
            </div>
          ))}
        </div>
      </MockWindowFrame>
    );
  }

  // self-paced-courses
  return (
    <MockWindowFrame
      title="Self-Paced Curriculum Tracks"
      rightBadge={<Badge variant="yellow">96+ Video &amp; Strategy Units</Badge>}
    >
      <div
        className="card-dark card-compact"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              backgroundColor: 'var(--accent-yellow)',
              color: '#202020',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Play size={15} fill="#202020" />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>
              Module I-R3 • True / False / Not Given Logic
            </div>
            <div className="text-xs" style={{ color: '#B7B5AD' }}>14 min • Reading Strategy + Check</div>
          </div>
        </div>
        <Badge variant="yellow">Active</Badge>
      </div>

      <div className="grid-2" style={{ gap: 8 }}>
        {[
          { track: 'Beginner', band: 'Band 4.5–5.5', count: '24 Units' },
          { track: 'Intermediate', band: 'Band 5.5–6.5', count: '30 Units' },
          { track: 'Advanced', band: 'Band 7.0–8.5+', count: '22 Units' },
          { track: 'General Training', band: 'Work & Migration', count: '20 Units' },
        ].map((t) => (
          <div key={t.track} className="card-warm card-compact" style={{ padding: '10px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{t.track}</div>
            <div className="text-xs text-muted">{t.band} • {t.count}</div>
          </div>
        ))}
      </div>
    </MockWindowFrame>
  );
}

export function ServiceHeroVisual({ slug }) {
  if (slug === 'prediction-test') {
    return (
      <MockWindowFrame
        title="Official Readiness Prediction"
        rightBadge={<Badge variant="success">High Confidence Fit</Badge>}
      >
        <div style={{ padding: 16, borderRadius: 12, backgroundColor: 'var(--dark-section)', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div className="text-xs" style={{ color: '#B7B5AD' }}>Projected Exam Score</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--accent-yellow)', lineHeight: 1.1 }}>
              Band 7.5
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Badge variant="yellow">Ready to Register</Badge>
            <div className="text-xs" style={{ color: '#B7B5AD', marginTop: 4 }}>Calibrated across 4 skills</div>
          </div>
        </div>

        <div className="grid-4" style={{ gap: 8 }}>
          {[
            { s: 'Listening', b: '8.0' },
            { s: 'Reading', b: '7.5' },
            { s: 'Writing', b: '7.0' },
            { s: 'Speaking', b: '7.0' },
          ].map((m) => (
            <div key={m.s} className="card-warm card-compact" style={{ textAlign: 'center', padding: '10px 6px' }}>
              <div className="text-xs text-muted">{m.s}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', marginTop: 2 }}>{m.b}</div>
            </div>
          ))}
        </div>
      </MockWindowFrame>
    );
  }

  if (slug === 'online-classes') {
    return (
      <MockWindowFrame
        title="Live Small-Group Cohort"
        rightBadge={<Badge variant="purple">Max 6 Learners</Badge>}
      >
        <div className="card-dark card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <Badge variant="yellow">Live Workshop Session</Badge>
            <span className="text-xs" style={{ color: '#B7B5AD' }}>Thu 19:00 UTC</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#FFFFFF' }}>
            Task 2 Cohesion &amp; Argument Teardown
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SafeAvatar
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80"
                name="Dr. Claire Bennett"
                size={32}
              />
              <span className="text-xs" style={{ color: '#EAE8E1', fontWeight: 600 }}>Dr. Claire Bennett</span>
            </div>
            <span className="text-xs" style={{ color: 'var(--accent-yellow)', fontWeight: 700 }}>3 seats left</span>
          </div>
        </div>
        <div className="grid-2" style={{ gap: 8 }}>
          <div className="card-warm card-compact text-xs">
            <strong>8 Annotated Essays</strong>
            <div className="text-muted">Criterion-by-criterion trainer edits</div>
          </div>
          <div className="card-warm card-compact text-xs">
            <strong>Live Speaking Sparring</strong>
            <div className="text-muted">Direct Part 2–3 feedback rounds</div>
          </div>
        </div>
      </MockWindowFrame>
    );
  }

  if (slug === 'proofreading-translation') {
    return (
      <MockWindowFrame
        title="Editorial Track-Changes Review"
        rightBadge={<Badge variant="success"><FileCheck2 size={12} /> 48h Delivery</Badge>}
      >
        <div className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.86rem', lineHeight: 1.6 }}>
          <div className="text-xs text-muted" style={{ fontWeight: 700 }}>PERSONAL STATEMENT EXCERPT</div>
          <p>
            My research will create{' '}
            <span style={{ textDecoration: 'line-through', color: 'var(--error)' }}>very big good changes</span>{' '}
            <span style={{ backgroundColor: 'var(--accent-purple-soft)', color: '#5D3E8F', fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>
              measurable civic impact
            </span>{' '}
            across municipal transit corridors.
          </p>
          <div className="text-xs" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
            Editor Note: Tightened academic register &amp; eliminated vague modifier.
          </div>
        </div>
        <div className="grid-2" style={{ gap: 8 }}>
          <div className="card-warm card-compact text-xs"><strong>CV / SOP Polish</strong><div className="text-muted">Up to 2 revisions</div></div>
          <div className="card-warm card-compact text-xs"><strong>Certified Translation</strong><div className="text-muted">Official format seal</div></div>
        </div>
      </MockWindowFrame>
    );
  }

  // study-abroad-preparation
  return (
    <MockWindowFrame
      title="Admissions & Scholarship Tracker"
      rightBadge={<Badge variant="yellow"><GraduationCap size={12} /> Mentor Guided</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Program Shortlist (UK & Canada)', tag: '5 Matched', done: true },
          { label: 'Personal Statement & Leadership Essay', tag: 'Reviewed ✓', done: true },
          { label: 'Official IELTS Target (7.5 Overall)', tag: 'Met ✓', done: true },
          { label: 'Scholarship Mock Panel Interview', tag: 'Scheduled', done: false },
        ].map((step) => (
          <div
            key={step.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
              padding: '9px 11px',
              borderRadius: 10,
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{step.label}</span>
            <Badge variant={step.done ? 'success' : 'purple'}>{step.tag}</Badge>
          </div>
        ))}
      </div>
    </MockWindowFrame>
  );
}

export function LiveClassHeroVisual() {
  return (
    <MockWindowFrame
      title="Next Live Interactive Clinic"
      rightBadge={<Badge variant="yellow">Free Open Seat</Badge>}
    >
      <div className="card-dark card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Badge variant="purple">Writing Clinic</Badge>
          <span className="text-xs" style={{ color: 'var(--accent-yellow)', fontWeight: 700 }}>Thu, Nov 19 • 19:00 UTC</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#FFFFFF' }}>
          Task 2 Coherence Lab: Eliminating Paragraph Jumps
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafeAvatar
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80"
              name="Dr. Claire Bennett"
              size={30}
            />
            <span className="text-xs" style={{ color: '#EAE8E1' }}>Dr. Claire Bennett</span>
          </div>
          <span className="text-xs" style={{ color: '#B7B5AD' }}><Users size={12} style={{ display: 'inline' }} /> 14 seats open</span>
        </div>
      </div>
      <div className="grid-2" style={{ gap: 8 }}>
        <div className="card-warm card-compact text-xs"><strong>Live Q&amp;A Included</strong><div className="text-muted">Ask mentors directly</div></div>
        <div className="card-warm card-compact text-xs"><strong>Replay Archive</strong><div className="text-muted">4 strategy videos free</div></div>
      </div>
    </MockWindowFrame>
  );
}

export function AboutHeroVisual() {
  return (
    <MockWindowFrame
      title="Educators Behind IELTS Ultimate"
      rightBadge={<Badge variant="success"><ShieldCheck size={12} /> IDP &amp; Academic Specialists</Badge>}
    >
      <div className="grid-2" style={{ gap: 10 }}>
        {[
          { name: 'Dr. Claire Bennett', role: 'Former Examiner', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80' },
          { name: 'Marcus Vance', role: 'Reading & Data Coach', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80' },
          { name: 'Hannah Al-Mansoor', role: 'Fluency Specialist', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80' },
          { name: 'Prof. Alistair Reed', role: 'Admissions Mentor', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80' },
        ].map((t) => (
          <div key={t.name} className="card-warm card-compact" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10 }}>
            <SafeAvatar src={t.img} name={t.name} size={38} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
              <div className="text-xs text-muted">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </MockWindowFrame>
  );
}

export function ContactHeroVisual() {
  return (
    <MockWindowFrame
      title="Student & Admissions Advisory Desk"
      rightBadge={<Badge variant="yellow">Replies &lt; 24 Hours</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="card-warm card-compact" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mail size={16} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>support@ieltsultimate.edu</div>
            <div className="text-xs text-muted">Study planner, account access &amp; simulation help</div>
          </div>
        </div>
        <div className="card-warm card-compact" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MessageSquare size={16} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>admissions@ieltsultimate.edu</div>
            <div className="text-xs text-muted">Document proofreading &amp; scholarship mentoring inquiries</div>
          </div>
        </div>
      </div>
    </MockWindowFrame>
  );
}

