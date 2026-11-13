'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Check,
  X,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  Volume2,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import guideData from '@/data/public/speaking-guide.json';
import speakingTopics from '@/data/speaking/topics.json';
import styles from './SpeakingPractice.module.css';

export function SpeakingPracticeView() {
  const router = useRouter();
  const app = useApp?.() || {};
  const auth = app.auth || { isAuthenticated: false };
  const rootRef = useGsapEntrance('speaking-practice');

  // Sticky TOC Active Section Tracker
  const [activeTocId, setActiveTocId] = useState('overview');

  // Interactive Quiz Answers
  const [selectedDrills, setSelectedDrills] = useState({});
  const [checkedDrills, setCheckedDrills] = useState({});

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

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
      router.push('/speaking');
    } else {
      router.push('/login?next=/speaking');
    }
  };

  const handleSelectDrill = (drillId, optionId) => {
    setSelectedDrills((prev) => ({ ...prev, [drillId]: optionId }));
    setCheckedDrills((prev) => ({ ...prev, [drillId]: true }));
  };

  const handleResetDrill = (drillId) => {
    setSelectedDrills((prev) => ({ ...prev, [drillId]: null }));
    setCheckedDrills((prev) => ({ ...prev, [drillId]: false }));
  };

  return (
    <div ref={rootRef} className={styles.container}>
      {/* 1. Transparent Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.sectionBadge}>
              <Mic size={14} />
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
                <span>Start Speaking Simulator</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={handlePracticeCta}
                className="btn btn-secondary"
                style={{ borderRadius: 0, padding: '12px 20px', fontWeight: 600 }}
              >
                <span>Try AI Speaking Examiner</span>
                <Sparkles size={16} />
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
                <Zap size={16} color="var(--primary)" />
                <span>AI Speech Whisper Evaluation</span>
              </div>
              <span className="badge badge-purple" style={{ borderRadius: 0 }}>
                Live Audio Analysis
              </span>
            </div>

            <div style={{ border: '1px solid var(--border)', background: '#ffffff', padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>Part 2 Cue Card • Audio Transcript</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>124 WPM • High Fluency</span>
              </div>
              <div
                style={{
                  fontSize: '0.86rem',
                  lineHeight: 1.55,
                  color: 'var(--text-primary)',
                  fontStyle: 'italic',
                  borderLeft: '3px solid var(--primary)',
                  paddingLeft: 10,
                }}
              >
                &ldquo;I would like to talk about the National Maritime Museum in Greenwich, which I had the pleasure of visiting during an educational excursion last autumn...&rdquo;
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Fluency &amp; Coherence</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>8.0</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Natural discourse pace</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lexical Resource</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>8.5</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Precise collocations</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Grammatical Range</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>7.5</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Complex past tenses</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pronunciation</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>8.0</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Clear intonation contours</div>
              </div>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Instant transcription via OpenAI Whisper with syllable stress detection
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
                <span>Test Format</span>
              </div>
              <h2 className={styles.sectionTitle}>IELTS Speaking Overview &amp; Key Facts</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              {guideData.overview.summary}
            </p>

            <div className={styles.cardGrid}>
              {guideData.overview.keyFacts.map((f, idx) => (
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

          {/* Section: 3 Parts Breakdown */}
          <section id="three-parts" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Layers size={14} />
                <span>Section Breakdown</span>
              </div>
              <h2 className={styles.sectionTitle}>Detailed Breakdown of Parts 1, 2 &amp; 3</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {guideData.threeParts.map((part, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {part.part}
                    </h3>
                    <span className="badge badge-purple" style={{ borderRadius: 0 }}>
                      {part.duration}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    <strong>Focus:</strong> {part.focus}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    <strong>Objective:</strong> {part.objective}
                  </div>
                  <div
                    style={{
                      borderLeft: '3px solid var(--accent-yellow)',
                      background: 'rgba(234, 179, 8, 0.08)',
                      padding: '10px 14px',
                      fontSize: '0.84rem',
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    <strong>Master Strategy:</strong> {part.bestStrategy}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: 4 Official Criteria */}
          <section id="assessment-criteria" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Award size={14} />
                <span>Official Rubrics</span>
              </div>
              <h2 className={styles.sectionTitle}>The 4 Official Assessment Criteria</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              Examiners listen for four specific competencies, each contributing exactly 25% towards your speaking score.
            </p>

            <div className={styles.cardGrid}>
              {guideData.assessmentCriteria.map((c, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-purple" style={{ borderRadius: 0, fontWeight: 700 }}>
                      {c.code}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {c.weight}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0 0' }}>{c.name}</h3>
                  <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {c.description}
                  </p>
                  <div
                    style={{
                      marginTop: 'auto',
                      padding: '10px 12px',
                      background: 'rgba(136, 103, 184, 0.06)',
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                      borderLeft: '3px solid var(--primary)',
                    }}
                  >
                    <strong>Band 9 Benchmark:</strong> {c.band9Benchmark}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Part 2 Strategy */}
          <section id="part2-strategy" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Clock size={14} />
                <span>Cue Card Mastery</span>
              </div>
              <h2 className={styles.sectionTitle}>{guideData.part2Strategy.title}</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              {guideData.part2Strategy.advice}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {guideData.part2Strategy.steps.map((st, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)', padding: '14px 18px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--primary)' }}>
                    {st.step}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.55 }}>
                    {st.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Part 3 PEEC Framework */}
          <section id="part3-framework" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <MessageSquare size={14} />
                <span>Abstract Reasoning</span>
              </div>
              <h2 className={styles.sectionTitle}>{guideData.part3Framework.title}</h2>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>
              Formula: {guideData.part3Framework.formula}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {guideData.part3Framework.steps.map((item, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        background: 'var(--primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                      }}
                    >
                      {item.letter}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</span>
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                      background: 'rgba(136, 103, 184, 0.04)',
                      padding: '10px 14px',
                      borderLeft: '3px solid var(--primary)',
                    }}
                  >
                    &ldquo;{item.example}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Pronunciation Guide */}
          <section id="pronunciation-guide" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Volume2 size={14} />
                <span>Phonology Essentials</span>
              </div>
              <h2 className={styles.sectionTitle}>{guideData.pronunciationGuide.title}</h2>
            </div>
            <div
              style={{
                border: '1px solid #10b981',
                background: 'rgba(16, 185, 129, 0.06)',
                padding: '14px 18px',
                fontSize: '0.88rem',
                lineHeight: 1.55,
              }}
            >
              <strong>Truth from Official Examiners:</strong> {guideData.pronunciationGuide.truth}
            </div>

            <div className={styles.cardGrid}>
              {guideData.pronunciationGuide.pillars.map((p, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--primary)' }}>
                    {p.feature}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {p.rule}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Band Descriptors */}
          <section id="band-descriptors" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Award size={14} />
                <span>Rubric Matrices</span>
              </div>
              <h2 className={styles.sectionTitle}>IELTS Speaking Band Descriptors</h2>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.customTable}>
                <thead>
                  <tr>
                    <th>Band</th>
                    <th>Fluency &amp; Coherence</th>
                    <th>Lexical Resource</th>
                    <th>Grammar Accuracy</th>
                    <th>Pronunciation</th>
                  </tr>
                </thead>
                <tbody>
                  {guideData.bandDescriptors.map((bd, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {bd.band}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{bd.level}</div>
                      </td>
                      <td>{bd.fluency}</td>
                      <td>{bd.lexical}</td>
                      <td>{bd.grammar}</td>
                      <td>{bd.pronunciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Interactive Drills */}
          <section id="interactive-drills" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Sparkles size={14} />
                <span>Immediate Feedback</span>
              </div>
              <h2 className={styles.sectionTitle}>Interactive Speaking Drills</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {guideData.interactiveDrills.map((drill) => {
                const isAnswered = checkedDrills[drill.id];
                const selectedOptId = selectedDrills[drill.id];
                const selectedOpt = drill.options.find((o) => o.id === selectedOptId);

                return (
                  <div key={drill.id} className={styles.quizCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{drill.title}</h3>
                      {isAnswered && (
                        <button
                          type="button"
                          onClick={() => handleResetDrill(drill.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ borderRadius: 0, gap: 4 }}
                        >
                          <RotateCcw size={13} />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                      {drill.question}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {drill.options.map((opt) => {
                        let optClass = styles.quizOption;
                        if (isAnswered) {
                          if (opt.isCorrect) optClass += ` ${styles.quizOptionCorrect}`;
                          else if (opt.id === selectedOptId) optClass += ` ${styles.quizOptionIncorrect}`;
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            className={optClass}
                            disabled={isAnswered}
                            onClick={() => handleSelectDrill(drill.id, opt.id)}
                          >
                            <span style={{ fontWeight: 700, minWidth: 20 }}>{opt.id}.</span>
                            <span style={{ flex: 1 }}>{opt.text}</span>
                            {isAnswered && opt.isCorrect && <Check size={16} color="#10b981" />}
                            {isAnswered && !opt.isCorrect && opt.id === selectedOptId && <X size={16} color="#ef4444" />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && selectedOpt && (
                      <div
                        style={{
                          borderLeft: `4px solid ${selectedOpt.isCorrect ? '#10b981' : '#ef4444'}`,
                          background: selectedOpt.isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          padding: '12px 16px',
                          fontSize: '0.84rem',
                          lineHeight: 1.5,
                        }}
                      >
                        <strong>{selectedOpt.isCorrect ? 'Well done!' : 'Explanation:'}</strong> {selectedOpt.feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section: Curated Topics Library */}
          <section id="topic-library" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Layers size={14} />
                <span>Protected Student Workspace</span>
              </div>
              <h2 className={styles.sectionTitle}>Curated Speaking Topics Library</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              Practice speaking with {speakingTopics.length} official examiner topics. Record your responses and get Whisper-powered AI scoring on all four criteria.
            </p>

            <div className={styles.cardGrid}>
              {speakingTopics.slice(0, 4).map((topic) => (
                <div key={topic.id} className={styles.infoCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-purple" style={{ borderRadius: 0 }}>
                      {topic.category}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {topic.durationLabel}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: '4px 0' }}>
                    {topic.title}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Part 2 Cue:</strong> &ldquo;{topic.part2?.cueTitle}&rdquo;
                  </div>
                  <button
                    type="button"
                    onClick={handlePracticeCta}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: 0, marginTop: 'auto', justifyContent: 'center' }}
                  >
                    <span>Practice This Topic</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Practice CTA Box */}
            <div className={styles.ctaBox}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Ready to Boost Your IELTS Speaking Confidence?
              </h3>
              <p style={{ maxWidth: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Access our full library of 15+ Part 1, 2, and 3 topics, live audio recorder, Whisper speech-to-text transcriptions, and instant AI band breakdowns.
              </p>
              <button
                type="button"
                onClick={handlePracticeCta}
                className="btn btn-primary"
                style={{ borderRadius: 0, padding: '14px 28px', fontWeight: 700 }}
              >
                <span>Enter Speaking Simulator</span>
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
            <div className={styles.tocTitle}>Speaking Guide Navigation</div>
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
              <span>Practice Speaking</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

