'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { Badge } from '@/components/common/UiPrimitives';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import {
  PublicSectionHeader,
  PublicCtaBanner,
} from '@/components/public/PublicPrimitives';
import { AboutHeroVisual } from '@/components/public/HeroVisuals';
import aboutContactData from '@/data/public/about-contact.json';
import styles from '@/components/public/PublicLayout.module.css';

export function AboutView() {
  const rootRef = useGsapEntrance('about');
  const { about } = aboutContactData;

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className={styles.sectionSpace} style={{ paddingTop: 32, paddingBottom: 36 }}>
        <div className={styles.container}>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>About</span>
          </nav>

          <div className={`card-warm ${styles.publicHeroGrid}`} data-animate="card" style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Badge variant="yellow" style={{ alignSelf: 'flex-start' }}>{about.eyebrow}</Badge>
              <h1 className="hero-heading">{about.headline}</h1>
              <p className="hero-desc">{about.intro}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                <Link href="/dashboard" className="btn btn-primary btn-lg">
                  Explore Student Workspace <ArrowRight size={16} />
                </Link>
                <Link href="/live-classes" className="btn btn-secondary btn-lg">
                  Join a Free Live Class
                </Link>
              </div>
            </div>

            <AboutHeroVisual />
          </div>

          <div className="grid-4" style={{ marginTop: 18 }}>
            {about.metrics.map((m, i) => (
              <div key={m.label} className={i === 0 ? 'card-dark card-compact' : 'card card-compact'}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.55rem',
                    color: i === 0 ? 'var(--accent-yellow)' : 'var(--text-primary)',
                  }}
                >
                  {m.value}
                </div>
                <div className="text-xs" style={{ color: i === 0 ? '#B7B5AD' : 'var(--text-secondary)', marginTop: 2 }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision + Philosophy */}
      <section className={styles.sectionWarmBand}>
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <div className="grid-2" style={{ gap: 18 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Badge variant="purple" style={{ alignSelf: 'flex-start' }}>Our Mission</Badge>
              <h2 className="h2">Clarity for every test taker</h2>
              <p className="text-sm text-muted" style={{ lineHeight: 1.65 }}>{about.mission}</p>
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Badge variant="yellow" style={{ alignSelf: 'flex-start' }}>Our Vision</Badge>
              <h2 className="h2">Measured readiness before exam day</h2>
              <p className="text-sm text-muted" style={{ lineHeight: 1.65 }}>{about.vision}</p>
            </div>
          </div>

          <div>
            <PublicSectionHeader
              eyebrow="Learning Philosophy"
              title="Four principles shaping every exercise inside IELTS Ultimate"
            />
            <div className="grid-2" style={{ gap: 16 }}>
              {about.philosophy.map((p) => (
                <div key={p.title} className="card card-compact" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Sparkles size={18} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{p.title}</div>
                    <p className="text-xs text-muted" style={{ marginTop: 4, lineHeight: 1.55 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why IELTS Ultimate + Team */}
      <section className={styles.sectionSpace}>
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div>
            <PublicSectionHeader
              eyebrow="Why Choose IELTS Ultimate"
              title="Built for ambitious schedules and real band improvements"
            />
            <div className="grid-3">
              {about.reasons.map((r) => (
                <div key={r.title} className="card card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                  <h3 className="h3">{r.title}</h3>
                  <p className="text-xs text-muted" style={{ lineHeight: 1.55 }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <PublicSectionHeader
              eyebrow="Educators & Curriculum Designers"
              title="The teaching team guiding our rubrics and live classes"
              subtitle="University lecturers, exam specialists, and scholarship mentors who work hands-on with candidates every week."
            />
            <div className="grid-2" style={{ gap: 18 }}>
              {about.team.map((member) => (
                <div key={member.id} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <SafeAvatar src={member.avatar} name={member.name} size={56} radius="14px" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{member.name}</div>
                    <div className="text-xs" style={{ color: 'var(--accent-purple)', fontWeight: 600, marginTop: 2 }}>
                      {member.role}
                    </div>
                    <div style={{ marginTop: 6, marginBottom: 8 }}>
                      <Badge variant="neutral">{member.credentials}</Badge>
                    </div>
                    <p className="text-xs text-muted" style={{ lineHeight: 1.55 }}>{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <PublicCtaBanner
            badge="Ready to Begin?"
            title="Start practicing with a free account today"
            description="Explore your IELTS Study Planner, sit full mock tests, or join our next live clinic session."
            primaryLabel="Create Free Account"
            primaryHref="/login?mode=signup"
            secondaryLabel="Contact Our Team"
            secondaryHref="/contact"
          />
        </div>
      </section>
    </div>
  );
}

