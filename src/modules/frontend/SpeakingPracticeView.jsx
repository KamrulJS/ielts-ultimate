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
              className={styles.spea_h1_1}
            >
              {guideData.hero.title}
            </h1>
            <p
              className={styles.spea_p_2}
            >
              {guideData.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className={styles.spea_div_3}>
              <button
                type="button"
                onClick={handlePracticeCta}
                className={`btn btn-primary ${styles.spea_button_4}`}
                
              >
                <span>Start Speaking Simulator</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={handlePracticeCta}
                className={`btn btn-secondary ${styles.spea_button_5}`}
                
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
              <div className={styles.spea_div_6}>
                <Zap size={16} color="var(--primary)" />
                <span>AI Speech Whisper Evaluation</span>
              </div>
              <span className={`badge badge-purple ${styles.spea_span_7}`} >
                Live Audio Analysis
              </span>
            </div>

            <div className={styles.spea_div_8}>
              <div className={styles.spea_div_9}>
                <span>Part 2 Cue Card • Audio Transcript</span>
                <span className={styles.spea_span_10}>124 WPM • High Fluency</span>
              </div>
              <div
                className={styles.spea_div_11}
              >
                &ldquo;I would like to talk about the National Maritime Museum in Greenwich, which I had the pleasure of visiting during an educational excursion last autumn...&rdquo;
              </div>
            </div>

            <div className={styles.spea_div_12}>
              <div className={styles.spea_div_13}>
                <div className={styles.spea_div_14}>Fluency &amp; Coherence</div>
                <div className={styles.spea_div_15}>8.0</div>
                <div className={styles.spea_div_16}>Natural discourse pace</div>
              </div>
              <div className={styles.spea_div_13}>
                <div className={styles.spea_div_14}>Lexical Resource</div>
                <div className={styles.spea_div_15}>8.5</div>
                <div className={styles.spea_div_16}>Precise collocations</div>
              </div>
              <div className={styles.spea_div_13}>
                <div className={styles.spea_div_14}>Grammatical Range</div>
                <div className={styles.spea_div_15}>7.5</div>
                <div className={styles.spea_div_16}>Complex past tenses</div>
              </div>
              <div className={styles.spea_div_13}>
                <div className={styles.spea_div_14}>Pronunciation</div>
                <div className={styles.spea_div_15}>8.0</div>
                <div className={styles.spea_div_16}>Clear intonation contours</div>
              </div>
            </div>

            <div className={styles.spea_div_17}>
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
            <p className={styles.spea_p_18}>
              {guideData.overview.summary}
            </p>

            <div className={styles.cardGrid}>
              {guideData.overview.keyFacts.map((f, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.spea_div_19}>
                    {f.title}
                  </div>
                  <div className={styles.spea_div_20}>
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

            <div className={styles.spea_div_21}>
              {guideData.threeParts.map((part, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.spea_div_22}>
                    <h3 className={styles.spea_h3_23}>
                      {part.part}
                    </h3>
                    <span className={`badge badge-purple ${styles.spea_span_7}`} >
                      {part.duration}
                    </span>
                  </div>
                  <div className={styles.spea_div_20}>
                    <strong>Focus:</strong> {part.focus}
                  </div>
                  <div className={styles.spea_div_20}>
                    <strong>Objective:</strong> {part.objective}
                  </div>
                  <div
                    className={styles.spea_div_24}
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
            <p className={styles.spea_p_18}>
              Examiners listen for four specific competencies, each contributing exactly 25% towards your speaking score.
            </p>

            <div className={styles.cardGrid}>
              {guideData.assessmentCriteria.map((c, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.spea_div_25}>
                    <span className={`badge badge-purple ${styles.spea_span_26}`} >
                      {c.code}
                    </span>
                    <span className={styles.spea_span_27}>
                      {c.weight}
                    </span>
                  </div>
                  <h3 className={styles.spea_h3_28}>{c.name}</h3>
                  <p className={styles.spea_p_29}>
                    {c.description}
                  </p>
                  <div
                    className={styles.spea_div_30}
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
            <p className={styles.spea_p_18}>
              {guideData.part2Strategy.advice}
            </p>

            <div className={styles.spea_div_31}>
              {guideData.part2Strategy.steps.map((st, idx) => (
                <div key={idx} className={styles.spea_div_32}>
                  <div className={styles.spea_div_33}>
                    {st.step}
                  </div>
                  <div className={styles.spea_div_34}>
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
            <div className={styles.spea_div_35}>
              Formula: {guideData.part3Framework.formula}
            </div>

            <div className={styles.spea_div_31}>
              {guideData.part3Framework.steps.map((item, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.spea_div_36}>
                    <span
                      className={styles.spea_span_37}
                    >
                      {item.letter}
                    </span>
                    <span className={styles.spea_span_38}>{item.name}</span>
                  </div>
                  <div
                    className={styles.spea_div_39}
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
              className={styles.spea_div_40}
            >
              <strong>Truth from Official Examiners:</strong> {guideData.pronunciationGuide.truth}
            </div>

            <div className={styles.cardGrid}>
              {guideData.pronunciationGuide.pillars.map((p, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.spea_div_41}>
                    {p.feature}
                  </div>
                  <div className={styles.spea_div_20}>
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
                      <td className={styles.spea_td_42}>
                        {bd.band}
                        <div className={styles.spea_div_14}>{bd.level}</div>
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

            <div className={styles.spea_div_43}>
              {guideData.interactiveDrills.map((drill) => {
                const isAnswered = checkedDrills[drill.id];
                const selectedOptId = selectedDrills[drill.id];
                const selectedOpt = drill.options.find((o) => o.id === selectedOptId);

                return (
                  <div key={drill.id} className={styles.quizCard}>
                    <div className={styles.spea_div_25}>
                      <h3 className={styles.spea_h3_44}>{drill.title}</h3>
                      {isAnswered && (
                        <button
                          type="button"
                          onClick={() => handleResetDrill(drill.id)}
                          className={`btn btn-secondary btn-sm ${styles.spea_button_45}`}
                          
                        >
                          <RotateCcw size={13} />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>
                    <p className={styles.spea_p_46}>
                      {drill.question}
                    </p>

                    <div className={styles.spea_div_47}>
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
                            <span className={styles.spea_span_48}>{opt.id}.</span>
                            <span className={styles.spea_span_49}>{opt.text}</span>
                            {isAnswered && opt.isCorrect && <Check size={16} color="#10b981" />}
                            {isAnswered && !opt.isCorrect && opt.id === selectedOptId && <X size={16} color="#ef4444" />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && selectedOpt && (
                      <div
                        className={`${styles.drillFeedbackBox} ${selectedOpt.isCorrect ? styles.drillFeedbackCorrect : styles.drillFeedbackIncorrect}`}
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
            <p className={styles.spea_p_18}>
              Practice speaking with {speakingTopics.length} official examiner topics. Record your responses and get Whisper-powered AI scoring on all four criteria.
            </p>

            <div className={styles.cardGrid}>
              {speakingTopics.slice(0, 4).map((topic) => (
                <div key={topic.id} className={styles.infoCard}>
                  <div className={styles.spea_div_25}>
                    <span className={`badge badge-purple ${styles.spea_span_7}`} >
                      {topic.category}
                    </span>
                    <span className={styles.spea_span_50}>
                      {topic.durationLabel}
                    </span>
                  </div>
                  <h4 className={styles.spea_h4_51}>
                    {topic.title}
                  </h4>
                  <div className={styles.spea_div_52}>
                    <strong>Part 2 Cue:</strong> &ldquo;{topic.part2?.cueTitle}&rdquo;
                  </div>
                  <button
                    type="button"
                    onClick={handlePracticeCta}
                    className={`btn btn-secondary btn-sm ${styles.spea_button_53}`}
                    
                  >
                    <span>Practice This Topic</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Practice CTA Box */}
            <div className={styles.ctaBox}>
              <h3 className={styles.spea_h3_54}>
                Ready to Boost Your IELTS Speaking Confidence?
              </h3>
              <p className={styles.spea_p_55}>
                Access our full library of 15+ Part 1, 2, and 3 topics, live audio recorder, Whisper speech-to-text transcriptions, and instant AI band breakdowns.
              </p>
              <button
                type="button"
                onClick={handlePracticeCta}
                className={`btn btn-primary ${styles.spea_button_56}`}
                
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

            <div className={styles.spea_div_31}>
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
              className={`btn btn-primary btn-sm ${styles.spea_button_57}`}
              
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

