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
} from '@/components/frontend/PublicPrimitives';
import { HomeRoadmapSection } from '@/components/frontend/HomeRoadmapSection';
import { HomeOnePlatformSection } from '@/components/frontend/HomeOnePlatformSection';
import { HomeInsidePlatformSection } from '@/components/frontend/HomeInsidePlatformSection';
import { HomeStudyPlanSection } from '@/components/frontend/HomeStudyPlanSection';
import { HomeAiFeedbackSection } from '@/components/frontend/HomeAiFeedbackSection';
import { HomeTestimonialsCarousel } from '@/components/frontend/HomeTestimonialsCarousel';
import homepageData from '@/data/public/homepage.json';
import styles from '@/components/frontend/PublicLayout.module.css';
import homeStyles from './PublicHome.module.css';

export function PublicHomeView() {
  const rootRef = useGsapEntrance('public-home');

  return (
    <div ref={rootRef}>
      {/* 1. Main Hero Section */}
      <section className={`${styles.sectionSpace} ${homeStyles.publ_section_1}`} >
        <div className={styles.container}>
          <div className={homeStyles.mainHeroTransparent} data-animate="card">
            <div className={homeStyles.publ_div_2}>
              <div className={homeStyles.publ_div_3}>
                <span
                  className={homeStyles.publ_span_4}
                >
                  {homepageData.hero.eyebrow}
                </span>
                <span
                  className={homeStyles.publ_span_5}
                >
                  IELTS Academic Dedicated
                </span>
              </div>
              <h1 className={`hero-heading ${homeStyles.publ_h1_6}`} >
                Master IELTS Academic with <span className={homeStyles.publ_span_7}>AI-Powered Learning</span>
              </h1>
              <p className={`hero-desc ${homeStyles.publ_p_8}`} >
                {homepageData.hero.description}
              </p>
              <div className={homeStyles.publ_div_9}>
                <Link
                  href={homepageData.hero.primaryCta.href}
                  className={`btn btn-accent btn-lg ${homeStyles.publ_link_10}`}
                  
                >
                  {homepageData.hero.primaryCta.label} <ArrowRight size={16} />
                </Link>
                <Link href={homepageData.hero.secondaryCta.href} className={`btn btn-secondary btn-lg ${homeStyles.publ_link_11}`} >
                  {homepageData.hero.secondaryCta.label}
                </Link>
              </div>
              <div
                className={`supporting-text ${homeStyles.publ_div_12}`}
                
              >
                <Star size={15} className={homeStyles.publ_star_13} />
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
          <div className={`grid-4 ${homeStyles.publ_div_14}`} >
            {homepageData.hero.stats.map((st, idx) => (
              <div
                key={st.label}
                data-animate="card"
                className={`stat-card ${homeStyles.statHorizontal} ${homeStyles.publ_div_15}`}
                
              >
                <div
                  className={`${homeStyles.statIconBox} ${homeStyles.publ_div_16}`}
                  
                >
                  {idx === 0 && <Users size={22} />}
                  {idx === 1 && <ClipboardCheck size={22} />}
                  {idx === 2 && <BookOpen size={22} />}
                  {idx === 3 && <Star size={22} />}
                </div>
                <div className={homeStyles.statTextCol}>
                  <div
                    className={`${homeStyles.statValue} ${homeStyles.publ_div_17}`}
                    
                  >
                    {st.value}
                  </div>
                  <div
                    className={`${homeStyles.statLabel} ${homeStyles.publ_div_18}`}
                    
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
      <section className={`${styles.sectionWarmBand} ${homeStyles.publ_section_19}`} >
        <div className={styles.container}>
          <PublicSectionHeader
            eyebrow="Got Questions?"
            title={
              <span>
                Frequently Asked <span className={homeStyles.publ_span_7}>Questions</span>
              </span>
            }
            subtitle="Everything you need to know about preparing and succeeding with IELTS Ultimate."
            align="center"
          />
          <div className={homeStyles.publ_div_20}>
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
