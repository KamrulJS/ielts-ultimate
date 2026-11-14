'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Star,
  Users,
  ClipboardCheck,
  BookOpen,
} from 'lucide-react';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import {
  PublicSectionHeader,
  PublicFaqAccordion,
  PublicCtaBanner,
} from '@/components/public/PublicPrimitives';
import { HomeRoadmapSection } from '@/components/public/HomeRoadmapSection';
import { HomeOnePlatformSection } from '@/components/public/HomeOnePlatformSection';
import { HomeInsidePlatformSection } from '@/components/public/HomeInsidePlatformSection';
import { HomeStudyPlanSection } from '@/components/public/HomeStudyPlanSection';
import { HomeAiFeedbackSection } from '@/components/public/HomeAiFeedbackSection';
import { HomeTestimonialsCarousel } from '@/components/public/HomeTestimonialsCarousel';
import homepageData from '@/data/public/homepage.json';
import styles from '@/components/public/PublicLayout.module.css';
import homeStyles from './PublicHome.module.css';

export function PublicHomeView() {
  const rootRef = useGsapEntrance('public-home');

  return (
    <div ref={rootRef}>
      {/* 1. Main Hero Section */}
      <section className={styles.sectionSpace} style={{ paddingTop: 20, paddingBottom: 36 }}>
        <div className={styles.container}>
          <div className={homeStyles.mainHeroTransparent} data-animate="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#FEF6DD',
                    color: '#8A6100',
                    border: '1px solid rgba(246, 189, 40, 0.4)',
                    borderRadius: 0,
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {homepageData.hero.eyebrow}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#F1E8FF',
                    color: '#8867B8',
                    border: '1px solid rgba(136, 103, 184, 0.25)',
                    borderRadius: 0,
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  IELTS Academic Dedicated
                </span>
              </div>
              <h1 className="hero-heading" style={{ fontSize: 'clamp(1.95rem, 3.1vw, 2.75rem)', lineHeight: 1.18 }}>
                Master IELTS Academic with <span style={{ color: '#8867B8' }}>AI-Powered Learning</span>
              </h1>
              <p className="hero-desc" style={{ fontSize: '1.02rem', lineHeight: 1.6, maxWidth: 560 }}>
                {homepageData.hero.description}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                <Link
                  href={homepageData.hero.primaryCta.href}
                  className="btn btn-accent btn-lg"
                  style={{
                    borderRadius: 0,
                    backgroundColor: '#F6BD28',
                    color: '#202020',
                    border: '1px solid #E5AC1A',
                    fontWeight: 700,
                  }}
                >
                  {homepageData.hero.primaryCta.label} <ArrowRight size={16} />
                </Link>
                <Link href={homepageData.hero.secondaryCta.href} className="btn btn-secondary btn-lg" style={{ borderRadius: 0 }}>
                  {homepageData.hero.secondaryCta.label}
                </Link>
              </div>
              <div
                className="supporting-text"
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}
              >
                <Star size={15} style={{ flexShrink: 0, color: '#F6BD28', fill: '#F6BD28' }} />
                <span>{homepageData.hero.trustNote}</span>
              </div>
            </div>

            <div className={homeStyles.heroVisualCol} data-animate="reveal">
              <Image
                src="/images/hero/IELTS Ultimate AI Learning.png"
                alt="IELTS Ultimate AI Learning workspace and preparation ecosystem"
                width={720}
                height={480}
                priority
                className={homeStyles.heroTransparentImg}
              />
            </div>
          </div>

          {/* Metrics Strip — 4 Consistent Light Cards with Unique Relevant Icons */}
          <div className="grid-4" style={{ marginTop: 28 }}>
            {homepageData.hero.stats.map((st, idx) => (
              <div
                key={st.label}
                data-animate="card"
                className={`stat-card ${homeStyles.statHorizontal}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: 0,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
              >
                <div
                  className={homeStyles.statIconBox}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 0,
                    backgroundColor: '#FEF6DD',
                    border: '1px solid rgba(246, 189, 40, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#202020',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {idx === 0 && <Users size={22} />}
                  {idx === 1 && <ClipboardCheck size={22} />}
                  {idx === 2 && <BookOpen size={22} />}
                  {idx === 3 && <Star size={22} />}
                </div>
                <div className={homeStyles.statTextCol}>
                  <div
                    className={homeStyles.statValue}
                    style={{ color: '#8867B8', fontSize: '1.4rem', fontWeight: 800 }}
                  >
                    {st.value}
                  </div>
                  <div
                    className={homeStyles.statLabel}
                    style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500 }}
                  >
                    {st.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Section Two — IELTS Learning Roadmap (Screenshot 01) */}
      <HomeRoadmapSection />

      {/* 3. Section Three — One Platform. All Your IELTS Needs (Screenshot 02) */}
      <HomeOnePlatformSection />

      {/* 4. Section Four — Inside the Platform (Screenshot 03) */}
      <HomeInsidePlatformSection />

      {/* 5. Section Five — Smart Study Plan */}
      <HomeStudyPlanSection />

      {/* 6. Section Six — AI-Powered Feedback (Screenshot 04) */}
      <HomeAiFeedbackSection />

      {/* 7. Section Seven — Student Reviews Carousel */}
      <section className={styles.sectionSpace}>
        <div className={styles.container}>
          <HomeTestimonialsCarousel testimonials={homepageData.testimonials} />
        </div>
      </section>

      {/* 8. Section Eight — FAQs & Final CTA */}
      <section className={styles.sectionWarmBand} style={{ borderTop: '1px solid var(--border)', backgroundColor: '#FAF9F5' }}>
        <div className={styles.container}>
          <PublicSectionHeader
            eyebrow="Got Questions?"
            title={
              <span>
                Frequently Asked <span style={{ color: '#8867B8' }}>Questions</span>
              </span>
            }
            subtitle="Everything you need to know about preparing and succeeding with IELTS Ultimate."
            align="center"
          />
          <div style={{ maxWidth: 840, margin: '0 auto 48px' }}>
            <PublicFaqAccordion items={homepageData.faqs} />
          </div>

          <PublicCtaBanner
            badge="Start Free Today"
            title="Your IELTS target band is closer than you think."
            description="Take your diagnostic simulation, get instant AI examiner feedback, and follow your adaptive daily study plan with IELTS Ultimate."
            primaryLabel="Start Free Diagnostic"
            primaryHref="/login?mode=signup"
            secondaryLabel="Explore Pricing Plans"
            secondaryHref="/pricing"
          />
        </div>
      </section>
    </div>
  );
}
