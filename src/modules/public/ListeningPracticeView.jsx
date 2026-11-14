'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Headphones,
  Play,
  Pause,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Layers,
  Globe,
  AlertTriangle,
  Award,
  BookOpen,
  Volume2,
  FileText,
  List,
  Sparkles,
  Lock,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import listeningData from '@/data/public/listening-guide.json';
import styles from './ListeningPractice.module.css';

export function ListeningPracticeView() {
  const router = useRouter();
  const app = useApp?.() || {};
  const auth = app.auth || { isAuthenticated: false };

  // Table of Contents & Scrollspy
  const [activeToc, setActiveToc] = useState('overview');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Mock Test Library State
  const [selectedTab, setSelectedTab] = useState('all'); // 'all' | 1 | 2 | 3 | 4
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  // Core Strategy Accordion State (independent per question type, collapsed by default)
  const [openStrategies, setOpenStrategies] = useState({});
  const toggleStrategy = (id) => {
    setOpenStrategies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // FAQs Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Drill 1 State (Section 1 Form)
  const [drill1Answers, setDrill1Answers] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [drill1Submitted, setDrill1Submitted] = useState(false);
  const [drill1Playing, setDrill1Playing] = useState(false);
  const [drill1Transcript, setDrill1Transcript] = useState(false);
  const drill1AudioTimerRef = useRef(null);

  // Interactive Drill 2 State (Section 3 Distractor Trap)
  const [drill2Selected, setDrill2Selected] = useState('');
  const [drill2Submitted, setDrill2Submitted] = useState(false);
  const [drill2Playing, setDrill2Playing] = useState(false);
  const [drill2Transcript, setDrill2Transcript] = useState(false);
  const drill2AudioTimerRef = useRef(null);

  // IntersectionObserver for TOC highlight
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = listeningData.toc.map((item) => item.id);
      const scrollPosition = window.scrollY + 120;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveToc(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveToc(id);
      setMobileTocOpen(false);
    }
  };

  // Auth routing logic: Redirect to login or go straight to protected module
  const handleProtectedPractice = (targetPath = '/listening') => {
    if (auth.isAuthenticated) {
      router.push(targetPath);
    } else {
      router.push(`/login?next=${encodeURIComponent(targetPath)}`);
    }
  };

  // Filtered Mock Tests
  const filteredTests = useMemo(() => {
    return listeningData.mockTests.filter((test) => {
      const matchTab = selectedTab === 'all' || test.section === selectedTab;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        test.title.toLowerCase().includes(q) ||
        test.accent.toLowerCase().includes(q) ||
        test.context.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [selectedTab, searchQuery]);

  // Audio simulation handlers for client-side drills
  const toggleDrill1Audio = () => {
    if (drill1Playing) {
      setDrill1Playing(false);
      if (drill1AudioTimerRef.current) clearTimeout(drill1AudioTimerRef.current);
    } else {
      setDrill1Playing(true);
      drill1AudioTimerRef.current = setTimeout(() => {
        setDrill1Playing(false);
      }, 14000);
    }
  };

  const toggleDrill2Audio = () => {
    if (drill2Playing) {
      setDrill2Playing(false);
      if (drill2AudioTimerRef.current) clearTimeout(drill2AudioTimerRef.current);
    } else {
      setDrill2Playing(true);
      drill2AudioTimerRef.current = setTimeout(() => {
        setDrill2Playing(false);
      }, 16000);
    }
  };

  useEffect(() => {
    return () => {
      if (drill1AudioTimerRef.current) clearTimeout(drill1AudioTimerRef.current);
      if (drill2AudioTimerRef.current) clearTimeout(drill2AudioTimerRef.current);
    };
  }, []);

  const checkDrill1 = () => {
    setDrill1Submitted(true);
  };

  const resetDrill1 = () => {
    setDrill1Answers({ q1: '', q2: '', q3: '', q4: '' });
    setDrill1Submitted(false);
  };

  const checkDrill2 = () => {
    setDrill2Submitted(true);
  };

  const resetDrill2 = () => {
    setDrill2Selected('');
    setDrill2Submitted(false);
  };

  return (
    <div style={{ background: '#FAF9F5', minHeight: '100vh', paddingTop: 20 }}>
      <div className={styles.container}>
        {/* Mobile / Tablet Sticky Collapsible Table of Contents Bar */}
        <div className={styles.mobileTocStickyWrapper}>
          <button
            type="button"
            className={styles.mobileTocToggle}
            onClick={() => setMobileTocOpen((prev) => !prev)}
            aria-expanded={mobileTocOpen}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <List size={16} color="#8867B8" />
              <span>Table of Contents ({listeningData.toc.length} Sections)</span>
            </span>
            {mobileTocOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {mobileTocOpen && (
            <div className={styles.mobileTocDrawer}>
              {listeningData.toc.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.tocNavLink} ${activeToc === item.id ? styles.tocNavLinkActive : ''}`}
                  onClick={() => handleScrollTo(item.id)}
                >
                  <span>{item.label}</span>
                  {activeToc === item.id && <span style={{ fontSize: '0.7rem' }}>●</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 1. HERO SECTION (Overview & Metrics) - Completely Transparent over #FAF9F5 */}
        <section id="overview" className={`${styles.contentSection} ${styles.heroBanner}`}>
          <div className={styles.heroLeft}>
            <div className={styles.badgeRow}>
              <span className={styles.sectionIndicatorBadge} style={{ marginBottom: 0 }}>
                <Headphones size={13} />
                IELTS Academic
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#4A4A4A',
                  background: '#FFFFFF',
                  padding: '4px 10px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                Cambridge Calibrated
              </span>
            </div>

            <h1 className={styles.heroHeading}>
              Master IELTS Academic <span style={{ color: '#8867B8' }}>Listening</span>
            </h1>

            <p className={styles.heroSubtext}>
              Practice with 52 authentic Cambridge-calibrated mock tests, master audio distractors across British, Australian, and North American accents, and train under real examination conditions.
            </p>

            {/* 4 Stats Grid - Soft Highlight Tiles */}
            <div className={styles.statsBar}>
              {listeningData.hero.stats.map((s, idx) => (
                <div key={idx} className={styles.statItem}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                  <span className={styles.statDesc}>{s.desc}</span>
                </div>
              ))}
            </div>

            {/* Primary & Secondary CTAs */}
            <div className={styles.heroCtaRow}>
              <button
                type="button"
                onClick={() => handleProtectedPractice(listeningData.hero.primaryCta.target)}
                className={styles.heroPrimaryBtn}
              >
                <span>{listeningData.hero.primaryCta.label}</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('mock-tests')}
                className={styles.heroSecondaryBtn}
              >
                <span>Explore Mock Tests</span>
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* Right Hero Visual - Large Transparent AI-Generated Illustration */}
          <div className={styles.heroRight}>
            <Image
              src="/images/hero/ielts-listening-hero.png"
              alt="IELTS Academic Listening Preparation Illustration"
              width={540}
              height={420}
              className={styles.heroTransparentImg}
              priority
            />
          </div>
        </section>

        {/* 2-Column Desktop Layout */}
        <div className={styles.layoutGrid} style={{ marginTop: 28 }}>
          {/* Main Content Column */}
          <main className={styles.mainColumn}>
            {/* 2. MOCK TEST LIBRARY (52 TESTS) */}
            <section id="mock-tests" className={styles.contentSection}>
              <div className={styles.testLibraryHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <span className={styles.sectionIndicatorBadge}>52 NUMBERED MOCK TESTS</span>
                    <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                      IELTS Listening Mock Test Library
                    </h2>
                    <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                      Choose from 52 authentic mock test sets partitioned across Section 1, 2, 3, and 4. All cards connect directly to your protected student practice environment.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProtectedPractice('/listening')}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 0, fontWeight: 700 }}
                  >
                    <Lock size={13} />
                    <span>Open Dashboard Hub</span>
                  </button>
                </div>

                {/* Section Tabs */}
                <div className={styles.tabControls}>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedTab === 'all' ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedTab('all'); setVisibleCount(10); }}
                  >
                    All 52 Mock Tests
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedTab === 1 ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedTab(1); setVisibleCount(10); }}
                  >
                    Section 1: Everyday Dialogue (13)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedTab === 2 ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedTab(2); setVisibleCount(10); }}
                  >
                    Section 2: Social Monologue (13)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedTab === 3 ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedTab(3); setVisibleCount(10); }}
                  >
                    Section 3: Academic Discussion (13)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedTab === 4 ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedTab(4); setVisibleCount(10); }}
                  >
                    Section 4: Academic Lecture (13)
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div className={styles.searchFilterRow}>
                  <div className={styles.searchBox}>
                    <Search size={16} color="#707070" />
                    <input
                      type="text"
                      placeholder="Search mock tests by topic, accent, or context..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={styles.searchInput}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#888' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <span className={styles.testCountLabel}>
                    Showing {Math.min(visibleCount, filteredTests.length)} of {filteredTests.length} tests
                  </span>
                </div>
              </div>

              {/* Mock Test Cards Grid - #FEF6DD Branded Cards */}
              <div className={styles.testCardsGrid}>
                {filteredTests.slice(0, visibleCount).map((test) => (
                  <div key={test.id} className={styles.testCard}>
                    <div>
                      <div className={styles.testCardHeader}>
                        <span className={styles.testNumberBadge}>Mock Test {test.padNumber}</span>
                        {/* Accent label in #8867B8 text only with transparent background */}
                        <span className={styles.testAccentTag}>
                          {test.accent}
                        </span>
                      </div>

                      <h3 className={styles.testCardTitle} style={{ marginTop: 10 }}>
                        {test.title}
                      </h3>
                    </div>

                    <div>
                      <div className={styles.testMetaRow} style={{ marginBottom: 12 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={13} color="#8867B8" />
                          <span style={{ fontWeight: 600 }}>30 Mins</span>
                        </span>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: test.section === 1 ? '#047857' : test.section === 2 ? '#B45309' : test.section === 3 ? '#4338CA' : '#7C2D12',
                          }}
                        >
                          Section {test.section}
                        </span>
                      </div>

                      <div className={styles.testCardFooter}>
                        <button
                          type="button"
                          onClick={() => handleProtectedPractice(test.dashboardPath)}
                          className={styles.testPracticeBtn}
                        >
                          <span>Practice Test</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progressive Loading: 10 at a time */}
              {visibleCount < filteredTests.length && (
                <div className={styles.paginationRow}>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 10, filteredTests.length))}
                    className="btn btn-primary"
                    style={{ minWidth: 240, borderRadius: 0, backgroundColor: '#F6BD28', color: '#202020', border: '1px solid #E5AC1A', fontWeight: 700 }}
                  >
                    Load More Mock Tests ({filteredTests.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </section>

            {/* 3. OFFICIAL EXAMINATION REGULATIONS */}
            <section id="test-format" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>OFFICIAL EXAMINATION REGULATIONS</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  IELTS Listening Examination Format & Rules
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  {listeningData.formatRules.summary}
                </p>
              </div>

              <div className={styles.formatGrid}>
                {listeningData.formatRules.cards.map((card, idx) => (
                  <div key={idx} className={styles.formatCard}>
                    <div className={styles.formatCardTop}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className={styles.formatIconBox}>
                          {idx === 0 && <Layers size={24} color="#8867B8" />}
                          {idx === 1 && <Clock size={24} color="#B45309" />}
                          {idx === 2 && <Globe size={24} color="#047857" />}
                          {idx === 3 && <AlertTriangle size={24} color="#DC2626" />}
                        </div>
                        <h3 className={styles.formatCardTitle}>{card.title}</h3>
                      </div>
                      <span className={styles.sectionIndicatorBadge} style={{ marginBottom: 0, fontSize: '0.7rem' }}>
                        {card.badge}
                      </span>
                    </div>

                    <ul className={styles.formatPointsList}>
                      {card.points.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. FOUR LISTENING SECTIONS EXPLAINED */}
            <section id="four-sections" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>FOUR LISTENING SECTIONS EXPLAINED</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  The Four Listening Sections Explained
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Each of the four listening parts presents distinct conversational dynamics, vocabulary demands, and testing purposes.
                </p>
              </div>

              <div className={styles.sectionsStack}>
                {listeningData.fourSections.map((sec) => (
                  <div key={sec.section} className={styles.sectionExplainCard}>
                    <div className={styles.sectionMetaBox}>
                      <span className={styles.sectionNumberBadge}>0{sec.section}</span>
                      <strong style={{ fontSize: '0.98rem', color: '#202020' }}>
                        {sec.speakers}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#4A4A4A', fontWeight: 600 }}>10 Questions</span>
                    </div>

                    <div className={styles.sectionDetailBody}>
                      <h3 className={styles.sectionDetailTitle}>{sec.title}</h3>
                      <p style={{ color: '#202020', margin: 0, fontSize: '0.92rem', lineHeight: 1.55 }}>
                        {sec.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.86rem', color: '#202020' }}>
                        <div><strong>Typical Context:</strong> {sec.context}</div>
                        <div><strong>Common Question Formats:</strong> {sec.typicalQuestions.join(', ')}</div>
                        <div><strong>Key Test Focus:</strong> {sec.keyFocus}</div>
                      </div>

                      <div className={styles.tipCallout}>
                        <strong>Candidate Strategy Tip:</strong> {sec.expertTip}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. COMPLETE QUESTION TYPE SYLLABUS - Accordion for Core Strategy */}
            <section id="question-types" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>COMPLETE QUESTION TYPE SYLLABUS</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  9 IELTS Listening Question Formats
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Master the specific answering strategy and distractor avoidance technique required for each of the 9 official question types.
                </p>
              </div>

              <div className={styles.qTypesGrid}>
                {listeningData.questionTypes.map((q) => (
                  <div key={q.id} className={styles.qTypeCard}>
                    <div className={styles.qTypeHeader}>
                      <h3 className={styles.qTypeName}>{q.name}</h3>
                      <span className={styles.qTypeFormatTag}>{q.id}</span>
                    </div>

                    <p className={styles.qTypeDesc}>{q.description}</p>

                    <div style={{ fontSize: '0.84rem', color: '#202020', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div><strong>Format:</strong> {q.format}</div>
                      <div><strong>Mechanism:</strong> {q.howItWorks}</div>
                    </div>

                    {/* Core Strategy Accordion Toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleStrategy(q.id)}
                        className={styles.strategyAccordionToggle}
                        aria-expanded={!!openStrategies[q.id]}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#8867B8' }}>
                          <Sparkles size={14} color="#8867B8" />
                          <span>Core Strategy &amp; Pitfalls</span>
                        </span>
                        {openStrategies[q.id] ? (
                          <ChevronUp size={15} color="#8867B8" />
                        ) : (
                          <ChevronDown size={15} color="#707070" />
                        )}
                      </button>

                      {openStrategies[q.id] && (
                        <div className={styles.strategyAccordionContent}>
                          <div style={{ fontWeight: 700, color: '#8867B8', marginBottom: 4 }}>
                            ✓ Strategy:
                          </div>
                          <div>{q.strategy}</div>
                          <div style={{ marginTop: 8, color: '#DC2626', fontWeight: 600 }}>
                            ⚠ Common Trap: {q.commonPitfall}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. SCORE AND BAND SCORE CONVERSION - Clean 3-Column Layout */}
            <section id="scoring-band" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>SCORE &amp; BAND SCORE CONVERSION</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  IELTS Listening Raw Score to Band Conversion
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Each of the 40 questions carries exactly 1 mark. There is no negative marking for incorrect answers.
                </p>
              </div>

              <div className={styles.scoringContainer}>
                <table className={styles.scoringTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}>Raw Score (out of 40)</th>
                      <th style={{ width: '30%' }}>IELTS Band Score</th>
                      <th style={{ width: '40%' }}>Candidate Skill Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listeningData.scoringTable.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700, fontSize: '1.05rem', color: '#202020' }}>{row.raw}</td>
                        <td className={styles.bandCell}>Band {row.band}</td>
                        <td style={{ fontWeight: 600, color: '#202020', fontSize: '0.92rem' }}>{row.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.scoringNotice}>
                  <strong>Note on Test Scaling:</strong> Official Cambridge conversion curves may fluctuate slightly (±1 mark) depending on the statistical difficulty of a specific examination version. Aim for at least 32 correct answers to secure a dependable Band 7.5+.
                </div>
              </div>
            </section>

            {/* 7. OFFICIAL FREE RESOURCES (No Promotional "Verified Practice Portal" label) */}
            <section id="free-resources" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>OFFICIAL EDUCATIONAL RESOURCES</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  Official Free Practice Resources
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Access authentic listening papers, audio samples, and accent training podcasts directly from official testing bodies and premier language archives.
                </p>
              </div>

              <div className={styles.resourcesGrid}>
                {listeningData.freeResources.map((res, idx) => (
                  <div key={idx} className={styles.resourceCard}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span className={styles.sectionIndicatorBadge} style={{ marginBottom: 0, fontSize: '0.68rem' }}>
                          {res.type}
                        </span>
                        <span className={styles.resourceProvider}>{res.provider}</span>
                      </div>

                      <h3 className={styles.resourceCardTitle}>{res.title}</h3>
                      <p className={styles.resourceDesc} style={{ marginTop: 8 }}>{res.description}</p>
                    </div>

                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, borderRadius: 0, fontWeight: 700 }}
                    >
                      <span>Access Resource</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. INTERACTIVE PRACTICE MINI-DRILLS */}
            <section id="interactive-drill" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>INTERACTIVE LISTENING PRACTICE</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  Interactive Listening Practice Mini-Drills
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Test your active listening and distractor detection skills with two instant client-side practice exercises.
                </p>
              </div>

              <div className={styles.interactiveStack}>
                {/* Drill 1: Section 1 Form */}
                <div className={styles.interactiveCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <span className={styles.sectionIndicatorBadge}>Drill 1 • Section 1</span>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 700, margin: '6px 0 2px 0', color: '#202020' }}>
                        {listeningData.interactiveDrills[0].title}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: '#4A4A4A' }}>
                        {listeningData.interactiveDrills[0].instruction}
                      </p>
                    </div>

                    {drill1Submitted && (
                      <button type="button" onClick={resetDrill1} className="btn btn-outline btn-sm" style={{ borderRadius: 0 }}>
                        Reset Exercise
                      </button>
                    )}
                  </div>

                  {/* Audio Bar */}
                  <div className={styles.drillAudioBar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <button
                        type="button"
                        onClick={toggleDrill1Audio}
                        className={styles.audioPlayBtn}
                      >
                        {drill1Playing ? <Pause size={14} /> : <Play size={14} />}
                        <span>{drill1Playing ? 'Playing Audio...' : 'Play Simulated Audio'}</span>
                      </button>

                      {drill1Playing && (
                        <div className={styles.audioWaveform}>
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.1s' }} />
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.3s' }} />
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.2s' }} />
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.4s' }} />
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.15s' }} />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setDrill1Transcript((prev) => !prev)}
                      className={styles.transcriptToggleBtn}
                    >
                      {drill1Transcript ? 'Hide Audio Transcript' : 'View Audio Transcript'}
                    </button>
                  </div>

                  {drill1Transcript && (
                    <div className={styles.transcriptBox}>
                      <strong style={{ color: '#202020' }}>Audio Recording Script:</strong>
                      <p style={{ margin: '8px 0 0 0', color: '#202020' }}>{listeningData.interactiveDrills[0].audioTranscript}</p>
                    </div>
                  )}

                  {/* Input Fields */}
                  <div className={styles.drillFormGrid}>
                    {listeningData.interactiveDrills[0].questions.map((q) => {
                      const userVal = drill1Answers[q.id]?.trim().toLowerCase() || '';
                      const isCorrect = q.correctAnswers.some((ans) => userVal === ans.toLowerCase());

                      return (
                        <div key={q.id} className={styles.drillFieldBox}>
                          <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#202020' }}>{q.label}</label>
                          <input
                            type="text"
                            placeholder="Type your answer here..."
                            value={drill1Answers[q.id] || ''}
                            onChange={(e) =>
                              setDrill1Answers((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            disabled={drill1Submitted}
                            className={`${styles.drillInput} ${drill1Submitted
                                ? isCorrect
                                  ? styles.drillInputCorrect
                                  : styles.drillInputIncorrect
                                : ''
                              }`}
                          />
                          {drill1Submitted && (
                            <div style={{ fontSize: '0.8rem', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                              {isCorrect ? (
                                <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                                  <CheckCircle2 size={13} /> Correct! ({q.explanation})
                                </span>
                              ) : (
                                <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                                  <XCircle size={13} /> Accepted: &quot;{q.correctAnswers[0]}&quot; — {q.explanation}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className={styles.drillFeedbackRow}>
                    {!drill1Submitted ? (
                      <button
                        type="button"
                        onClick={checkDrill1}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: '#F6BD28', color: '#202020', border: '1px solid #E5AC1A', fontWeight: 700, borderRadius: 0 }}
                      >
                        Check My Answers
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={styles.sectionIndicatorBadge} style={{ marginBottom: 0, fontSize: '0.82rem' }}>
                          Score: {
                            listeningData.interactiveDrills[0].questions.filter((q) =>
                              q.correctAnswers.some((ans) => (drill1Answers[q.id] || '').trim().toLowerCase() === ans.toLowerCase())
                            ).length
                          } / 4
                        </span>
                        <span style={{ fontSize: '0.88rem', color: '#202020', fontWeight: 600 }}>
                          {listeningData.interactiveDrills[0].questions.every((q) =>
                            q.correctAnswers.some((ans) => (drill1Answers[q.id] || '').trim().toLowerCase() === ans.toLowerCase())
                          )
                            ? 'Outstanding precision!'
                            : 'Review the accepted spellings above.'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drill 2: Section 3 Distractor Trap */}
                <div className={styles.interactiveCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <span className={styles.sectionIndicatorBadge}>Drill 2 • Section 3 Multiple Choice</span>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 700, margin: '6px 0 2px 0', color: '#202020' }}>
                        {listeningData.interactiveDrills[1].title}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: '#4A4A4A' }}>
                        {listeningData.interactiveDrills[1].instruction}
                      </p>
                    </div>

                    {drill2Submitted && (
                      <button type="button" onClick={resetDrill2} className="btn btn-outline btn-sm" style={{ borderRadius: 0 }}>
                        Reset Exercise
                      </button>
                    )}
                  </div>

                  {/* Audio Bar */}
                  <div className={styles.drillAudioBar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <button
                        type="button"
                        onClick={toggleDrill2Audio}
                        className={styles.audioPlayBtn}
                      >
                        {drill2Playing ? <Pause size={14} /> : <Play size={14} />}
                        <span>{drill2Playing ? 'Playing Audio...' : 'Play Simulated Audio'}</span>
                      </button>

                      {drill2Playing && (
                        <div className={styles.audioWaveform}>
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.1s' }} />
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.3s' }} />
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.2s' }} />
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.4s' }} />
                          <div className={styles.audioWaveBar} style={{ animationDelay: '0.15s' }} />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setDrill2Transcript((prev) => !prev)}
                      className={styles.transcriptToggleBtn}
                    >
                      {drill2Transcript ? 'Hide Audio Transcript' : 'View Audio Transcript'}
                    </button>
                  </div>

                  {drill2Transcript && (
                    <div className={styles.transcriptBox}>
                      <strong style={{ color: '#202020' }}>Audio Recording Script:</strong>
                      <p style={{ margin: '8px 0 0 0', color: '#202020' }}>{listeningData.interactiveDrills[1].audioTranscript}</p>
                    </div>
                  )}

                  {/* Question Radio Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: '0.96rem', fontWeight: 700, margin: 0, color: '#202020' }}>
                      {listeningData.interactiveDrills[1].question.text}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {listeningData.interactiveDrills[1].question.options.map((opt) => (
                        <label
                          key={opt.letter}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 14px',
                            background: drill2Selected === opt.letter ? '#F1E8FF' : '#FFFFFF',
                            border: `1px solid ${drill2Selected === opt.letter ? '#8867B8' : '#E2DDD1'}`,
                            cursor: drill2Submitted ? 'default' : 'pointer',
                            fontSize: '0.9rem',
                            color: '#202020',
                          }}
                        >
                          <input
                            type="radio"
                            name="drill2"
                            value={opt.letter}
                            checked={drill2Selected === opt.letter}
                            onChange={() => !drill2Submitted && setDrill2Selected(opt.letter)}
                            disabled={drill2Submitted}
                          />
                          <span style={{ fontWeight: 800, color: '#8867B8' }}>
                            {opt.letter}.
                          </span>
                          <span style={{ fontWeight: drill2Selected === opt.letter ? 600 : 400 }}>{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Evaluation */}
                  <div className={styles.drillFeedbackRow}>
                    {!drill2Submitted ? (
                      <button
                        type="button"
                        onClick={checkDrill2}
                        disabled={!drill2Selected}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: '#F6BD28', color: '#202020', border: '1px solid #E5AC1A', fontWeight: 700, borderRadius: 0 }}
                      >
                        Check Multiple Choice Answer
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                          {drill2Selected === listeningData.interactiveDrills[1].question.correctOption ? (
                            <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle2 size={16} /> Correct! Option B is the actual depth chosen.
                            </span>
                          ) : (
                            <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <XCircle size={16} /> Incorrect. Option B is correct.
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.86rem', color: '#202020', margin: 0, lineHeight: 1.55 }}>
                          <strong>Distractor Breakdown:</strong> {listeningData.interactiveDrills[1].question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 9. FAQS */}
            <section id="faqs" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>FREQUENTLY ASKED QUESTIONS</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  IELTS Listening FAQs
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Essential answers to the most common candidate questions regarding accents, scoring penalties, and test-day mechanics.
                </p>
              </div>

              <div className={styles.faqStack}>
                {listeningData.faqs.map((faq, idx) => (
                  <div key={idx} className={styles.faqItem}>
                    <button
                      type="button"
                      className={styles.faqQuestionBtn}
                      onClick={() => setOpenFaq((prev) => (prev === idx ? -1 : idx))}
                      aria-expanded={openFaq === idx}
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? (
                        <ChevronUp size={16} color="#8867B8" />
                      ) : (
                        <ChevronDown size={16} color="#707070" />
                      )}
                    </button>

                    {openFaq === idx && (
                      <div className={styles.faqAnswerBox}>
                        <p style={{ margin: 0, color: '#202020' }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* BOTTOM CALL TO ACTION BANNER */}
            <div className={styles.bottomCtaBanner}>
              <div className={styles.bottomCtaText}>
                <span className={styles.sectionIndicatorBadge} style={{ alignSelf: 'flex-start', marginBottom: 0 }}>
                  Start Your Practice Today
                </span>
                <h2 className={styles.bottomCtaHeading}>Ready to Achieve Band 8.0+ in IELTS Listening?</h2>
                <p className={styles.bottomCtaDesc}>
                  Access our full suite of 52 timed exam simulations with instant automated marking, synchronized audio transcripts, and customized mistake review logs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleProtectedPractice('/listening')}
                className="btn btn-primary"
                style={{
                  background: '#F6BD28',
                  color: '#202020',
                  borderColor: '#E5AC1A',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 0,
                }}
              >
                <span>Launch Listening Practice Hub</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </main>

          {/* Sticky Right-Side Table of Contents (Desktop) */}
          <aside className={styles.tocSidebar} aria-label="Table of Contents">
            <div className={styles.tocHeader}>
              <span className={styles.tocTitle}>
                <List size={14} color="#8867B8" />
                <span>On This Page</span>
              </span>
              <span className={styles.tocCountBadge}>
                {listeningData.toc.length} Sections
              </span>
            </div>

            <nav>
              <ul className={styles.tocNavList}>
                {listeningData.toc.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`${styles.tocNavLink} ${activeToc === item.id ? styles.tocNavLinkActive : ''}`}
                      onClick={() => handleScrollTo(item.id)}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                      {activeToc === item.id && (
                        <span style={{ fontSize: '0.7rem', color: '#8867B8' }}>●</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-color, #E2DDD1)' }}>
              <button
                type="button"
                onClick={() => handleProtectedPractice('/listening')}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 0, backgroundColor: '#F6BD28', color: '#202020', border: '1px solid #E5AC1A', fontWeight: 700 }}
              >
                <Headphones size={14} />
                <span>Practice Now</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
