'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  BookMarked,
  FileText,
  Search,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { Badge } from '@/components/common/UiPrimitives';
import guideData from '@/data/public/reading-guide.json';
import cambridgeBooks from '@/data/reading/cambridge-reading-books.json';
import styles from './ReadingPractice.module.css';

export function ReadingPracticeView() {
  const router = useRouter();
  const app = useApp?.() || {};
  const auth = app.auth || { isAuthenticated: false };
  const rootRef = useGsapEntrance('reading-practice');

  // Sticky TOC Active Section Tracker
  const [activeTocId, setActiveTocId] = useState('overview');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Question Types Filter & Search
  const [qtSearch, setQtSearch] = useState('');
  const [selectedQtType, setSelectedQtType] = useState('All');

  // Accordion states
  const [openTips, setOpenTips] = useState({});
  const toggleTip = (id) => setOpenTips((prev) => ({ ...prev, [id]: !prev[id] }));

  const [openAnswers, setOpenAnswers] = useState({});
  const toggleAnswer = (id) => setOpenAnswers((prev) => ({ ...prev, [id]: !prev[id] }));

  const [openStrategyDetails, setOpenStrategyDetails] = useState({});
  const toggleStrategyDetail = (id) => setOpenStrategyDetails((prev) => ({ ...prev, [id]: !prev[id] }));

  const [openRoadblock, setOpenRoadblock] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Exercises State
  const [drillAnswers, setDrillAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    h1: null,
    s1: null,
  });
  const [drillChecked, setDrillChecked] = useState({
    tfng: false,
    headings: false,
    summary: false,
  });

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
      router.push('/reading');
    } else {
      router.push('/login?next=/reading');
    }
  };

  const filteredQuestionTypes = useMemo(() => {
    const q = qtSearch.trim().toLowerCase();
    return guideData.questionTypes.filter((item) => {
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q);
      const matchType =
        selectedQtType === 'All' ||
        (selectedQtType === 'Completion' && item.name.includes('Completion')) ||
        (selectedQtType === 'Matching' && item.name.includes('Matching')) ||
        (selectedQtType === 'Verification' && (item.slug.includes('true') || item.slug.includes('yes'))) ||
        (selectedQtType === 'Selection' && (item.slug.includes('choice') || item.slug.includes('short')));
      return matchSearch && matchType;
    });
  }, [qtSearch, selectedQtType]);

  const handleSelectDrillOption = (qId, option) => {
    setDrillAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleResetDrill = (drillKey, qIds) => {
    setDrillChecked((prev) => ({ ...prev, [drillKey]: false }));
    setDrillAnswers((prev) => {
      const updated = { ...prev };
      qIds.forEach((id) => (updated[id] = null));
      return updated;
    });
  };

  return (
    <div ref={rootRef} style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.readingContainer}>
          <div className={styles.heroGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <Badge variant="purple">{guideData.hero.badge}</Badge>
                <Badge variant="yellow">IELTS Academic Dedicated</Badge>
              </div>
              <h1 className="hero-heading" style={{ fontSize: '2.5rem', lineHeight: 1.15 }}>
                {guideData.hero.headline}
              </h1>
              <p className="hero-desc" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                {guideData.hero.description}
              </p>

              <div className={styles.heroPillList}>
                {guideData.hero.stats.map((st) => (
                  <div key={st.label} className={styles.heroPill}>
                    <Clock size={13} style={{ color: 'var(--primary)' }} />
                    <span>
                      <strong>{st.value}</strong> ({st.label})
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={handlePracticeCta}
                  className="btn btn-primary btn-lg"
                  style={{ borderRadius: 0, backgroundColor: "#F6BD28", color: "#202020", border: "1px solid #E5AC1A", fontWeight: 700 }}
                >
                  {guideData.hero.primaryCta.label} <ArrowRight size={16} />
                </button>
                <a
                  href={guideData.hero.secondaryCta.href}
                  className="btn btn-secondary btn-lg"
                  style={{ borderRadius: 0 }}
                >
                  {guideData.hero.secondaryCta.label}
                </a>
              </div>
            </div>

            {/* Hero Visual Preview */}
            <div className={styles.heroRight}>
              <Image
                src="/images/hero/ielts-reading-hero.png"
                alt="IELTS Academic Reading Preparation Illustration"
                width={540}
                height={420}
                className={styles.heroTransparentImg}
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Layout with Right Sticky TOC */}
      <div className={styles.readingContainer}>
        {/* Mobile TOC Accordion */}
        <div className={styles.mobileTocWrap}>
          <button
            type="button"
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={16} style={{ color: 'var(--primary)' }} /> Table of Contents ({guideData.tableOfContents.length} Sections)
            </span>
            <ChevronDown size={16} style={{ transform: mobileTocOpen ? 'rotate(180deg)' : 'none' }} />
          </button>
          {mobileTocOpen && (
            <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {guideData.tableOfContents.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMobileTocOpen(false)}
                    style={{
                      fontSize: '0.86rem',
                      color: activeTocId === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: activeTocId === item.id ? 700 : 400,
                      textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.contentLayout}>
          {/* Main Educational Column */}
          <main className={styles.mainColumn}>
            {/* 1. Overview */}
            <section id="overview" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="purple" className={styles.sectionBadge}>Section 01</Badge>
                <h2 className={styles.sectionTitle}>{guideData.overview.title}</h2>
                <p className={styles.sectionSubtitle}>{guideData.overview.subtitle}</p>
              </div>

              {guideData.overview.paragraphs.map((p, idx) => (
                <p key={idx} className="lead" style={{ fontSize: '0.96rem', lineHeight: 1.7, color: '#202020' }}>
                  {p}
                </p>
              ))}

              <div className="grid-3" style={{ gap: 14 }}>
                {guideData.overview.keyFacts.map((kf) => (
                  <div key={kf.label} className="card" style={{ borderRadius: 0, padding: 16 }}>
                    <div className="text-xs text-muted" style={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      {kf.label}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-primary)', marginTop: 4 }}>
                      {kf.detail}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Academic Test Standards */}
            <section id="academic-standards" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="yellow" className={styles.sectionBadge}>Section 02</Badge>
                <h2 className={styles.sectionTitle}>{guideData.academicStandards.title}</h2>
                <p className={styles.sectionSubtitle}>{guideData.academicStandards.subtitle}</p>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.comparisonTable}>
                  <thead>
                    <tr>
                      {guideData.academicStandards.columns.map((col, idx) => (
                        <th key={idx}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guideData.academicStandards.rows.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{row.component}</td>
                        <td>{row.specification}</td>
                        <td>{row.competencies}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3. Test Format & Rules */}
            <section id="test-format" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="purple" className={styles.sectionBadge}>Section 03</Badge>
                <h2 className={styles.sectionTitle}>{guideData.formatRules.title}</h2>
                <p className={styles.sectionSubtitle}>{guideData.formatRules.subtitle}</p>
              </div>

              <div className="grid-2" style={{ gap: 16 }}>
                {guideData.formatRules.rules.map((rule, idx) => (
                  <div key={idx} className="card" style={{ borderRadius: 0, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <AlertCircle size={16} style={{ color: 'var(--primary)' }} />
                      <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{rule.title}</strong>
                    </div>
                    <p className="text-sm text-muted" style={{ margin: 0, lineHeight: 1.6 }}>
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. All 14 Question Types */}
            <section id="question-types" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="yellow" className={styles.sectionBadge}>Section 04</Badge>
                <h2 className={styles.sectionTitle}>Mastering All 14 IELTS Reading Question Types</h2>
                <p className={styles.sectionSubtitle}>
                  Step-by-step solving strategies, identification keys, common distractors, and authentic sample questions for every format.
                </p>
              </div>

              {/* Filter & Search Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['All', 'Verification', 'Matching', 'Completion', 'Selection'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedQtType(cat)}
                      style={{
                        borderRadius: 0,
                        backgroundColor: selectedQtType === cat ? '#F6BD28' : '#FFFFFF',
                        color: selectedQtType === cat ? '#202020' : '#4A4A4A',
                        border: selectedQtType === cat ? '1px solid #E5AC1A' : '1px solid var(--border)',
                        fontWeight: selectedQtType === cat ? 700 : 500,
                        padding: '7px 14px',
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div style={{ position: 'relative', width: 240 }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={qtSearch}
                    onChange={(e) => setQtSearch(e.target.value)}
                    placeholder="Search question type..."
                    className="input-field"
                    style={{ paddingLeft: 32, fontSize: '0.84rem', height: 36, borderRadius: 0 }}
                  />
                </div>
              </div>

              {/* Question Type Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {filteredQuestionTypes.map((qt) => (
                  <article key={qt.id} className={styles.questionTypeCard}>
                    <div className={styles.qtHeader}>
                      <div>
                        <span className={styles.qtNumber}>Type {qt.id < 10 ? `0${qt.id}` : qt.id} &bull; {qt.badge}</span>
                        <h3 className={styles.qtTitle}>{qt.name}</h3>
                      </div>
                      <div className={styles.qtBadges}>
                        <Badge variant="neutral">Freq: {qt.frequency}</Badge>
                        <Badge variant={qt.difficulty.includes('High') ? 'purple' : 'yellow'}>
                          Difficulty: {qt.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className={styles.qtGrid}>
                      <div className={styles.qtCol}>
                        <div>
                          <div className={styles.qtLabel}>What It Means &amp; Tests</div>
                          <p className={styles.qtText}>{qt.meaning}</p>
                        </div>
                        <div>
                          <div className={styles.qtLabel}>Identification &amp; Sequence</div>
                          <p className={styles.qtText}>{qt.identification}</p>
                        </div>
                      </div>

                      <div className={styles.qtCol}>
                        <div className={styles.qtLabel}>Step-by-Step Solving Protocol</div>
                        <ol className={styles.qtStepList}>
                          {qt.strategy.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: 14 }}>
                      <div className="card-warm card-compact" style={{ borderRadius: 0, padding: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#b91c1c', marginBottom: 4 }}>
                          &times; Common Pitfalls
                        </div>
                        <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                          {qt.pitfalls}
                        </div>
                      </div>
                      <div className={styles.accordionCardBox}>
                        <button
                          type="button"
                          onClick={() => toggleTip(qt.id)}
                          className={styles.accordionCardToggle}
                          aria-expanded={!!openTips[qt.id]}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#15803d', fontSize: '0.82rem' }}>
                            <Sparkles size={14} color="#15803d" />
                            <span>Expert Pro Tip</span>
                          </span>
                          {openTips[qt.id] ? <ChevronUp size={14} color="#15803d" /> : <ChevronDown size={14} color="#707070" />}
                        </button>

                        {openTips[qt.id] && (
                          <div className={styles.accordionCardContent}>
                            <div style={{ fontSize: '0.82rem', color: '#202020', lineHeight: 1.55 }}>
                              {qt.tips}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive / Static Sample Container */}
                    <div className={styles.qtSampleBox}>
                      <div className={styles.qtSampleTitle}>
                        <BookMarked size={14} /> Authentic Cambridge-Style Sample Question &amp; Verification
                      </div>
                      <div className={styles.qtPassageText}>
                        &ldquo;{qt.samplePassage}&rdquo;
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {qt.sampleQuestion}
                      </div>
                      {qt.sampleOptions && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '4px 0' }}>
                          {qt.sampleOptions.map((opt, oIdx) => (
                            <div key={oIdx} style={{ fontSize: '0.85rem', color: '#202020' }}>
                              &bull; {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ marginTop: 6 }}>
                        <button
                          type="button"
                          onClick={() => toggleAnswer(qt.id)}
                          className={styles.accordionAnswerToggle}
                          aria-expanded={!!openAnswers[qt.id]}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#8867B8', fontSize: '0.84rem' }}>
                            <CheckCircle2 size={14} color="#8867B8" />
                            <span>View Correct Answer &amp; Detailed Explanation</span>
                          </span>
                          {openAnswers[qt.id] ? <ChevronUp size={15} color="#8867B8" /> : <ChevronDown size={15} color="#707070" />}
                        </button>

                        {openAnswers[qt.id] && (
                          <div className={styles.qtAnswerExpl}>
                            <strong style={{ color: '#202020' }}>Correct Answer:</strong> {qt.sampleAnswer}
                            <div style={{ marginTop: 6, color: '#202020', lineHeight: 1.55 }}>
                              <strong>Explanation:</strong> {qt.sampleExplanation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 5. Core Reading Strategies */}
            <section id="strategies" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="purple" className={styles.sectionBadge}>Section 05</Badge>
                <h2 className={styles.sectionTitle}>{guideData.strategies.title}</h2>
                <p className={styles.sectionSubtitle}>{guideData.strategies.subtitle}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {guideData.strategies.list.map((strat) => (
                  <div key={strat.id} className={styles.strategyCard}>
                    <div className={styles.strategyHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h3 className={styles.strategyTitle}>{strat.name}</h3>
                        <Badge variant="yellow">{strat.tag}</Badge>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleStrategyDetail(strat.id)}
                        className={styles.strategyDetailToggleBtn}
                        aria-expanded={!!openStrategyDetails[strat.id]}
                      >
                        <span>{openStrategyDetails[strat.id] ? 'Hide Strategy Details' : 'Expand Strategy Protocol'}</span>
                        {openStrategyDetails[strat.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.94rem', lineHeight: 1.6, color: '#202020', margin: 0 }}>
                      {strat.summary}
                    </p>

                    {openStrategyDetails[strat.id] && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
                        <div className={styles.prosConsGrid}>
                      <div className={styles.proBox}>
                        <div className={styles.boxTitle} style={{ color: '#15803d' }}>
                          <Check size={14} /> Key Advantages
                        </div>
                        <ul className={styles.bulletList}>
                          {strat.pros.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.conBox}>
                        <div className={styles.boxTitle} style={{ color: '#b91c1c' }}>
                          <X size={14} /> Limitations &amp; Risks
                        </div>
                        <ul className={styles.bulletList}>
                          {strat.cons.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="card-warm card-compact" style={{ borderRadius: 0, padding: 12, marginTop: 4, backgroundColor: '#FEF6DD', border: '1px solid rgba(246, 189, 40, 0.45)' }}>
                          <strong style={{ fontSize: '0.84rem', color: '#202020' }}>When to apply: </strong>
                          <span style={{ fontSize: '0.82rem', color: '#333333' }}>{strat.whenToUse}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Micro-skills */}
              <div className="card" style={{ borderRadius: 0, padding: 22 }}>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 14 }}>
                  Four Foundational Micro-Skills for High-Speed Reading
                </h4>
                <div className="grid-2" style={{ gap: 14 }}>
                  {guideData.strategies.microSkills.map((ms) => (
                    <div key={ms.skill} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--primary)' }}>{ms.skill}</strong>
                      <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.55 }}>
                        {ms.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 6. Question Difficulty & Priority */}
            <section id="difficulty-guide" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="yellow" className={styles.sectionBadge}>Section 06</Badge>
                <h2 className={styles.sectionTitle}>{guideData.difficultyGuide.title}</h2>
                <p className={styles.sectionSubtitle}>{guideData.difficultyGuide.subtitle}</p>
              </div>

              <div className="grid-3" style={{ gap: 16 }}>
                {guideData.difficultyGuide.rankings.map((tier) => (
                  <div key={tier.tier} className="card" style={{ borderRadius: 0, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Badge variant={tier.tier.includes('Easy') ? 'neutral' : tier.tier.includes('Medium') ? 'yellow' : 'purple'}>
                      {tier.tier}
                    </Badge>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {tier.types.map((t) => (
                        <span key={t} style={{ fontSize: '0.78rem', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-muted" style={{ lineHeight: 1.55 }}>
                      <strong>Why:</strong> {tier.why}
                    </div>
                    <div className="text-xs text-muted" style={{ lineHeight: 1.55, marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                      <strong>Beginner roadmap:</strong> {tier.beginnerGuidance}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. 60-Minute Time Management */}
            <section id="time-management" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="purple" className={styles.sectionBadge}>Section 07</Badge>
                <h2 className={styles.sectionTitle}>{guideData.timeManagement.title}</h2>
                <p className={styles.sectionSubtitle}>{guideData.timeManagement.subtitle}</p>
              </div>

              <div className={styles.timeGrid}>
                {guideData.timeManagement.breakdown.map((item, idx) => (
                  <div key={idx} className={styles.timeCard}>
                    <div className={styles.timeMinutes}>{item.allocatedMinutes}m</div>
                    <div className={styles.timeLabel}>{item.passage}</div>
                    <div className="text-xs text-muted">{item.questions}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>{item.pacing}</div>
                    <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.5 }}>
                      {item.focus}
                    </p>
                  </div>
                ))}
              </div>

              <div className="card-warm" style={{ borderRadius: 0, padding: 20, backgroundColor: '#FEF6DD', border: '1px solid rgba(246, 189, 40, 0.45)', borderLeft: '4px solid #F6BD28' }}>
                <button
                  type="button"
                  onClick={() => setOpenRoadblock(!openRoadblock)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  aria-expanded={openRoadblock}
                >
                  <strong style={{ fontSize: '1.02rem', color: '#202020' }}>
                    {guideData.timeManagement.roadblockProtocol.title}
                  </strong>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: '#8867B8' }}>
                    <span>{openRoadblock ? 'Collapse' : 'Expand Protocol'}</span>
                    {openRoadblock ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                {openRoadblock && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed rgba(246, 189, 40, 0.5)' }}>
                    <p style={{ fontSize: '0.9rem', color: '#202020', margin: '0 0 8px', lineHeight: 1.6 }}>
                      <strong>Rule:</strong> {guideData.timeManagement.roadblockProtocol.rule}
                    </p>
                    <p style={{ fontSize: '0.88rem', color: '#202020', margin: 0, lineHeight: 1.6 }}>
                      <strong>Action:</strong> {guideData.timeManagement.roadblockProtocol.action}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 8. Scoring Conversion */}
            <section id="scoring" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="yellow" className={styles.sectionBadge}>Section 08</Badge>
                <h2 className={styles.sectionTitle}>{guideData.scoringTables.title}</h2>
                <p className={styles.sectionSubtitle}>{guideData.scoringTables.subtitle}</p>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.comparisonTable}>
                  <thead>
                    <tr>
                      <th>Raw Score (out of 40)</th>
                      <th>IELTS Academic Band Score</th>
                      <th>Proficiency Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guideData.scoringTables.academic.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 800, color: 'var(--primary)', width: '30%' }}>{row.rawScore}</td>
                        <td style={{ fontWeight: 800, color: 'var(--text-primary)', width: '30%' }}>Band {row.band}</td>
                        <td>{row.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 9. Tips & Mistakes */}
            <section id="tips-and-mistakes" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="purple" className={styles.sectionBadge}>Section 09</Badge>
                <h2 className={styles.sectionTitle}>{guideData.tipsAndMistakes.title}</h2>
              </div>

              <div className="grid-2" style={{ gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Check size={16} /> 4 Golden Examination Rules
                  </h4>
                  {guideData.tipsAndMistakes.tips.map((t, idx) => (
                    <div key={idx} className="card" style={{ borderRadius: 0, padding: 16 }}>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{t.title}</strong>
                      <p className="text-xs text-muted" style={{ margin: '4px 0 0', lineHeight: 1.55 }}>
                        {t.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <X size={16} /> 4 Most Frequent Score Killers
                  </h4>
                  {guideData.tipsAndMistakes.mistakes.map((m, idx) => (
                    <div key={idx} className="card" style={{ borderRadius: 0, padding: 16 }}>
                      <strong style={{ fontSize: '0.92rem', color: '#b91c1c' }}>Mistake: {m.mistake}</strong>
                      <p className="text-xs text-muted" style={{ margin: '4px 0 0', lineHeight: 1.55 }}>
                        <strong>Correct approach:</strong> {m.fix}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 10. Sample Interactive Exercises */}
            <section id="interactive-drills" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="yellow" className={styles.sectionBadge}>Section 10</Badge>
                <h2 className={styles.sectionTitle}>Sample Interactive Practice Exercises</h2>
                <p className={styles.sectionSubtitle}>
                  Test your skills directly on the page with three introductory interactive drills. No login required.
                </p>
              </div>

              {/* Drill 1: TFNG */}
              <div className={styles.drillCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <Badge variant="purple">Exercise 1</Badge>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 0' }}>
                      {guideData.interactiveDrills[0].title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetDrill('tfng', ['q1', 'q2', 'q3'])}
                    className="btn btn-ghost btn-xs"
                    style={{ borderRadius: 0 }}
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                </div>

                <div className={styles.drillPassage}>
                  {guideData.interactiveDrills[0].passage}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {guideData.interactiveDrills[0].questions.map((q, idx) => {
                    const selected = drillAnswers[q.qId];
                    const isChecked = drillChecked.tfng;
                    const isCorrect = selected === q.correct;

                    return (
                      <div key={q.qId} className={styles.drillQuestionRow}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                          Statement {idx + 1}: {q.statement}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {q.options.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectDrillOption(q.qId, opt)}
                              className={`${styles.drillOptionBtn} ${selected === opt ? styles.drillOptionBtnSelected : ''}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {isChecked && (
                          <div
                            style={{
                              padding: '8px 12px',
                              background: isCorrect ? 'rgba(46, 125, 50, 0.08)' : 'rgba(198, 40, 40, 0.08)',
                              border: `1px solid ${isCorrect ? 'rgba(46, 125, 50, 0.3)' : 'rgba(198, 40, 40, 0.3)'}`,
                              fontSize: '0.84rem',
                              lineHeight: 1.5,
                            }}
                          >
                            <strong style={{ color: isCorrect ? '#15803d' : '#b91c1c' }}>
                              {isCorrect ? 'Correct!' : `Incorrect (Correct answer: ${q.correct})`}
                            </strong>
                            <div style={{ marginTop: 2, color: '#202020' }}>{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setDrillChecked((prev) => ({ ...prev, tfng: true }))}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', borderRadius: 0 }}
                >
                  Check TFNG Answers
                </button>
              </div>

              {/* Drill 2: Matching Headings */}
              <div className={styles.drillCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <Badge variant="yellow">Exercise 2</Badge>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 0' }}>
                      {guideData.interactiveDrills[1].title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetDrill('headings', ['h1'])}
                    className="btn btn-ghost btn-xs"
                    style={{ borderRadius: 0 }}
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                </div>

                <div className={styles.drillPassage}>
                  {guideData.interactiveDrills[1].passage}
                </div>

                <div className={styles.drillQuestionRow}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    {guideData.interactiveDrills[1].questions[0].statement}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {guideData.interactiveDrills[1].questions[0].options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectDrillOption('h1', opt)}
                        className={`${styles.drillOptionBtn} ${drillAnswers.h1 === opt ? styles.drillOptionBtnSelected : ''}`}
                        style={{ textAlign: 'left' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {drillChecked.headings && (
                    <div
                      style={{
                        padding: '8px 12px',
                        background: drillAnswers.h1 === guideData.interactiveDrills[1].questions[0].correct ? 'rgba(46, 125, 50, 0.08)' : 'rgba(198, 40, 40, 0.08)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <strong>
                        {drillAnswers.h1 === guideData.interactiveDrills[1].questions[0].correct
                          ? 'Correct!'
                          : `Incorrect. Correct heading: ${guideData.interactiveDrills[1].questions[0].correct}`}
                      </strong>
                      <div style={{ marginTop: 2, color: '#202020' }}>
                        {guideData.interactiveDrills[1].questions[0].explanation}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setDrillChecked((prev) => ({ ...prev, headings: true }))}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', borderRadius: 0 }}
                >
                  Check Headings Answer
                </button>
              </div>

              {/* Drill 3: Summary Completion */}
              <div className={styles.drillCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <Badge variant="purple">Exercise 3</Badge>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 0' }}>
                      {guideData.interactiveDrills[2].title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetDrill('summary', ['s1'])}
                    className="btn btn-ghost btn-xs"
                    style={{ borderRadius: 0 }}
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                </div>

                <div className={styles.drillPassage}>
                  {guideData.interactiveDrills[2].passage}
                </div>

                <div className={styles.drillQuestionRow}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    {guideData.interactiveDrills[2].questions[0].statement}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {guideData.interactiveDrills[2].questions[0].options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectDrillOption('s1', opt)}
                        className={`${styles.drillOptionBtn} ${drillAnswers.s1 === opt ? styles.drillOptionBtnSelected : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {drillChecked.summary && (
                    <div
                      style={{
                        padding: '8px 12px',
                        background: drillAnswers.s1 === guideData.interactiveDrills[2].questions[0].correct ? 'rgba(46, 125, 50, 0.08)' : 'rgba(198, 40, 40, 0.08)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <strong>
                        {drillAnswers.s1 === guideData.interactiveDrills[2].questions[0].correct
                          ? 'Correct!'
                          : `Incorrect. Correct answer: ${guideData.interactiveDrills[2].questions[0].correct}`}
                      </strong>
                      <div style={{ marginTop: 2, color: '#202020' }}>
                        {guideData.interactiveDrills[2].questions[0].explanation}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setDrillChecked((prev) => ({ ...prev, summary: true }))}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', borderRadius: 0 }}
                >
                  Check Summary Answer
                </button>
              </div>
            </section>

            {/* 11. Cambridge Books 9–25 Library Preview */}
            <section id="cambridge-library" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="purple" className={styles.sectionBadge}>Section 11</Badge>
                <h2 className={styles.sectionTitle}>Cambridge IELTS Academic Reading Test Library (Books 9–25)</h2>
                <p className={styles.sectionSubtitle}>
                  52 authentic Academic Reading tests across 13 published Cambridge volumes (Books 9–21) plus syllabus previews for forthcoming editions (Books 22–25).
                </p>
              </div>

              <div className={styles.bookGrid}>
                {cambridgeBooks.map((book) => (
                  <div key={book.bookNumber} className={styles.bookCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge variant={book.isForthcoming ? 'yellow' : 'purple'}>
                        {book.status}
                      </Badge>
                      <span className="text-xs text-muted">{book.year}</span>
                    </div>

                    <h4 className={styles.bookTitle}>Book {book.bookNumber}: {book.title}</h4>

                    <div className={styles.bookMetaRow}>
                      <span>{book.testCount} Tests ({book.passagesCount} Passages)</span>
                      <span>{book.questionCount} Questions</span>
                    </div>

                    <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.5 }}>
                      {book.overview.slice(0, 110)}...
                    </p>

                    <button
                      type="button"
                      onClick={handlePracticeCta}
                      className="btn btn-sm"
                      style={{ marginTop: 'auto', borderRadius: 0, justifyContent: 'center', backgroundColor: "#F6BD28", color: "#202020", border: "1px solid #E5AC1A", fontWeight: 700 }}
                    >
                      {book.isForthcoming ? 'View Syllabus' : 'Practice in Dashboard'} &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* 12. FAQs */}
            <section id="faqs" className={styles.guideSection}>
              <div className={styles.sectionHeader}>
                <Badge variant="yellow" className={styles.sectionBadge}>Section 12</Badge>
                <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                <p className={styles.sectionSubtitle}>
                  Essential answers to critical questions about exam pacing, capitalization, spelling, and scoring rubrics.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {guideData.faqs.map((faq, idx) => (
                  <div key={idx} className="card" style={{ borderRadius: 0, padding: 20 }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <HelpCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} /> {faq.q}
                    </strong>
                    <p style={{ margin: '8px 0 0', fontSize: '0.92rem', color: '#202020', lineHeight: 1.6 }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom CTA Banner */}
              <div
                className="card-dark"
                style={{
                  borderRadius: 0,
                  padding: 36,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  alignItems: 'center',
                  textAlign: 'center',
                  marginTop: 24,
                }}
              >
                <Badge variant="yellow">Ready to Start?</Badge>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#faf9f5', margin: 0 }}>
                  Take Your First Timed Cambridge Reading Test
                </h3>
                <p style={{ maxWidth: 640, color: 'rgba(250, 249, 245, 0.8)', fontSize: '0.96rem', margin: 0 }}>
                  Practice with the full Cambridge Books 9–25 library, instant band conversion, split-screen passage navigation, and official IELTS rubrics.
                </p>
                <button
                  type="button"
                  onClick={handlePracticeCta}
                  className="btn btn-primary btn-lg"
                  style={{ borderRadius: 0, marginTop: 8 }}
                >
                  Launch Dashboard Reading Library <ArrowRight size={16} />
                </button>
              </div>
            </section>
          </main>

          {/* Right Sticky Table of Contents Column */}
          <aside className={styles.tocColumn}>
            <div className={styles.tocCard}>
              <div className={styles.tocHeader}>
                <span className={styles.tocTitle}>Table of Contents</span>
                <span className="text-xs text-muted">12 Sections</span>
              </div>

              <ul className={styles.tocList}>
                {guideData.tableOfContents.map((item) => (
                  <li key={item.id} className={styles.tocItem}>
                    <a
                      href={`#${item.id}`}
                      className={`${styles.tocLink} ${activeTocId === item.id ? styles.tocLinkActive : ''}`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className={styles.tocCta}>
                <button
                  type="button"
                  onClick={handlePracticeCta}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 0, width: '100%', justifyContent: 'center' }}
                >
                  Start Practice Test &rarr;
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

