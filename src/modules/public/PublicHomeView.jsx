'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Star,
  Clock,
  Sparkles,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Flame,
  Calendar,
} from 'lucide-react';
import { RESOURCE_NAV_ITEMS, SERVICE_NAV_ITEMS } from '@/lib/public-navigation';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { Badge, ProgressBar } from '@/components/common/UiPrimitives';
import {
  PublicIcon,
  PublicSectionHeader,
  PublicFaqAccordion,
  PublicCtaBanner,
  HeroArtworkGraphic,
} from '@/components/public/PublicPrimitives';
import homepageData from '@/data/public/homepage.json';
import liveClassesData from '@/data/public/live-classes.json';
import resourcesData from '@/data/public/resources-pages.json';
import styles from '@/components/public/PublicLayout.module.css';

export function PublicHomeView() {
  const rootRef = useGsapEntrance('public-home');
  const [activeTabId, setActiveTabId] = useState(homepageData.showcaseTabs[0].id);

  const activeShowcase =
    homepageData.showcaseTabs.find((t) => t.id === activeTabId) || homepageData.showcaseTabs[0];

  return (
    <div ref={rootRef}>
      {/* 1. Hero Section */}
      <section className={styles.sectionSpace} style={{ paddingTop: 36, paddingBottom: 42 }}>
        <div className={styles.container}>
          <div className={`card-warm ${styles.publicHeroGrid}`} data-animate="card" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Badge variant="yellow">{homepageData.hero.eyebrow}</Badge>
                <Badge variant="purple">Academic &amp; General Training</Badge>
              </div>
              <h1 className="hero-heading">
                {homepageData.hero.headline}
              </h1>
              <p className="hero-desc">
                {homepageData.hero.description}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                <Link href={homepageData.hero.primaryCta.href} className="btn btn-primary btn-lg">
                  {homepageData.hero.primaryCta.label} <ArrowRight size={16} />
                </Link>
                <Link href={homepageData.hero.secondaryCta.href} className="btn btn-secondary btn-lg">
                  {homepageData.hero.secondaryCta.label}
                </Link>
              </div>
              <div
                className="supporting-text"
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}
              >
                <Star size={15} style={{ flexShrink: 0, color: 'var(--accent-yellow)', fill: 'var(--accent-yellow)' }} />
                <span>{homepageData.hero.trustNote}</span>
              </div>
            </div>

            {/* 3 Hero Cards Preview */}
            <div className="hero-cards-grid">
              {homepageData.hero.previewCards.map((hc) => {
                const bg =
                  hc.theme === 'yellow'
                    ? 'var(--accent-yellow)'
                    : hc.theme === 'purple'
                    ? 'var(--accent-purple)'
                    : 'var(--surface)';
                const fg = hc.theme === 'purple' ? '#FFFFFF' : 'var(--text-primary)';
                return (
                  <Link
                    key={hc.num}
                    href={hc.href}
                    className="hero-milestone-card"
                    style={{
                      backgroundColor: bg,
                      color: fg,
                      borderRadius: 'var(--radius-md)',
                      border: hc.theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(0,0,0,0.06)',
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <div>
                      <div className="text-xs" style={{ fontWeight: 700, opacity: 0.78, marginBottom: 6 }}>
                        {hc.num}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.96rem', lineHeight: 1.25 }}>
                        {hc.title}
                      </div>
                      <div className="text-xs" style={{ opacity: 0.85, marginTop: 5, lineHeight: 1.45 }}>
                        {hc.subtitle}
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                      <HeroArtworkGraphic theme={hc.theme} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="grid-4" style={{ marginTop: 18 }}>
            {homepageData.hero.stats.map((st, idx) => (
              <div
                key={st.label}
                data-animate="card"
                className={idx === 0 ? 'card-dark card-compact' : 'card card-compact'}
                style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    color: idx === 0 ? 'var(--accent-yellow)' : 'var(--text-primary)',
                  }}
                >
                  {st.value}
                </div>
                <div className="text-xs" style={{ color: idx === 0 ? '#B7B5AD' : 'var(--text-secondary)' }}>
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Platform Ecosystem Overview (All 7 Resources) */}
      <section className={styles.sectionWarmBand}>
        <div className={styles.container}>
          <PublicSectionHeader
            eyebrow="Everything Under One Roof"
            title="Seven connected IELTS learning tools built around one score goal"
            subtitle="Explore every module in depth before opening your student dashboard—from your initial roadmap and daily study queue to full simulations and rubric evaluations."
          />

          <div className="grid-3">
            {RESOURCE_NAV_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                data-animate="reveal"
                className="card card-interactive"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <PublicIcon name={item.icon} size={18} />
                    </span>
                    <Badge variant="neutral">{item.badge}</Badge>
                  </div>
                  <h3 className="card-heading" style={{ marginBottom: 8 }}>{item.title}</h3>
                  <p className="body-text">{item.shortDesc}</p>
                </div>
                <span className="text-xs" style={{ fontWeight: 700, color: 'var(--accent-purple)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Explore {item.title} <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. IELTS Preparation Roadmap Preview + 4 Simple Steps */}
      <section className={styles.sectionSpace}>
        <div className={styles.container}>
          <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
            <div data-animate="reveal" className="card">
              <div className="section-header">
                <div>
                  <Badge variant="yellow">IELTS Roadmap Preview</Badge>
                  <h2 className="h2" style={{ marginTop: 8 }}>Five clear milestones to reach your target score</h2>
                </div>
                <Link href="/resources/roadmap" className="btn btn-secondary btn-sm">
                  Full Roadmap <ArrowUpRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {homepageData.roadmapStages.map((st, idx) => (
                  <div
                    key={st.step}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: idx === 0 ? 'var(--accent-yellow-soft)' : 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span className={idx === 0 ? 'badge badge-dark' : 'badge badge-neutral'} style={{ flexShrink: 0 }}>
                      {st.step}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{st.title}</div>
                      <p className="text-xs text-muted" style={{ marginTop: 3, lineHeight: 1.5 }}>{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div data-animate="reveal" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Badge variant="purple">How It Works</Badge>
                <h2 className="h2" style={{ marginTop: 8 }}>From sign-up to test readiness in four steps</h2>
                <p className="text-sm text-muted" style={{ marginTop: 4 }}>
                  Zero setup friction—begin with your baseline diagnostic and receive a balanced daily study plan immediately.
                </p>
              </div>

              <div className="grid-2" style={{ gap: 12 }}>
                {homepageData.gettingStartedSteps.map((s) => (
                  <div key={s.num} className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span className="badge badge-dark" style={{ alignSelf: 'flex-start' }}>Step {s.num}</span>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 2 }}>{s.title}</div>
                    <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="card-dark card-compact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>Ready to see your baseline?</div>
                  <div className="text-xs" style={{ color: '#B7B5AD' }}>Log in or create a free demo student account anytime.</div>
                </div>
                <Link href="/dashboard" className="btn btn-accent btn-sm">
                  Open Dashboard <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Inside-the-Platform Preview */}
      <section id="platform-preview" className={styles.sectionWarmBand}>
        <div className={styles.container}>
          <PublicSectionHeader
            eyebrow="Inside the Platform"
            title="Engineered to mirror real IELTS exam ergonomics"
            subtitle="Switch tabs below to inspect how Simulation Tests, the AI Examiner, the Study Planner, and the Vocabulary Studio feel before opening your dashboard."
            align="center"
          />

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div className="tabs-list">
              {homepageData.showcaseTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`tab-trigger ${activeTabId === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 'clamp(18px, 3vw, 28px)' }}>
            <div className="grid-2" style={{ gap: 24, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <Badge variant="purple">{activeShowcase.badge}</Badge>
                  <Badge variant="yellow"><Clock size={12} /> {activeShowcase.timer}</Badge>
                </div>
                <h3 className="subheading">{activeShowcase.promptTitle}</h3>
                <p className="body-text">
                  {activeShowcase.promptBody}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {activeShowcase.options.map((opt) => (
                    <span
                      key={opt}
                      className={`badge ${opt === activeShowcase.selectedOption ? 'badge-dark' : 'badge-neutral'}`}
                      style={{ padding: '6px 12px' }}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                  <Link href={activeShowcase.dashboardHref} className="btn btn-primary btn-sm">
                    {activeShowcase.ctaLabel} <ArrowRight size={14} />
                  </Link>
                  <Link href={activeShowcase.href} className="btn btn-secondary btn-sm">
                    Read Feature Guide
                  </Link>
                </div>
              </div>

              <div className="grid-2" style={{ gap: 12 }}>
                {activeShowcase.metrics.map((m, idx) => (
                  <div
                    key={m.label}
                    className={idx === 0 ? 'card-dark card-compact' : 'card-warm card-compact'}
                  >
                    <div className="text-xs" style={{ color: idx === 0 ? '#B7B5AD' : 'var(--text-secondary)' }}>
                      {m.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1.6rem',
                        marginTop: 6,
                        color: idx === 0 ? 'var(--accent-yellow)' : 'var(--text-primary)',
                      }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Study Planner, AI Coach & AI Examiner Feature Highlights */}
      <section className={styles.sectionSpace}>
        <div className={styles.container}>
          <PublicSectionHeader
            eyebrow="Personalized Study Engine"
            title="Adaptive planning, instant AI rubric feedback, and vocabulary mastery"
            subtitle="Every attempt trains your next study recommendation automatically—turning isolated mock scores into clear daily momentum."
          />

          <div className="grid-2" style={{ gap: 18 }}>
            {/* Card A: Study Planner + Streak */}
            <div data-animate="reveal" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Badge variant="yellow"><Calendar size={12} /> IELTS Study Planner</Badge>
                <span className="badge badge-neutral"><Flame size={12} style={{ color: 'var(--accent-yellow)' }} /> 12-day Streak Tracking</span>
              </div>
              <div>
                <h3 className="card-heading" style={{ marginBottom: 8 }}>Daily study blocks tailored to your exam deadline</h3>
                <p className="body-text">
                  Set Academic or General Training, choose 30 to 120 minutes per day, and follow sequenced lessons mixing Reading, Listening, Writing, Speaking, and lexical recall.
                </p>
              </div>
              <div className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                  <span>Overall Weekly Target</span>
                  <span>14 / 20 tasks (70%)</span>
                </div>
                <ProgressBar value={70} variant="purple" />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href="/study-plan" className="btn btn-primary btn-sm">Start Study Planner →</Link>
                <Link href="/resources/study-planner" className="btn btn-secondary btn-sm">Explore Planner Details</Link>
              </div>
            </div>

            {/* Card B: AI Coach & AI Examiner */}
            <div data-animate="reveal" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Badge variant="purple"><Sparkles size={12} /> AI Coach &amp; AI Examiner</Badge>
                <span className="badge badge-success">4 Criteria Evaluated</span>
              </div>
              <div>
                <h3 className="card-heading" style={{ marginBottom: 8 }}>Criterion-level Writing &amp; Speaking breakdowns anytime</h3>
                <p className="body-text">
                  Inspect separate scores for Task Achievement, Coherence, Lexical Resource, Grammar, and Fluency—paired with targeted 10-minute coaching drills.
                </p>
              </div>
              <div className="grid-2" style={{ gap: 8 }}>
                {[
                  { label: 'Task Response', score: '7.0' },
                  { label: 'Coherence', score: '6.5' },
                  { label: 'Lexical Resource', score: '7.5' },
                  { label: 'Grammar Range', score: '7.0' },
                ].map((c) => (
                  <div key={c.label} className="card-warm card-compact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px' }}>
                    <span className="text-xs" style={{ fontWeight: 600 }}>{c.label}</span>
                    <Badge variant="dark">{c.score}</Badge>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href="/resources/ai-coach" className="btn btn-secondary btn-sm">IELTS AI Coach</Link>
                <Link href="/resources/ai-examiner" className="btn btn-primary btn-sm">IELTS AI Examiner →</Link>
              </div>
            </div>

            {/* Card C: Simulation & Vocabulary */}
            <div data-animate="reveal" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge variant="neutral"><BookOpen size={12} /> Reading</Badge>
                <Badge variant="neutral"><Headphones size={12} /> Listening</Badge>
                <Badge variant="neutral"><PenTool size={12} /> Writing</Badge>
                <Badge variant="neutral"><Mic size={12} /> Speaking</Badge>
              </div>
              <div>
                <h3 className="card-heading" style={{ marginBottom: 8 }}>Full 2h 40m Mock Simulation &amp; Vocabulary Bank</h3>
                <p className="body-text">
                  Practise real split-screen passage highlighting, timed Listening recordings, and 36+ high-band vocabulary decks complete with IPA phonetics and synonym pairs.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href="/mock-test" className="btn btn-primary btn-sm">Start Simulation →</Link>
                <Link href="/vocabulary" className="btn btn-secondary btn-sm">Practise Vocabulary</Link>
              </div>
            </div>

            {/* Card D: Self-Paced Tracks Preview */}
            <div data-animate="reveal" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              <Badge variant="yellow" style={{ alignSelf: 'flex-start' }}>Self-Paced Curriculum</Badge>
              <div>
                <h3 className="card-heading" style={{ marginBottom: 8 }}>Structured paths from Band 4.5 foundations to Band 8+</h3>
                <p className="body-text">
                  Follow progressive lessons spanning Beginner, Intermediate, Advanced, and General Training pathways covering grammar, lexis, and all four exam skills.
                </p>
              </div>
              <div className="grid-2" style={{ gap: 8 }}>
                {resourcesData['self-paced-courses'].tracks.map((tr) => (
                  <div key={tr.id} style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{tr.level}</div>
                    <div className="text-xs text-muted">{tr.targetBand}</div>
                  </div>
                ))}
              </div>
              <Link href="/resources/self-paced-courses" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                Explore Course Paths →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Services & Upcoming Free Live Classes Preview */}
      <section className={styles.sectionWarmBand}>
        <div className={styles.container}>
          <PublicSectionHeader
            eyebrow="Expert Services & Live Instruction"
            title="Live coaching, official score prediction, and admissions support"
            subtitle="Combine daily platform practice with certified human classes, document proofreading, and university admissions mentoring."
          />

          <div className="grid-4" style={{ marginBottom: 24 }}>
            {SERVICE_NAV_ITEMS.map((srv) => (
              <Link
                key={srv.slug}
                href={srv.href}
                data-animate="reveal"
                className="card card-interactive"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}
              >
                <div>
                  <Badge variant="yellow">{srv.badge}</Badge>
                  <h3 className="card-heading" style={{ marginTop: 12, marginBottom: 8 }}>{srv.title}</h3>
                  <p className="supporting-text">{srv.shortDesc}</p>
                </div>
                <span className="text-xs" style={{ fontWeight: 700, color: 'var(--accent-purple)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  View Service <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <div>
                <Badge variant="success">Open Enrollment</Badge>
                <h3 className="h2" style={{ marginTop: 6 }}>Upcoming Live Free Classes</h3>
              </div>
              <Link href="/live-classes" className="btn btn-primary btn-sm">
                See Full Schedule <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid-2" style={{ gap: 14 }}>
              {liveClassesData.upcomingClasses.slice(0, 2).map((cls) => (
                <div key={cls.id} className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <Badge variant="purple">{cls.category}</Badge>
                      <span className="text-xs text-muted">{cls.dateLabel}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{cls.title}</div>
                    <p className="text-xs text-muted" style={{ marginTop: 4, lineHeight: 1.5 }}>{cls.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="text-xs" style={{ fontWeight: 600 }}>{cls.instructor.name} • {cls.timeLabel}</span>
                    <Link href="/live-classes" className="btn btn-secondary btn-sm">Reserve Free Seat →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Platform Benefits + Learner Reviews */}
      <section className={styles.sectionSpace}>
        <div className={styles.container}>
          <div className="grid-4" style={{ marginBottom: 42 }}>
            {homepageData.benefits.map((b) => (
              <div key={b.title} className="card card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{b.title}</div>
                <p className="text-xs text-muted" style={{ lineHeight: 1.55 }}>{b.desc}</p>
              </div>
            ))}
          </div>

          <PublicSectionHeader
            eyebrow="Learner Stories"
            title="Trusted by ambitious students targeting Band 7.0 to 8.5"
            subtitle="Consistent practice across simulations, lexis decks, and structured rubric drills."
          />

          <div className="grid-3">
            {homepageData.testimonials.map((t) => (
              <div key={t.name} data-animate="reveal" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <Badge variant="dark">{t.score}</Badge>
                  <Badge variant="success">{t.gain}</Badge>
                </div>
                <p className="text-sm" style={{ lineHeight: 1.65 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQs & Final CTA */}
      <section className={styles.sectionWarmBand}>
        <div className={styles.container}>
          <div className="grid-2" style={{ gap: 28, alignItems: 'start', marginBottom: 36 }}>
            <div>
              <PublicSectionHeader
                eyebrow="FAQ"
                title="Common questions before you start"
                subtitle="Everything you need to know about free account access, AI evaluation accuracy, and live sessions."
              />
              <Link href="/contact" className="btn btn-secondary btn-sm">
                Ask Our Team Directly →
              </Link>
            </div>
            <PublicFaqAccordion items={homepageData.faqs} />
          </div>

          <PublicCtaBanner
            badge="Free Account • Instant Access"
            title="Ready to turn IELTS preparation into clear daily momentum?"
            description="Create a free demo account or sign in to open your personalized Study Planner, full timed Simulations, Vocabulary Studio, and Writing/Speaking workspaces."
            primaryLabel="Enter Student Dashboard"
            primaryHref="/dashboard"
            secondaryLabel="Browse Live Free Classes"
            secondaryHref="/live-classes"
          />
        </div>
      </section>
    </div>
  );
}

