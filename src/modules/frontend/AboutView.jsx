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
} from '@/components/frontend/PublicPrimitives';
import { AboutHeroVisual } from '@/components/frontend/HeroVisuals';
import aboutContactData from '@/data/public/about-contact.json';
import styles from '@/components/frontend/PublicLayout.module.css';

export function AboutView() {
  const rootRef = useGsapEntrance('about');
  const { about } = aboutContactData;

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className={`${styles.sectionSpace} ${styles.abou_section_1}`} >
        <div className={styles.container}>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className={styles.abou_span_2}>About</span>
          </nav>

          <div className={`card-warm ${styles.publicHeroGrid} ${styles.abou_div_3}`} data-animate="card" >
            <div className={styles.abou_div_4}>
              <Badge variant="yellow" className={styles.abou_badge_5}>{about.eyebrow}</Badge>
              <h1 className="hero-heading">{about.headline}</h1>
              <p className="hero-desc">{about.intro}</p>
              <div className={styles.abou_div_6}>
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

          <div className={`grid-4 ${styles.abou_div_7}`} >
            {about.metrics.map((m, i) => (
              <div key={m.label} className={i === 0 ? 'card-dark card-compact' : 'card card-compact'}>
                <div
                  className={i === 0 ? styles.statFeaturedValue : styles.statDefaultValue}
                >
                  {m.value}
                </div>
                <div className={`text-xs ${i === 0 ? styles.statFeaturedDesc : styles.statDefaultDesc}`}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision + Philosophy */}
      <section className={styles.sectionWarmBand}>
        <div className={`${styles.container} ${styles.abou_div_8}`} >
          <div className={`grid-2 ${styles.abou_div_9}`} >
            <div className={`card ${styles.abou_div_10}`} >
              <Badge variant="purple" className={styles.abou_badge_5}>Our Mission</Badge>
              <h2 className="h2">Clarity for every test taker</h2>
              <p className={`text-sm text-muted ${styles.abou_p_11}`} >{about.mission}</p>
            </div>
            <div className={`card ${styles.abou_div_10}`} >
              <Badge variant="yellow" className={styles.abou_badge_5}>Our Vision</Badge>
              <h2 className="h2">Measured readiness before exam day</h2>
              <p className={`text-sm text-muted ${styles.abou_p_11}`} >{about.vision}</p>
            </div>
          </div>

          <div>
            <PublicSectionHeader
              eyebrow="Learning Philosophy"
              title="Four principles shaping every exercise inside IELTS Ultimate"
            />
            <div className={`grid-2 ${styles.abou_div_12}`} >
              {about.philosophy.map((p) => (
                <div key={p.title} className={`card card-compact ${styles.abou_div_13}`} >
                  <Sparkles size={18} className={styles.abou_sparkles_14} />
                  <div>
                    <div className={styles.abou_div_15}>{p.title}</div>
                    <p className={`text-xs text-muted ${styles.abou_p_16}`} >{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why IELTS Ultimate + Team */}
      <section className={styles.sectionSpace}>
        <div className={`${styles.container} ${styles.abou_div_17}`} >
          <div>
            <PublicSectionHeader
              eyebrow="Why Choose IELTS Ultimate"
              title="Built for ambitious schedules and real band improvements"
            />
            <div className="grid-3">
              {about.reasons.map((r) => (
                <div key={r.title} className={`card card-compact ${styles.abou_div_18}`} >
                  <CheckCircle2 size={18} className={styles.abou_checkcircle2_19} />
                  <h3 className="h3">{r.title}</h3>
                  <p className={`text-xs text-muted ${styles.abou_p_20}`} >{r.desc}</p>
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
            <div className={`grid-2 ${styles.abou_div_9}`} >
              {about.team.map((member) => (
                <div key={member.id} className={`card ${styles.abou_div_21}`} >
                  <SafeAvatar src={member.avatar} name={member.name} size={56} radius="14px" />
                  <div className={styles.abou_div_22}>
                    <div className={styles.abou_div_23}>{member.name}</div>
                    <div className={`text-xs ${styles.abou_div_24}`} >
                      {member.role}
                    </div>
                    <div className={styles.abou_div_25}>
                      <Badge variant="neutral">{member.credentials}</Badge>
                    </div>
                    <p className={`text-xs text-muted ${styles.abou_p_20}`} >{member.bio}</p>
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

