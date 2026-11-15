'use client';
import styles from './HeroVisuals.module.css';

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
      className={styles.hero_div_1}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={styles.hero_image_2}
      />
    </div>
  );
}

function MockWindowFrame({ title, rightBadge, dark = false, children }) {
  return (
    <div
      className={`${dark ? 'card-dark' : 'card'} ${styles.hero_div_3}`}
      
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
        <div className={styles.hero_div_4}>
          <span
            className={styles.hero_span_5}
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
        <div className={`card-warm ${styles.hero_div_6}`} >
          <div className={styles.hero_div_7}>
            <div>
              <div className={styles.hero_div_8}>
                mitigate
              </div>
              <div className="text-xs text-muted">/ˈmɪt.ɪ.ɡeɪt/ • verb • Environment &amp; Cities</div>
            </div>
            <Badge variant="yellow">Word of the Day</Badge>
          </div>
          <p className={styles.hero_p_9}>
            To make something harmful, inconvenient, or severe less intense.
          </p>
          <div className={styles.hero_div_10}>
            {['mitigate the impact', 'mitigate risk', 'alleviate'].map((tag) => (
              <Badge key={tag} variant="neutral">{tag}</Badge>
            ))}
          </div>
        </div>

        <div className={styles.hero_div_11}>
          <div className={styles.hero_div_12}>
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
        className={`card-dark card-compact ${styles.hero_div_13}`}
        
      >
        <div className={styles.hero_div_14}>
          <span
            className={styles.hero_span_15}
          >
            <Play size={15} fill="#202020" />
          </span>
          <div className={styles.hero_div_16}>
            <div className={styles.hero_div_17}>
              Module I-R3 • True / False / Not Given Logic
            </div>
            <div className={`text-xs ${styles.hero_div_18}`} >14 min • Reading Strategy + Check</div>
          </div>
        </div>
        <Badge variant="yellow">Active</Badge>
      </div>

      <div className={`grid-2 ${styles.hero_div_19}`} >
        {[
          { track: 'Beginner', band: 'Band 4.5–5.5', count: '24 Units' },
          { track: 'Intermediate', band: 'Band 5.5–6.5', count: '30 Units' },
          { track: 'Advanced', band: 'Band 7.0–8.5+', count: '22 Units' },
          { track: 'Academic Intensive', band: 'Postgraduate & Honors', count: '20 Units' },
        ].map((t) => (
          <div key={t.track} className={`card-warm card-compact ${styles.hero_div_20}`} >
            <div className={styles.hero_div_21}>{t.track}</div>
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
        <div className={styles.hero_div_22}>
          <div>
            <div className={`text-xs ${styles.hero_div_18}`} >Projected Exam Score</div>
            <div className={styles.hero_div_23}>
              Band 7.5
            </div>
          </div>
          <div className={styles.hero_div_24}>
            <Badge variant="yellow">Ready to Register</Badge>
            <div className={`text-xs ${styles.hero_div_25}`} >Calibrated across 4 skills</div>
          </div>
        </div>

        <div className={`grid-4 ${styles.hero_div_19}`} >
          {[
            { s: 'Listening', b: '8.0' },
            { s: 'Reading', b: '7.5' },
            { s: 'Writing', b: '7.0' },
            { s: 'Speaking', b: '7.0' },
          ].map((m) => (
            <div key={m.s} className={`card-warm card-compact ${styles.hero_div_26}`} >
              <div className="text-xs text-muted">{m.s}</div>
              <div className={styles.hero_div_27}>{m.b}</div>
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
        <div className={`card-dark card-compact ${styles.hero_div_6}`} >
          <div className={styles.hero_div_28}>
            <Badge variant="yellow">Live Workshop Session</Badge>
            <span className={`text-xs ${styles.hero_div_18}`} >Thu 19:00 UTC</span>
          </div>
          <div className={styles.hero_div_29}>
            Task 2 Cohesion &amp; Argument Teardown
          </div>
          <div className={styles.hero_div_30}>
            <div className={styles.hero_div_4}>
              <SafeAvatar
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80"
                name="Dr. Claire Bennett"
                size={32}
              />
              <span className={`text-xs ${styles.hero_span_31}`} >Dr. Claire Bennett</span>
            </div>
            <span className={`text-xs ${styles.hero_span_32}`} >3 seats left</span>
          </div>
        </div>
        <div className={`grid-2 ${styles.hero_div_19}`} >
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
        <div className={`card-warm card-compact ${styles.hero_div_33}`} >
          <div className={`text-xs text-muted ${styles.hero_div_34}`} >PERSONAL STATEMENT EXCERPT</div>
          <p>
            My research will create{' '}
            <span className={styles.hero_span_35}>very big good changes</span>{' '}
            <span className={styles.hero_span_36}>
              measurable civic impact
            </span>{' '}
            across municipal transit corridors.
          </p>
          <div className={`text-xs ${styles.hero_div_37}`} >
            Editor Note: Tightened academic register &amp; eliminated vague modifier.
          </div>
        </div>
        <div className={`grid-2 ${styles.hero_div_19}`} >
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
      <div className={styles.hero_div_38}>
        {[
          { label: 'Program Shortlist (UK & Canada)', tag: '5 Matched', done: true },
          { label: 'Personal Statement & Leadership Essay', tag: 'Reviewed ✓', done: true },
          { label: 'Official IELTS Target (7.5 Overall)', tag: 'Met ✓', done: true },
          { label: 'Scholarship Mock Panel Interview', tag: 'Scheduled', done: false },
        ].map((step) => (
          <div
            key={step.label}
            className={styles.hero_div_39}
          >
            <span className={styles.hero_span_40}>{step.label}</span>
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
      <div className={`grid-2 ${styles.hero_div_41}`} >
        {[
          { name: 'Dr. Claire Bennett', role: 'Former Examiner', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80' },
          { name: 'Marcus Vance', role: 'Reading & Data Coach', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80' },
          { name: 'Hannah Al-Mansoor', role: 'Fluency Specialist', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80' },
          { name: 'Prof. Alistair Reed', role: 'Admissions Mentor', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80' },
        ].map((t) => (
          <div key={t.name} className={`card-warm card-compact ${styles.hero_div_42}`} >
            <SafeAvatar src={t.img} name={t.name} size={38} />
            <div className={styles.hero_div_16}>
              <div className={styles.hero_div_43}>{t.name}</div>
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
      <div className={styles.hero_div_6}>
        <div className={`card-warm card-compact ${styles.hero_div_44}`} >
          <Mail size={16} className={styles.hero_mail_45} />
          <div>
            <div className={styles.hero_div_21}>support@ieltsultimate.edu</div>
            <div className="text-xs text-muted">Study planner, account access &amp; simulation help</div>
          </div>
        </div>
        <div className={`card-warm card-compact ${styles.hero_div_44}`} >
          <MessageSquare size={16} className={styles.hero_mail_45} />
          <div>
            <div className={styles.hero_div_21}>admissions@ieltsultimate.edu</div>
            <div className="text-xs text-muted">Document proofreading &amp; scholarship mentoring inquiries</div>
          </div>
        </div>
      </div>
    </MockWindowFrame>
  );
}

