'use client';

import React from 'react';
import Image from 'next/image';
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

function AiHeroImage({ src, alt, width = 640, height = 480, priority = true }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        style={{
          width: '100%',
          maxWidth: 'min(100%, 580px)',
          height: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 14px 32px rgba(32, 32, 32, 0.08))',
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
}

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
      <AiHeroImage
        src="/images/hero/hero-ielts-roadmap.png"
        alt="IELTS Roadmap 3D learning journey with milestone checkpoints for Listening, Reading, Writing, and Speaking leading to Band 8.0 target"
        width={600}
        height={448}
        priority
      />
    );
  }

  if (slug === 'study-planner') {
    return (
      <AiHeroImage
        src="/images/hero/hero-study-planner.png"
        alt="IELTS Study Planner 3D visualization showing candidate organizing daily lessons, study blocks, and 12-day streak"
        width={600}
        height={448}
        priority
      />
    );
  }

  if (slug === 'simulation') {
    return (
      <AiHeroImage
        src="/images/hero/hero-mock-simulation.png"
        alt="IELTS Mock Examination simulation interface showing timed session, question palette, and four-skill modules"
        width={600}
        height={448}
        priority
      />
    );
  }

  if (slug === 'ai-coach') {
    return (
      <AiHeroImage
        src="/images/hero/hero-ai-coach.png"
        alt="IELTS AI Coach 3D holographic orb with real-time feedback cards and criteria tips"
        width={560}
        height={560}
        priority
      />
    );
  }

  if (slug === 'ai-examiner') {
    return (
      <AiHeroImage
        src="/images/hero/hero-ai-examiner.png"
        alt="IELTS AI Examiner 3D scoring console with Task Response, Coherence, Lexical Resource, and Grammar Range criteria meters"
        width={680}
        height={380}
        priority
      />
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
    <AiHeroImage
      src="/images/hero/hero-live-classes.png"
      alt="IELTS Live Free Classes 3D masterclass webinar with certified mentor, live attendee avatars, and interactive chat"
      width={600}
      height={448}
      priority
    />
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

