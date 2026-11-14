'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PenTool,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Check,
  X,
  FileText,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  BarChart2,
  Mail,
  Send,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import guideData from '@/data/public/writing-guide.json';
import writingTasks from '@/data/writing/tasks.json';
import styles from './WritingPractice.module.css';

export function WritingPracticeView() {
  const router = useRouter();
  const app = useApp?.() || {};
  const auth = app.auth || { isAuthenticated: false };
  const rootRef = useGsapEntrance('writing-practice');

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
      router.push('/writing');
    } else {
      router.push('/login?next=/writing');
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
              <PenTool size={14} />
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
                <span>Start Writing Practice</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={handlePracticeCta}
                className="btn btn-secondary"
                style={{ borderRadius: 0, padding: '12px 20px', fontWeight: 600 }}
              >
                <span>Try AI Writing Examiner</span>
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
                <span>Instant AI Writing Rubric Breakdown</span>
              </div>
              <span className="badge badge-yellow" style={{ borderRadius: 0 }}>
                Band 8.0 Sample
              </span>
            </div>

            <div style={{ border: '1px solid var(--border)', background: '#ffffff', padding: 14 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                Academic Task 2 • Technology & Society
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
                &ldquo;While automated workflows significantly enhance industrial efficiency, unchecked reliance on algorithmic decision-making risks marginalizing vulnerable workforces...&rdquo;
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Task Response</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>8.0</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Well-developed stance</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Coherence &amp; Cohesion</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>8.5</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Seamless transitions</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lexical Resource</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>8.0</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Academic collocations</div>
              </div>
              <div style={{ border: '1px solid var(--border)', padding: 10, background: '#fafafa' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Grammatical Range</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>7.5</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Complex sentences</div>
              </div>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Calibrated against official public IELTS Band Descriptors
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
                <span>Format Rules &amp; Weighting</span>
              </div>
              <h2 className={styles.sectionTitle}>IELTS Writing Exam Overview</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              {guideData.overview.summary}
            </p>

            <div className={styles.cardGrid}>
              {guideData.overview.tracks.map((t, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem' }}>
                    {idx === 0 ? <BarChart2 size={18} color="var(--primary)" /> : <Mail size={18} color="var(--primary)" />}
                    <span>{t.name}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Audience:</strong> {t.audience}
                  </div>
                  <div style={{ fontSize: '0.86rem', lineHeight: 1.5, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                    <strong>Task 1:</strong> {t.task1}
                  </div>
                  <div style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
                    <strong>Task 2:</strong> {t.task2}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                borderLeft: '4px solid var(--accent-yellow)',
                background: 'rgba(234, 179, 8, 0.08)',
                padding: '16px 20px',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              <strong>Important Weighting Rule:</strong> {guideData.overview.weightingRule}
            </div>
          </section>

          {/* Section: Criteria */}
          <section id="criteria" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Award size={14} />
                <span>Examiner Scoring</span>
              </div>
              <h2 className={styles.sectionTitle}>The 4 Official Assessment Criteria</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              Every IELTS Writing paper is evaluated on four equally weighted criteria. Each criterion represents 25% of your final Writing score.
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
                    <strong>Band 9 Benchmark:</strong> {c.band9Target}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Task 1 Academic */}
          <section id="task1-academic" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <BarChart2 size={14} />
                <span>Visual Reporting</span>
              </div>
              <h2 className={styles.sectionTitle}>{guideData.task1Academic.title}</h2>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span className="badge badge-yellow" style={{ borderRadius: 0 }}>
                {guideData.task1Academic.wordRequirement}
              </span>
              <span className="badge" style={{ borderRadius: 0, border: '1px solid var(--border)' }}>
                {guideData.task1Academic.suggestedTime}
              </span>
            </div>

            <div
              style={{
                border: '1px solid #ef4444',
                background: 'rgba(239, 68, 68, 0.06)',
                padding: '14px 18px',
                fontSize: '0.88rem',
                lineHeight: 1.55,
              }}
            >
              <strong>The Golden Rule:</strong> {guideData.task1Academic.goldenRule}
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recommended 4-Paragraph Structure</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {guideData.task1Academic.structure.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)', padding: '14px 18px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary)' }}>
                    {item.part}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {item.purpose}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 12 }}>Task 1 Visual Formats Breakdown</h3>
            <div className={styles.cardGrid}>
              {guideData.task1Academic.visualTypes.map((v, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.type}</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Analysis Focus:</strong> {v.focus}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Task 2 Essays */}
          <section id="task2-essays" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <FileText size={14} />
                <span>Discursive Writing</span>
              </div>
              <h2 className={styles.sectionTitle}>{guideData.task2Essays.title}</h2>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span className="badge badge-yellow" style={{ borderRadius: 0 }}>
                {guideData.task2Essays.wordRequirement}
              </span>
              <span className="badge" style={{ borderRadius: 0, border: '1px solid var(--border)' }}>
                {guideData.task2Essays.suggestedTime}
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>5 Core Essay Question Types</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {guideData.task2Essays.essayTypes.map((et, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                      {et.type}
                    </div>
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                      borderLeft: '2px solid var(--border)',
                      paddingLeft: 10,
                    }}
                  >
                    Prompt: &ldquo;{et.promptExample}&rdquo;
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    <strong>Exam Strategy:</strong> {et.strategy}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 12 }}>The 4-Paragraph Blueprint</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {guideData.task2Essays.paragraphFormula.map((p, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)', padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary)' }}>{p.part}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {p.steps}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Time Strategy */}
          <section id="time-strategy" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Clock size={14} />
                <span>Pacing Protocol</span>
              </div>
              <h2 className={styles.sectionTitle}>Time Management &amp; The 20/40 Rule</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div className={styles.infoCard}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                  Task 1: 20 Minutes Total
                </h3>
                {guideData.timeManagement.task1Breakdown.map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.86rem' }}>
                      <span>{b.phase}</span>
                      <span className="badge badge-yellow" style={{ borderRadius: 0 }}>{b.time}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{b.action}</div>
                  </div>
                ))}
              </div>

              <div className={styles.infoCard}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                  Task 2: 40 Minutes Total
                </h3>
                {guideData.timeManagement.task2Breakdown.map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.86rem' }}>
                      <span>{b.phase}</span>
                      <span className="badge badge-purple" style={{ borderRadius: 0 }}>{b.time}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{b.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Band Descriptors Table */}
          <section id="band-descriptors" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Award size={14} />
                <span>Rubric Matrices</span>
              </div>
              <h2 className={styles.sectionTitle}>IELTS Writing Band Descriptors</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              Compare expectations across Bands 6 to 9 to understand exactly what examiners require at each proficiency level.
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.customTable}>
                <thead>
                  <tr>
                    <th>Band</th>
                    <th>Task Response</th>
                    <th>Coherence &amp; Cohesion</th>
                    <th>Lexical Resource</th>
                    <th>Grammatical Range</th>
                  </tr>
                </thead>
                <tbody>
                  {guideData.bandDescriptors.map((bd, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                        {bd.band}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{bd.level}</div>
                      </td>
                      <td>{bd.taskResponse}</td>
                      <td>{bd.coherence}</td>
                      <td>{bd.lexical}</td>
                      <td>{bd.grammar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Model Samples Analysis */}
          <section id="model-samples" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <CheckCircle2 size={14} />
                <span>Examiner Analysis</span>
              </div>
              <h2 className={styles.sectionTitle}>Band 9 Model Answer Analysis</h2>
            </div>

            <div className={styles.infoCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-purple" style={{ borderRadius: 0 }}>Band 9 Essay Excerpt</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Topic: Technological Automation</span>
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: 'var(--text-primary)',
                  background: 'rgba(136, 103, 184, 0.04)',
                  padding: '16px 20px',
                  borderLeft: '4px solid var(--primary)',
                }}
              >
                &ldquo;It is undeniable that automated production lines yield unmatched operational consistency and reduce overhead costs. Nevertheless, the socio-economic ramification of displacement cannot be disregarded. If governments fail to implement proactive retraining initiatives, the productivity dividends of automation may be entirely offset by escalating structural unemployment.&rdquo;
              </blockquote>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginTop: 8 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Grammar:</strong> Conditionals (If... fail), passive voice, fronted adverbials.
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Lexis:</strong> &lsquo;operational consistency&rsquo;, &lsquo;socio-economic ramification&rsquo;, &lsquo;structural unemployment&rsquo;.
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Cohesion:</strong> Seamless contrast through &lsquo;It is undeniable... Nevertheless&rsquo;.
                </div>
              </div>
            </div>
          </section>

          {/* Section: Interactive Drills */}
          <section id="interactive-drills" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Sparkles size={14} />
                <span>Immediate Feedback</span>
              </div>
              <h2 className={styles.sectionTitle}>Interactive Writing Skill Drills</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              Test your understanding of Band 9 overview formulation and academic cohesive markers.
            </p>

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
                      {drill.scenario}
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

          {/* Section: Practice Library Preview */}
          <section id="practice-library" className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>
                <Layers size={14} />
                <span>Protected Student Workspace</span>
              </div>
              <h2 className={styles.sectionTitle}>Available Writing Practice Library</h2>
            </div>
            <p style={{ lineHeight: 1.65, color: 'var(--text-secondary)' }}>
              Practice with {writingTasks.length} authentic Task 1 and Task 2 prompts in our timed exam simulation. Receive comprehensive criterion band breakdowns in seconds.
            </p>

            <div className={styles.cardGrid}>
              {writingTasks.slice(0, 4).map((task) => (
                <div key={task.id} className={styles.infoCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-purple" style={{ borderRadius: 0 }}>
                      {task.type}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {task.timeLimit} mins
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: '4px 0' }}>
                    {task.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {task.prompt?.slice(0, 110)}...
                  </p>
                  <button
                    type="button"
                    onClick={handlePracticeCta}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: 0, marginTop: 'auto', justifyContent: 'center' }}
                  >
                    <span>Practice This Task</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Practice CTA Box */}
            <div className={styles.ctaBox}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Ready to Boost Your IELTS Writing Score?
              </h3>
              <p style={{ maxWidth: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Access our full library of 12+ prompts, real-time word counting, timed simulator, and instant AI rubric evaluation.
              </p>
              <button
                type="button"
                onClick={handlePracticeCta}
                className="btn btn-primary"
                style={{ borderRadius: 0, padding: '14px 28px', fontWeight: 700 }}
              >
                <span>Enter Writing Workspace</span>
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
            <div className={styles.tocTitle}>Writing Guide Navigation</div>
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
              <span>Practice Writing</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

