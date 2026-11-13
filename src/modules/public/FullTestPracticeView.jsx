'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Calculator,
  RotateCcw,
  BookOpen,
  Award,
  Monitor,
  Zap,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import guideData from '@/data/public/full-test-guide.json';
import mockTestsData from '@/data/tests/mock-tests.json';
import styles from './FullTestPractice.module.css';

export function FullTestPracticeView() {
  const router = useRouter();
  const app = useApp?.() || {};
  const auth = app.auth || { isAuthenticated: false };
  const rootRef = useGsapEntrance('full-test-practice');

  // Sticky TOC Active Section Tracker
  const [activeTocId, setActiveTocId] = useState('overview');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Band Calculator State
  const [calcScores, setCalcScores] = useState({
    listening: 7.0,
    reading: 7.0,
    writing: 6.5,
    speaking: 6.5,
  });

  // Calculate official rounded IELTS composite band
  const calculatedResult = useMemo(() => {
    const { listening, reading, writing, speaking } = calcScores;
    const rawAverage = (listening + reading + writing + speaking) / 4;
    const integerPart = Math.floor(rawAverage);
    const fraction = rawAverage - integerPart;

    let roundedBand = integerPart;
    if (fraction < 0.25) {
      roundedBand = integerPart;
    } else if (fraction < 0.75) {
      roundedBand = integerPart + 0.5;
    } else {
      roundedBand = integerPart + 1.0;
    }

    return {
      rawAverage: rawAverage.toFixed(3),
      roundedBand: roundedBand.toFixed(1),
    };
  }, [calcScores]);

  // Track scroll position for TOC spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = guideData.tableOfContents.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveTocId(guideData.tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePracticeCta = (e) => {
    e.preventDefault();
    if (auth.isAuthenticated) {
      router.push('/mock-test');
    } else {
      router.push('/login?next=/mock-test');
    }
  };

  const bandOptions = [
    4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0,
  ];

  return (
    <div ref={rootRef} className={styles.container}>
      {/* 1. Transparent Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.sectionBadge}>
              <Layers size={14} />
              <span>{guideData.hero.badge}</span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 800,
                lineHeight: 1.15,
                margin: '12px 0 16px',
                color: 'var(--text-primary)',
              }}
            >
              {guideData.hero.title}
            </h1>
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                marginBottom: '24px',
              }}
            >
              {guideData.hero.subtitle}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
              <button
                type="button"
                onClick={handlePracticeCta}
                className="btn btn-primary"
                style={{ borderRadius: 0, padding: '12px 24px', fontWeight: 700 }}
              >
                <span>Take Full Simulation Exam</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={handlePracticeCta}
                className="btn btn-secondary"
                style={{ borderRadius: 0, padding: '12px 20px', fontWeight: 600 }}
              >
                <span>Explore Mock Library</span>
                <BookOpen size={16} />
              </button>
            </div>

            {/* Hero Quick Stat Badges */}
            <div className={styles.heroPillList}>
              {guideData.hero.stats.map((stat, idx) => (
                <div key={idx} className={styles.heroPill}>
                  <CheckCircle2 size={13} color="var(--primary)" />
                  <span>
                    <strong>{stat.value}</strong> — {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Card */}
          <div className={styles.heroVisualBox}>
            <div className={styles.heroVisualHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                <Monitor size={16} color="var(--primary)" />
                <span>Computer-Delivered Exam Simulation</span>
              </div>
              <span className="badge badge-purple" style={{ borderRadius: 0 }}>
                Live Time Clock
              </span>
            </div>

            <div style={{ border: '1px solid var(--border)', background: '#ffffff', padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                <span>Academic Mock #01 • Environmental Futures</span>
                <span style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} />
                  02:39:45
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                <div style={{ padding: '6px 8px', background: 'rgba(136, 103, 184, 0.1)', border: '1px solid var(--primary)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)' }}>LISTENING</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>30 min</div>
                </div>
                <div style={{ padding: '6px 8px', background: '#fafafa', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>READING</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>60 min</div>
                </div>
                <div style={{ padding: '6px 8px', background: '#fafafa', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>WRITING</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>60 min</div>
                </div>
                <div style={{ padding: '6px 8px', background: '#fafafa', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>SPEAKING</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>14 min</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Predicted Overall Band</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>7.5</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>C1 Advanced Level</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Candidate Accuracy</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>86.4%</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>1,420 Completed Sittings</div>
              </div>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Full computer test session adheres to official IDP and British Council timing protocols
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content + Sticky TOC Layout */}
      <div className={styles.contentLayout}>
        <div className={styles.mainColumn}>
          {/* Section: Overview */}
          <section id="overview" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <BookOpen size={14} />
                <span>Simulation Protocol</span>
              </div>
              <h2 className={styles.sectionTitle}>IELTS Computer-Delivered Exam Overview</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              {guideData.overview.summary}
            </p>

            <div className={styles.cardGrid}>
              {guideData.overview.keyFeatures.map((f, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--primary)' }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Skills Timeline */}
          <section id="skills-timeline" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Clock size={14} />
                <span>Continuous Session</span>
              </div>
              <h2 className={styles.sectionTitle}>Complete 4-Skill Exam Timeline</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {guideData.skillsTimeline.map((item, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {item.skill}
                    </h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className="badge badge-purple" style={{ borderRadius: 0 }}>
                        {item.duration}
                      </span>
                      <span className="badge badge-yellow" style={{ borderRadius: 0 }}>
                        {item.questions}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {item.format}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Band Calculator & Interactive Widget */}
          <section id="band-calculator" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Calculator size={14} />
                <span>Official Scoring Rules</span>
              </div>
              <h2 className={styles.sectionTitle}>IELTS Band Score Calculator</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              IELTS Overall Band scores are calculated by taking the arithmetic mean of all 4 modules and rounding to the nearest half or whole band according to strict official rules.
            </p>

            {/* Live Interactive Calculator Box */}
            <div className={styles.calcCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                  Interactive Composite Band Calculator
                </h3>
                <span className="badge badge-yellow" style={{ borderRadius: 0 }}>
                  Official Rounding Algorithm
                </span>
              </div>

              <div className={styles.calcInputsGrid}>
                <div className={styles.calcInputGroup}>
                  <label htmlFor="calc-listening">Listening Band</label>
                  <select
                    id="calc-listening"
                    className={styles.calcSelect}
                    value={calcScores.listening}
                    onChange={(e) => setCalcScores({ ...calcScores, listening: parseFloat(e.target.value) })}
                  >
                    {bandOptions.map((b) => (
                      <option key={b} value={b}>Band {b.toFixed(1)}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.calcInputGroup}>
                  <label htmlFor="calc-reading">Reading Band</label>
                  <select
                    id="calc-reading"
                    className={styles.calcSelect}
                    value={calcScores.reading}
                    onChange={(e) => setCalcScores({ ...calcScores, reading: parseFloat(e.target.value) })}
                  >
                    {bandOptions.map((b) => (
                      <option key={b} value={b}>Band {b.toFixed(1)}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.calcInputGroup}>
                  <label htmlFor="calc-writing">Writing Band</label>
                  <select
                    id="calc-writing"
                    className={styles.calcSelect}
                    value={calcScores.writing}
                    onChange={(e) => setCalcScores({ ...calcScores, writing: parseFloat(e.target.value) })}
                  >
                    {bandOptions.map((b) => (
                      <option key={b} value={b}>Band {b.toFixed(1)}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.calcInputGroup}>
                  <label htmlFor="calc-speaking">Speaking Band</label>
                  <select
                    id="calc-speaking"
                    className={styles.calcSelect}
                    value={calcScores.speaking}
                    onChange={(e) => setCalcScores({ ...calcScores, speaking: parseFloat(e.target.value) })}
                  >
                    {bandOptions.map((b) => (
                      <option key={b} value={b}>Band {b.toFixed(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calculator Output */}
              <div className={styles.calcResultBox}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Arithmetic Mean</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>{calculatedResult.rawAverage}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>Official IELTS Result</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Rounded by examination standards</div>
                  </div>
                  <div
                    style={{
                      background: 'var(--primary)',
                      color: '#ffffff',
                      padding: '8px 18px',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                    }}
                  >
                    Band {calculatedResult.roundedBand}
                  </div>
                </div>
              </div>
            </div>

            {/* Rounding Rules Table */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 12 }}>Official Rounding Rules Table</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {guideData.bandCalculation.roundingRules.map((r, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)', padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>{r.rule}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Example: {r.example}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Interface Features */}
          <section id="interface-features" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Monitor size={14} />
                <span>Test Centre Parity</span>
              </div>
              <h2 className={styles.sectionTitle}>{guideData.tableOfContents[3].title}</h2>
            </div>

            <div className={styles.cardGrid}>
              {guideData.interfaceFeatures.map((f, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--primary)' }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Stamina Tips */}
          <section id="stamina-tips" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Flame size={14} />
                <span>Exam Endurance</span>
              </div>
              <h2 className={styles.sectionTitle}>{guideData.tableOfContents[4].title}</h2>
            </div>

            <div className={styles.cardGrid}>
              {guideData.staminaTips.map((tip, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--primary)' }}>
                    {tip.tip}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {tip.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Mock Library Preview */}
          <section id="mock-library" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <ShieldCheck size={14} />
                <span>Protected Student Workspace</span>
              </div>
              <h2 className={styles.sectionTitle}>Available Full Mock Tests Library</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              Select from {mockTestsData.length} complete academic and general training mock exams. Experience real-time timing, auto-marking, and full diagnostic feedback.
            </p>

            <div className={styles.cardGrid}>
              {mockTestsData.slice(0, 4).map((test) => (
                <div key={test.id} className={styles.infoCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-purple" style={{ borderRadius: 0 }}>
                      {test.track}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {test.durationLabel}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: '4px 0' }}>
                    {test.title}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {test.sectionsSummary}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Difficulty: <strong>{test.difficulty}</strong> • {test.attempts} candidates tested
                  </div>
                  <button
                    type="button"
                    onClick={handlePracticeCta}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: 0, marginTop: 'auto', justifyContent: 'center' }}
                  >
                    <span>Launch This Mock</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Practice CTA Box */}
            <div className={styles.ctaBox}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Ready to Experience the Full 2h 40m Exam?
              </h3>
              <p style={{ maxWidth: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Access our full library of 10+ authentic computer-delivered mock tests, full 4-skill timing, and instant overall band prediction.
              </p>
              <button
                type="button"
                onClick={handlePracticeCta}
                className="btn btn-primary"
                style={{ borderRadius: 0, padding: '14px 28px', fontWeight: 700 }}
              >
                <span>Enter Mock Test Workspace</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* Section: FAQs */}
          <section id="faqs" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <HelpCircle size={14} />
                <span>Clarifications</span>
              </div>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {guideData.faqs.map((faq, idx) => (
                <div key={idx} className={styles.faqItem}>
                  <button
                    type="button"
                    className={styles.faqButton}
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.16s ease',
                      }}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className={styles.faqContent}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Table of Contents (Desktop) */}
        <aside className={styles.tocColumn}>
          <div className={styles.tocCard}>
            <div className={styles.tocTitle}>Full Exam Navigation</div>
            <nav className={styles.tocList}>
              {guideData.tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`${styles.tocItem} ${activeTocId === item.id ? styles.tocItemActive : ''}`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={handlePracticeCta}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: 0, marginTop: 12, justifyContent: 'center' }}
            >
              <span>Take Full Test</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

