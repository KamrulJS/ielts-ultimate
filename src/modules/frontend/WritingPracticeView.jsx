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
              className={styles.wp_h1_1}
            >
              {guideData.hero.title}
            </h1>
            <p
              className={styles.wp_p_2}
            >
              {guideData.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className={styles.wp_div_3}>
              <button
                type="button"
                onClick={handlePracticeCta}
                className={`btn btn-primary ${styles.wp_button_4}`}
                
              >
                <span>Start Writing Practice</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={handlePracticeCta}
                className={`btn btn-secondary ${styles.wp_button_5}`}
                
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
              <div className={styles.wp_div_6}>
                <Zap size={16} color="var(--primary)" />
                <span>Instant AI Writing Rubric Breakdown</span>
              </div>
              <span className={`badge badge-yellow ${styles.wp_span_7}`} >
                Band 8.0 Sample
              </span>
            </div>

            <div className={styles.wp_div_8}>
              <div className={styles.wp_div_9}>
                Academic Task 2 • Technology & Society
              </div>
              <div
                className={styles.wp_div_10}
              >
                &ldquo;While automated workflows significantly enhance industrial efficiency, unchecked reliance on algorithmic decision-making risks marginalizing vulnerable workforces...&rdquo;
              </div>
            </div>

            <div className={styles.wp_div_11}>
              <div className={styles.wp_div_12}>
                <div className={styles.wp_div_13}>Task Response</div>
                <div className={styles.wp_div_14}>8.0</div>
                <div className={styles.wp_div_15}>Well-developed stance</div>
              </div>
              <div className={styles.wp_div_12}>
                <div className={styles.wp_div_13}>Coherence &amp; Cohesion</div>
                <div className={styles.wp_div_14}>8.5</div>
                <div className={styles.wp_div_15}>Seamless transitions</div>
              </div>
              <div className={styles.wp_div_12}>
                <div className={styles.wp_div_13}>Lexical Resource</div>
                <div className={styles.wp_div_14}>8.0</div>
                <div className={styles.wp_div_15}>Academic collocations</div>
              </div>
              <div className={styles.wp_div_12}>
                <div className={styles.wp_div_13}>Grammatical Range</div>
                <div className={styles.wp_div_14}>7.5</div>
                <div className={styles.wp_div_15}>Complex sentences</div>
              </div>
            </div>

            <div className={styles.wp_div_16}>
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
            <p className={styles.wp_p_17}>
              {guideData.overview.summary}
            </p>

            <div className={styles.cardGrid}>
              {guideData.overview.tracks.map((t, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.wp_div_18}>
                    {idx === 0 ? <BarChart2 size={18} color="var(--primary)" /> : <Mail size={18} color="var(--primary)" />}
                    <span>{t.name}</span>
                  </div>
                  <div className={styles.wp_div_19}>
                    <strong>Audience:</strong> {t.audience}
                  </div>
                  <div className={styles.wp_div_20}>
                    <strong>Task 1:</strong> {t.task1}
                  </div>
                  <div className={styles.wp_div_21}>
                    <strong>Task 2:</strong> {t.task2}
                  </div>
                </div>
              ))}
            </div>

            <div
              className={styles.wp_div_22}
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
            <p className={styles.wp_p_17}>
              Every IELTS Writing paper is evaluated on four equally weighted criteria. Each criterion represents 25% of your final Writing score.
            </p>

            <div className={styles.cardGrid}>
              {guideData.assessmentCriteria.map((c, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.wp_div_23}>
                    <span className={`badge badge-purple ${styles.wp_span_24}`} >
                      {c.code}
                    </span>
                    <span className={styles.wp_span_25}>
                      {c.weight}
                    </span>
                  </div>
                  <h3 className={styles.wp_h3_26}>{c.name}</h3>
                  <p className={styles.wp_p_27}>
                    {c.description}
                  </p>
                  <div
                    className={styles.wp_div_28}
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
            <div className={styles.wp_div_29}>
              <span className={`badge badge-yellow ${styles.wp_span_7}`} >
                {guideData.task1Academic.wordRequirement}
              </span>
              <span className={`badge ${styles.wp_span_30}`} >
                {guideData.task1Academic.suggestedTime}
              </span>
            </div>

            <div
              className={styles.wp_div_31}
            >
              <strong>The Golden Rule:</strong> {guideData.task1Academic.goldenRule}
            </div>

            <h3 className={styles.wp_h3_32}>Recommended 4-Paragraph Structure</h3>
            <div className={styles.wp_div_33}>
              {guideData.task1Academic.structure.map((item, idx) => (
                <div key={idx} className={styles.wp_div_34}>
                  <div className={styles.wp_div_35}>
                    {item.part}
                  </div>
                  <div className={styles.wp_div_36}>
                    {item.purpose}
                  </div>
                </div>
              ))}
            </div>

            <h3 className={styles.wp_h3_37}>Task 1 Visual Formats Breakdown</h3>
            <div className={styles.cardGrid}>
              {guideData.task1Academic.visualTypes.map((v, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.wp_div_38}>{v.type}</div>
                  <div className={styles.wp_div_39}>
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
            <div className={styles.wp_div_29}>
              <span className={`badge badge-yellow ${styles.wp_span_7}`} >
                {guideData.task2Essays.wordRequirement}
              </span>
              <span className={`badge ${styles.wp_span_30}`} >
                {guideData.task2Essays.suggestedTime}
              </span>
            </div>

            <h3 className={styles.wp_h3_32}>5 Core Essay Question Types</h3>
            <div className={styles.wp_div_40}>
              {guideData.task2Essays.essayTypes.map((et, idx) => (
                <div key={idx} className={styles.infoCard}>
                  <div className={styles.wp_div_23}>
                    <div className={styles.wp_div_41}>
                      {et.type}
                    </div>
                  </div>
                  <div
                    className={styles.wp_div_42}
                  >
                    Prompt: &ldquo;{et.promptExample}&rdquo;
                  </div>
                  <div className={styles.wp_div_43}>
                    <strong>Exam Strategy:</strong> {et.strategy}
                  </div>
                </div>
              ))}
            </div>

            <h3 className={styles.wp_h3_37}>The 4-Paragraph Blueprint</h3>
            <div className={styles.wp_div_44}>
              {guideData.task2Essays.paragraphFormula.map((p, idx) => (
                <div key={idx} className={styles.wp_div_45}>
                  <div className={styles.wp_div_35}>{p.part}</div>
                  <div className={styles.wp_div_46}>
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

            <div className={styles.wp_div_47}>
              <div className={styles.infoCard}>
                <h3 className={styles.wp_h3_48}>
                  Task 1: 20 Minutes Total
                </h3>
                {guideData.timeManagement.task1Breakdown.map((b, idx) => (
                  <div key={idx} className={styles.wp_div_49}>
                    <div className={styles.wp_div_50}>
                      <span>{b.phase}</span>
                      <span className={`badge badge-yellow ${styles.wp_span_7}`} >{b.time}</span>
                    </div>
                    <div className={styles.wp_div_51}>{b.action}</div>
                  </div>
                ))}
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.wp_h3_48}>
                  Task 2: 40 Minutes Total
                </h3>
                {guideData.timeManagement.task2Breakdown.map((b, idx) => (
                  <div key={idx} className={styles.wp_div_49}>
                    <div className={styles.wp_div_50}>
                      <span>{b.phase}</span>
                      <span className={`badge badge-purple ${styles.wp_span_7}`} >{b.time}</span>
                    </div>
                    <div className={styles.wp_div_51}>{b.action}</div>
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
            <p className={styles.wp_p_17}>
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
                      <td className={styles.wp_td_52}>
                        {bd.band}
                        <div className={styles.wp_div_13}>{bd.level}</div>
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
              <div className={styles.wp_div_23}>
                <span className={`badge badge-purple ${styles.wp_span_7}`} >Band 9 Essay Excerpt</span>
                <span className={styles.wp_div_19}>Topic: Technological Automation</span>
              </div>
              <blockquote
                className={styles.wp_blockquote_53}
              >
                &ldquo;It is undeniable that automated production lines yield unmatched operational consistency and reduce overhead costs. Nevertheless, the socio-economic ramification of displacement cannot be disregarded. If governments fail to implement proactive retraining initiatives, the productivity dividends of automation may be entirely offset by escalating structural unemployment.&rdquo;
              </blockquote>
              <div className={styles.wp_div_54}>
                <div className={styles.wp_div_55}>
                  <strong>Grammar:</strong> Conditionals (If... fail), passive voice, fronted adverbials.
                </div>
                <div className={styles.wp_div_55}>
                  <strong>Lexis:</strong> &lsquo;operational consistency&rsquo;, &lsquo;socio-economic ramification&rsquo;, &lsquo;structural unemployment&rsquo;.
                </div>
                <div className={styles.wp_div_55}>
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
            <p className={styles.wp_p_17}>
              Test your understanding of Band 9 overview formulation and academic cohesive markers.
            </p>

            <div className={styles.wp_div_56}>
              {guideData.interactiveDrills.map((drill) => {
                const isAnswered = checkedDrills[drill.id];
                const selectedOptId = selectedDrills[drill.id];
                const selectedOpt = drill.options.find((o) => o.id === selectedOptId);

                return (
                  <div key={drill.id} className={styles.quizCard}>
                    <div className={styles.wp_div_23}>
                      <h3 className={styles.wp_h3_57}>{drill.title}</h3>
                      {isAnswered && (
                        <button
                          type="button"
                          onClick={() => handleResetDrill(drill.id)}
                          className={`btn btn-secondary btn-sm ${styles.wp_button_58}`}
                          
                        >
                          <RotateCcw size={13} />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>
                    <p className={styles.wp_p_59}>
                      {drill.scenario}
                    </p>

                    <div className={styles.wp_div_44}>
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
                            <span className={styles.wp_span_60}>{opt.id}.</span>
                            <span className={styles.wp_span_61}>{opt.text}</span>
                            {isAnswered && opt.isCorrect && <Check size={16} color="#10b981" />}
                            {isAnswered && !opt.isCorrect && opt.id === selectedOptId && <X size={16} color="#ef4444" />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && selectedOpt && (
                      <div
                        className={`${styles.quizFeedbackBox} ${selectedOpt.isCorrect ? styles.quizFeedbackCorrect : styles.quizFeedbackIncorrect}`}
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
            <p className={styles.wp_p_17}>
              Practice with {writingTasks.length} authentic Task 1 and Task 2 prompts in our timed exam simulation. Receive comprehensive criterion band breakdowns in seconds.
            </p>

            <div className={styles.cardGrid}>
              {writingTasks.slice(0, 4).map((task) => (
                <div key={task.id} className={styles.infoCard}>
                  <div className={styles.wp_div_23}>
                    <span className={`badge badge-purple ${styles.wp_span_7}`} >
                      {task.type}
                    </span>
                    <span className={styles.wp_span_62}>
                      {task.timeLimit} mins
                    </span>
                  </div>
                  <h4 className={styles.wp_h4_63}>
                    {task.title}
                  </h4>
                  <p className={styles.wp_p_64}>
                    {task.prompt?.slice(0, 110)}...
                  </p>
                  <button
                    type="button"
                    onClick={handlePracticeCta}
                    className={`btn btn-secondary btn-sm ${styles.wp_button_65}`}
                    
                  >
                    <span>Practice This Task</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Practice CTA Box */}
            <div className={styles.ctaBox}>
              <h3 className={styles.wp_h3_66}>
                Ready to Boost Your IELTS Writing Score?
              </h3>
              <p className={styles.wp_p_67}>
                Access our full library of 12+ prompts, real-time word counting, timed simulator, and instant AI rubric evaluation.
              </p>
              <button
                type="button"
                onClick={handlePracticeCta}
                className={`btn btn-primary ${styles.wp_button_68}`}
                
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

            <div className={styles.wp_div_33}>
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
                      className={`${styles.faqChevronIcon} ${openFaq === idx ? styles.faqChevronIconOpen : ''}`}
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
              className={`btn btn-primary btn-sm ${styles.wp_button_69}`}
              
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

