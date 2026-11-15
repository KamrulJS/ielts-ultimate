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
              className={styles.full_h1_1}
            >
              {guideData.hero.title}
            </h1>
            <p
              className={styles.full_p_2}
            >
              {guideData.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className={styles.full_div_3}>
              <button
                type="button"
                onClick={handlePracticeCta}
                className={`btn btn-primary ${styles.full_button_4}`}
                
              >
                <span>Take Full Simulation Exam</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={handlePracticeCta}
                className={`btn btn-secondary ${styles.full_button_5}`}
                
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
              <div className={styles.full_div_6}>
                <Monitor size={16} color="var(--primary)" />
                <span>Computer-Delivered Exam Simulation</span>
              </div>
              <span className={`badge badge-purple ${styles.full_span_7}`} >
                Live Time Clock
              </span>
            </div>

            <div className={styles.full_div_8}>
              <div className={styles.full_div_9}>
                <span>Academic Mock #01 • Environmental Futures</span>
                <span className={styles.full_span_10}>
                  <Clock size={12} />
                  02:39:45
                </span>
              </div>
              <div className={styles.full_div_11}>
                <div className={styles.full_div_12}>
                  <div className={styles.full_div_13}>LISTENING</div>
                  <div className={styles.full_div_14}>30 min</div>
                </div>
                <div className={styles.full_div_15}>
                  <div className={styles.full_div_16}>READING</div>
                  <div className={styles.full_div_14}>60 min</div>
                </div>
                <div className={styles.full_div_15}>
                  <div className={styles.full_div_16}>WRITING</div>
                  <div className={styles.full_div_14}>60 min</div>
                </div>
                <div className={styles.full_div_15}>
                  <div className={styles.full_div_16}>SPEAKING</div>
                  <div className={styles.full_div_14}>14 min</div>
                </div>
              </div>
            </div>

            <div className={styles.full_div_17}>
              <div className={styles.full_div_18}>
                <div className={styles.full_div_19}>Predicted Overall Band</div>
                <div className={styles.full_div_20}>7.5</div>
                <div className={styles.full_div_21}>C1 Advanced Level</div>
              </div>
              <div className={styles.full_div_18}>
                <div className={styles.full_div_19}>Candidate Accuracy</div>
                <div className={styles.full_div_20}>86.4%</div>
                <div className={styles.full_div_21}>1,420 Completed Sittings</div>
              </div>
            </div>

            <div className={styles.full_div_22}>
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
            <p className={styles.full_p_23}>
              {guideData.overview.summary}
            </p>

            <div className={styles.cardGrid}>
              {guideData.overview.keyFeatures.map((f, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.full_div_24}>
                    {f.title}
                  </div>
                  <div className={styles.full_div_25}>
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

            <div className={styles.full_div_26}>
              {guideData.skillsTimeline.map((item, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.full_div_27}>
                    <h3 className={styles.full_h3_28}>
                      {item.skill}
                    </h3>
                    <div className={styles.full_div_29}>
                      <span className={`badge badge-purple ${styles.full_span_7}`} >
                        {item.duration}
                      </span>
                      <span className={`badge badge-yellow ${styles.full_span_7}`} >
                        {item.questions}
                      </span>
                    </div>
                  </div>
                  <div className={styles.full_div_25}>
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
            <p className={styles.full_p_23}>
              IELTS Overall Band scores are calculated by taking the arithmetic mean of all 4 modules and rounding to the nearest half or whole band according to strict official rules.
            </p>

            {/* Live Interactive Calculator Box */}
            <div className={styles.calcCard}>
              <div className={styles.full_div_30}>
                <h3 className={styles.full_h3_31}>
                  Interactive Composite Band Calculator
                </h3>
                <span className={`badge badge-yellow ${styles.full_span_7}`} >
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
                  <div className={styles.full_div_32}>Arithmetic Mean</div>
                  <div className={styles.full_div_33}>{calculatedResult.rawAverage}</div>
                </div>
                <div className={styles.full_div_34}>
                  <div className={styles.full_div_35}>
                    <div className={styles.full_div_36}>Official IELTS Result</div>
                    <div className={styles.full_div_37}>Rounded by examination standards</div>
                  </div>
                  <div
                    className={styles.full_div_38}
                  >
                    Band {calculatedResult.roundedBand}
                  </div>
                </div>
              </div>
            </div>

            {/* Rounding Rules Table */}
            <h3 className={styles.full_h3_39}>Official Rounding Rules Table</h3>
            <div className={styles.full_div_40}>
              {guideData.bandCalculation.roundingRules.map((r, idx) => (
                <div key={idx} className={styles.full_div_41}>
                  <div className={styles.full_div_42}>{r.rule}</div>
                  <div className={styles.full_div_43}>
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
                  <div className={styles.full_div_24}>
                    {f.title}
                  </div>
                  <div className={styles.full_div_25}>
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
                  <div className={styles.full_div_24}>
                    {tip.tip}
                  </div>
                  <div className={styles.full_div_25}>
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
            <p className={styles.full_p_23}>
              Select from {mockTestsData.length} complete IELTS Academic mock exams. Experience real-time timing, auto-marking, and full diagnostic feedback.
            </p>

            <div className={styles.cardGrid}>
              {mockTestsData.slice(0, 4).map((test) => (
                <div key={test.id} className={styles.infoCard}>
                  <div className={styles.full_div_30}>
                    <span className={`badge badge-purple ${styles.full_span_7}`} >
                      {test.track}
                    </span>
                    <span className={styles.full_span_44}>
                      {test.durationLabel}
                    </span>
                  </div>
                  <h4 className={styles.full_h4_45}>
                    {test.title}
                  </h4>
                  <div className={styles.full_div_46}>
                    {test.sectionsSummary}
                  </div>
                  <div className={styles.full_span_44}>
                    Difficulty: <strong>{test.difficulty}</strong> • {test.attempts} candidates tested
                  </div>
                  <button
                    type="button"
                    onClick={handlePracticeCta}
                    className={`btn btn-secondary btn-sm ${styles.full_button_47}`}
                    
                  >
                    <span>Launch This Mock</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Practice CTA Box */}
            <div className={styles.ctaBox}>
              <h3 className={styles.full_h3_48}>
                Ready to Experience the Full 2h 40m Exam?
              </h3>
              <p className={styles.full_p_49}>
                Access our full library of 10+ authentic computer-delivered mock tests, full 4-skill timing, and instant overall band prediction.
              </p>
              <button
                type="button"
                onClick={handlePracticeCta}
                className={`btn btn-primary ${styles.full_button_50}`}
                
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

            <div className={styles.full_div_51}>
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
                      className={`${styles.faqChevronIcon} ${openFaq === idx ? styles.faqChevronIconOpen : ""}`}
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
              className={`btn btn-primary btn-sm ${styles.full_button_52}`}
              
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

