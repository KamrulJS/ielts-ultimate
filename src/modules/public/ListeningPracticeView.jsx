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
  Sliders,
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
  const [visibleCount, setVisibleCount] = useState(52);

  // Question Types Expandable
  const [expandedQType, setExpandedQType] = useState('multiple-choice');

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
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveToc(id);
      setMobileTocOpen(false);
    }
  };

  // Auth routing logic: Redirect to login or go straight to protected module
  const handleProtectedPractice = (targetPath = '/listening') => {
    if (auth?.isAuthenticated) {
      router.push(targetPath);
    } else {
      router.push(`/login?next=${encodeURIComponent(targetPath)}`);
    }
  };

  // Filtered mock tests
  const filteredTests = useMemo(() => {
    return listeningData.mockTests.filter((test) => {
      const matchesSection = selectedTab === 'all' || test.section === Number(selectedTab);
      const matchesSearch =
        searchQuery.trim() === '' ||
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.accent.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSection && matchesSearch;
    });
  }, [selectedTab, searchQuery]);

  // Audio simulation synthesizer tone
  const playSynthesizedVoiceCue = (isDrill1 = true) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isDrill1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(isDrill1 ? 440 : 523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isDrill1 ? 880 : 659.25, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // AudioContext not allowed before user interaction
    }
  };

  const toggleDrill1Audio = () => {
    if (drill1Playing) {
      setDrill1Playing(false);
      if (drill1AudioTimerRef.current) clearTimeout(drill1AudioTimerRef.current);
    } else {
      setDrill1Playing(true);
      playSynthesizedVoiceCue(true);
      drill1AudioTimerRef.current = setTimeout(() => {
        setDrill1Playing(false);
      }, 15000);
    }
  };

  const toggleDrill2Audio = () => {
    if (drill2Playing) {
      setDrill2Playing(false);
      if (drill2AudioTimerRef.current) clearTimeout(drill2AudioTimerRef.current);
    } else {
      setDrill2Playing(true);
      playSynthesizedVoiceCue(false);
      drill2AudioTimerRef.current = setTimeout(() => {
        setDrill2Playing(false);
      }, 12000);
    }
  };

  // Evaluation for Drill 1
  const checkDrill1 = () => {
    setDrill1Submitted(true);
  };

  const resetDrill1 = () => {
    setDrill1Answers({ q1: '', q2: '', q3: '', q4: '' });
    setDrill1Submitted(false);
  };

  // Evaluation for Drill 2
  const checkDrill2 = () => {
    setDrill2Submitted(true);
  };

  const resetDrill2 = () => {
    setDrill2Selected('');
    setDrill2Submitted(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Mobile / Tablet Collapsible Table of Contents Bar */}
        <button
          type="button"
          className={styles.mobileTocToggle}
          onClick={() => setMobileTocOpen((prev) => !prev)}
          aria-expanded={mobileTocOpen}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <List size={16} color="var(--accent-purple, #8867B8)" />
            <span>Table of Contents ({listeningData.toc.find((t) => t.id === activeToc)?.label || 'Menu'})</span>
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

        {/* 2-Column Desktop Layout */}
        <div className={styles.layoutGrid}>
          {/* Main Content Column */}
          <main className={styles.mainColumn}>
            {/* SECTION A: HERO BANNER (Overview) */}
            <section id="overview" className={`${styles.contentSection} ${styles.heroBanner}`}>
              <div className={styles.heroLeft}>
                <div className={styles.badgeRow}>
                  <span className="badge badge-yellow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Headphones size={13} />
                    {listeningData.hero.categoryBadge}
                  </span>
                  <span className="badge badge-neutral">Calibrated to Cambridge Rubrics</span>
                </div>

                <h1 className={styles.heroHeading}>{listeningData.hero.headline}</h1>

                <p className={styles.heroSubtext}>{listeningData.hero.subheadline}</p>

                {/* 4 Stats Grid */}
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
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <span>{listeningData.hero.primaryCta.label}</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScrollTo('test-format')}
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <span>{listeningData.hero.secondaryCta.label}</span>
                    <ChevronDown size={15} />
                  </button>
                </div>
              </div>

              {/* Right Hero Visual Card */}
              <div className={styles.heroRight}>
                <div className={styles.heroImageCard}>
                  <div className={styles.heroImageTopBar}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Volume2 size={14} color="#F6BD28" />
                      <span>IELTS WIST Exam Simulation Mode</span>
                    </span>
                    <span style={{ color: '#F6BD28', fontSize: '0.74rem' }}>30:00 Audio Track</span>
                  </div>

                  <Image
                    src="/images/platform/listening-simulation.png"
                    alt="IELTS Listening Test Simulation Interface"
                    width={480}
                    height={260}
                    className={styles.heroImagePreview}
                    priority
                  />

                  <div className={styles.heroImageFooter}>
                    <span style={{ color: 'var(--text-secondary, #5F5E5B)' }}>4 Sections • 40 Questions</span>
                    <button
                      type="button"
                      onClick={() => handleProtectedPractice('/listening')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-purple, #8867B8)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>Launch Interface</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION B: MOCK TEST LIBRARY (52 TESTS) */}
            <section id="mock-tests" className={styles.contentSection}>
              <div className={styles.testLibraryHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <span className="badge badge-purple" style={{ textTransform: 'uppercase' }}>52 Numbered Mock Tests</span>
                    <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>IELTS Listening Mock Test Library</h2>
                    <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
                      Choose from 52 authentic mock test sets partitioned across Section 1, 2, 3, and 4. All cards connect directly to your protected student practice environment.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProtectedPractice('/listening')}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
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
                    onClick={() => { setSelectedTab('all'); setVisibleCount(12); }}
                  >
                    All 52 Mock Tests
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedTab === 1 ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedTab(1); setVisibleCount(12); }}
                  >
                    Section 1: Everyday Dialogue (13)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedTab === 2 ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedTab(2); setVisibleCount(12); }}
                  >
                    Section 2: Social Monologue (13)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedTab === 3 ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedTab(3); setVisibleCount(12); }}
                  >
                    Section 3: Academic Discussion (13)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedTab === 4 ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedTab(4); setVisibleCount(12); }}
                  >
                    Section 4: Academic Lecture (13)
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div className={styles.searchFilterRow}>
                  <div className={styles.searchBox}>
                    <Search size={16} color="var(--text-muted, #707070)" />
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

              {/* Test Cards Grid */}
              <div className={styles.testCardsGrid}>
                {filteredTests.slice(0, visibleCount).map((test) => (
                  <div key={test.id} className={styles.testCard}>
                    <div>
                      <div className={styles.testCardHeader}>
                        <span className={styles.testNumberBadge}>Mock Test {test.padNumber}</span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: test.section === 1 ? '#047857' : test.section === 2 ? '#B45309' : test.section === 3 ? '#4338CA' : '#7C2D12',
                            background: test.section === 1 ? '#ECFDF5' : test.section === 2 ? '#FEF3C7' : test.section === 3 ? '#EEF2FF' : '#FFEDD5',
                            padding: '2px 8px',
                          }}
                        >
                          Section {test.section}
                        </span>
                      </div>

                      <h3 className={styles.testCardTitle} style={{ marginTop: 10 }}>
                        {test.title}
                      </h3>

                      <p className={styles.testCardContext} style={{ marginTop: 6 }}>
                        {test.context}
                      </p>
                    </div>

                    <div>
                      <div className={styles.testMetaRow}>
                        <span>🎙 {test.speakers}</span>
                        <span>🌐 {test.accent}</span>
                        <span>⚡ {test.difficulty}</span>
                      </div>

                      <div className={styles.testCardFooter}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #707070)' }}>
                          {test.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleProtectedPractice(test.dashboardPath)}
                          className="btn btn-sm btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', padding: '6px 12px' }}
                        >
                          <span>Practice Test</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination / Show More */}
              {visibleCount < filteredTests.length && (
                <div className={styles.paginationRow}>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 12, filteredTests.length))}
                    className="btn btn-secondary"
                  >
                    Load More Mock Tests ({filteredTests.length - visibleCount} remaining)
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibleCount(filteredTests.length)}
                    className="btn btn-outline"
                  >
                    View All {filteredTests.length} Tests
                  </button>
                </div>
              )}
            </section>

            {/* SECTION C: TEST FORMAT & EXAMINATION RULES */}
            <section id="test-format" className={styles.contentSection}>
              <div>
                <span className="badge badge-yellow">Official Examination Regulations</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>IELTS Listening Examination Format & Rules</h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
                  {listeningData.formatRules.summary}
                </p>
              </div>

              <div className={styles.formatGrid}>
                {listeningData.formatRules.cards.map((card, idx) => (
                  <div key={idx} className={styles.formatCard}>
                    <div className={styles.formatCardTop}>
                      <h3 className={styles.formatCardTitle}>
                        {idx === 0 && <Layers size={18} color="var(--accent-purple, #8867B8)" />}
                        {idx === 1 && <Clock size={18} color="#B45309" />}
                        {idx === 2 && <Globe size={18} color="#047857" />}
                        {idx === 3 && <AlertTriangle size={18} color="#DC2626" />}
                        <span>{card.title}</span>
                      </h3>
                      <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>{card.badge}</span>
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

            {/* SECTION D: FOUR SECTIONS EXPLAINED */}
            <section id="four-sections" className={styles.contentSection}>
              <div>
                <span className="badge badge-purple">In-Depth Structural Breakdown</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>The Four Listening Sections Explained</h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
                  Each of the four listening parts presents distinct conversational dynamics, vocabulary demands, and testing purposes.
                </p>
              </div>

              <div className={styles.sectionsStack}>
                {listeningData.fourSections.map((sec) => (
                  <div key={sec.section} className={styles.sectionExplainCard}>
                    <div className={styles.sectionMetaBox}>
                      <span className={styles.sectionNumberBadge}>0{sec.section}</span>
                      <strong style={{ fontSize: '0.96rem', color: 'var(--text-primary, #202020)' }}>
                        {sec.speakers}
                      </strong>
                      <span className="text-xs text-muted">10 Questions</span>
                    </div>

                    <div className={styles.sectionDetailBody}>
                      <h3 className={styles.sectionDetailTitle}>{sec.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary, #4A4A4A)', margin: 0 }}>
                        {sec.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.84rem' }}>
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

            {/* SECTION E: 9 QUESTION TYPES */}
            <section id="question-types" className={styles.contentSection}>
              <div>
                <span className="badge badge-yellow">Complete Question Type Syllabus</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>9 IELTS Listening Question Formats</h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
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

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #5F5E5B)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div><strong>Format:</strong> {q.format}</div>
                      <div><strong>Mechanism:</strong> {q.howItWorks}</div>
                    </div>

                    <div className={styles.qTypeStrategyBox}>
                      <div style={{ fontWeight: 700, color: 'var(--accent-purple, #8867B8)', marginBottom: 2 }}>
                        ✓ Core Strategy:
                      </div>
                      <div>{q.strategy}</div>
                      <div style={{ marginTop: 6, color: '#DC2626', fontWeight: 600 }}>
                        ⚠ Common Trap: {q.commonPitfall}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION F: SAMPLE VISUAL LAYOUTS */}
            <section id="sample-visuals" className={styles.contentSection}>
              <div>
                <span className="badge badge-purple">Real Exam Visual Layouts</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>Sample Question Schematics & Diagrams</h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
                  Familiarize yourself with authentic form completion cards, botanical map plans, and process flow-charts before test day.
                </p>
              </div>

              <div className={styles.sampleVisualsGrid}>
                {/* Visual Sample 1: Form Completion */}
                <div className={styles.sampleMockupCard}>
                  <div className={styles.mockupHeader}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>Section 1 Schematic</span>
                    <h3 className={styles.mockupTitle} style={{ marginTop: 6 }}>Form Completion</h3>
                    <div className={styles.mockupInstruction}>Write NO MORE THAN TWO WORDS AND/OR A NUMBER.</div>
                  </div>

                  <div className={styles.mockupBody}>
                    <div className={styles.mockupFieldRow}>
                      <span className={styles.mockupFieldLabel}>Applicant Name:</span>
                      <span>Emily HARPER</span>
                    </div>
                    <div className={styles.mockupFieldRow}>
                      <span className={styles.mockupFieldLabel}>Contact Phone:</span>
                      <span className={styles.mockupFieldValue}>07849 [ Q1 ]</span>
                    </div>
                    <div className={styles.mockupFieldRow}>
                      <span className={styles.mockupFieldLabel}>Preferred Activity:</span>
                      <span className={styles.mockupFieldValue}>Evening [ Q2 ]</span>
                    </div>
                    <div className={styles.mockupFieldRow}>
                      <span className={styles.mockupFieldLabel}>Payment Method:</span>
                      <span className={styles.mockupFieldValue}>[ Q3 ] debit</span>
                    </div>
                    <div className={styles.mockupFieldRow}>
                      <span className={styles.mockupFieldLabel}>Locker Code:</span>
                      <span className={styles.mockupFieldValue}>[ Q4 ]</span>
                    </div>
                  </div>

                  <p className={styles.mockupInsight}>
                    <strong>Insight:</strong> Focus on spelling digit sequences without transposing numbers (e.g. 14 vs 40).
                  </p>
                </div>

                {/* Visual Sample 2: Map Labelling */}
                <div className={styles.sampleMockupCard}>
                  <div className={styles.mockupHeader}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>Section 2 Schematic</span>
                    <h3 className={styles.mockupTitle} style={{ marginTop: 6 }}>Plan & Map Labelling</h3>
                    <div className={styles.mockupInstruction}>Write the correct letter, A–F, next to questions 11–14.</div>
                  </div>

                  <div className={styles.mockupBody}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
                      <div style={{ background: '#E2DDD1', padding: '10px 4px', fontWeight: 700 }}>[ A ] Rose Arbour</div>
                      <div style={{ background: '#FAF9F5', border: '1px dashed #CCC', padding: '10px 4px' }}>Main Path</div>
                      <div style={{ background: '#E2DDD1', padding: '10px 4px', fontWeight: 700 }}>[ B ] Herb Garden</div>
                      <div style={{ background: '#E2DDD1', padding: '10px 4px', fontWeight: 700 }}>[ C ] Fern Glasshouse</div>
                      <div style={{ background: '#F6BD28', color: '#1A1A1A', padding: '10px 4px', fontWeight: 700 }}>[ F ] START HERE</div>
                      <div style={{ background: '#E2DDD1', padding: '10px 4px', fontWeight: 700 }}>[ D ] Bird Tower</div>
                    </div>
                  </div>

                  <p className={styles.mockupInsight}>
                    <strong>Insight:</strong> Locate the entrance point [F] immediately and mentally face in the direction the speaker walks.
                  </p>
                </div>

                {/* Visual Sample 3: Flow-Chart Completion */}
                <div className={styles.sampleMockupCard}>
                  <div className={styles.mockupHeader}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>Section 3 Schematic</span>
                    <h3 className={styles.mockupTitle} style={{ marginTop: 6 }}>Flow-Chart Process</h3>
                    <div className={styles.mockupInstruction}>Write NO MORE THAN ONE WORD for each answer.</div>
                  </div>

                  <div className={styles.mockupBody}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'center' }}>
                      <div style={{ background: '#FFFFFF', border: '1px solid #E2DDD1', padding: '6px' }}>Step 1: Optical [ Q21 ]</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>↓</div>
                      <div style={{ background: '#FFFFFF', border: '1px solid #E2DDD1', padding: '6px' }}>Step 2: Wash residual [ Q22 ]</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>↓</div>
                      <div style={{ background: '#FFFFFF', border: '1px solid #E2DDD1', padding: '6px' }}>Step 3: 5mm plastic [ Q23 ]</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>↓</div>
                      <div style={{ background: '#FFFFFF', border: '1px solid #E2DDD1', padding: '6px' }}>Step 4: Synthetic [ Q24 ]</div>
                    </div>
                  </div>

                  <p className={styles.mockupInsight}>
                    <strong>Insight:</strong> Flow-charts test chronological order. Transition words like &apos;subsequently&apos; signal the next step.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION G: SCORING & BAND CONVERSION TABLE */}
            <section id="scoring-band" className={styles.contentSection}>
              <div>
                <span className="badge badge-yellow">Official Scoring Metrics</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>IELTS Listening Raw Score to Band Conversion</h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
                  Each of the 40 questions carries exactly 1 mark. There is no negative marking for incorrect answers.
                </p>
              </div>

              <div className={styles.scoringContainer}>
                <table className={styles.scoringTable}>
                  <thead>
                    <tr>
                      <th>Raw Score (out of 40)</th>
                      <th>IELTS Band Score</th>
                      <th>Candidate Skill Level</th>
                      <th>Performance Descriptor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listeningData.scoringTable.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{row.raw}</td>
                        <td className={styles.bandCell}>Band {row.band}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary, #202020)' }}>{row.level}</td>
                        <td>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.scoringNotice}>
                  <strong>Note on Test Scaling:</strong> Official Cambridge conversion curves may fluctuate slightly (±1 mark) depending on the statistical difficulty of a specific examination version. Aim for at least 32 correct answers to secure a dependable Band 7.5+.
                </div>
              </div>
            </section>

            {/* SECTION H: TIPS & STRATEGIES */}
            <section id="tips-strategies" className={styles.contentSection}>
              <div>
                <span className="badge badge-purple">High-Band Tactics</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>Listening Tips, Strategies & Distractor Traps</h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
                  Execute a disciplined 3-phase listening protocol before, during, and after audio playback to prevent losing easy marks.
                </p>
              </div>

              <div className={styles.tipsCategoryStack}>
                {listeningData.tipsAndStrategies.map((cat, idx) => (
                  <div key={idx} className={styles.tipsCategoryCard}>
                    <h3 className={styles.tipsCategoryTitle}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>Phase 0{idx + 1}</span>
                      <span>{cat.category}</span>
                    </h3>

                    <div className={styles.tipsGrid}>
                      {cat.items.map((item, itemIdx) => (
                        <div key={itemIdx} className={styles.tipItem}>
                          <h4 className={styles.tipItemTitle}>{item.title}</h4>
                          <p className={styles.tipItemDesc}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION I: OFFICIAL FREE RESOURCES */}
            <section id="free-resources" className={styles.contentSection}>
              <div>
                <span className="badge badge-yellow">Verified Practice Portals</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>Official Free Practice Resources</h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
                  Access authentic listening papers, audio samples, and accent training podcasts directly from official testing bodies and premier language archives.
                </p>
              </div>

              <div className={styles.resourcesGrid}>
                {listeningData.freeResources.map((res, idx) => (
                  <div key={idx} className={styles.resourceCard}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{res.type}</span>
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
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}
                    >
                      <span>Access Resource</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION J: INTERACTIVE PRACTICE DRILL */}
            <section id="interactive-drill" className={styles.contentSection}>
              <div>
                <span className="badge badge-purple">No Login Required • Try Right Now</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>Interactive Listening Practice Mini-Drills</h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
                  Test your active listening and distractor detection skills with two instant client-side practice exercises.
                </p>
              </div>

              <div className={styles.interactiveStack}>
                {/* Drill 1: Section 1 Form */}
                <div className={styles.interactiveCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <span className="badge badge-yellow">Drill 1 • Section 1</span>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 700, margin: '6px 0 2px 0' }}>
                        {listeningData.interactiveDrills[0].title}
                      </h3>
                      <p className="text-xs text-muted" style={{ margin: 0 }}>
                        {listeningData.interactiveDrills[0].instruction}
                      </p>
                    </div>

                    {drill1Submitted && (
                      <button type="button" onClick={resetDrill1} className="btn btn-outline btn-sm">
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
                      <strong>Audio Recording Script:</strong>
                      <p style={{ margin: '8px 0 0 0' }}>{listeningData.interactiveDrills[0].audioTranscript}</p>
                    </div>
                  )}

                  {/* Input Fields */}
                  <div className={styles.drillFormGrid}>
                    {listeningData.interactiveDrills[0].questions.map((q) => {
                      const userVal = drill1Answers[q.id]?.trim().toLowerCase() || '';
                      const isCorrect = q.correctAnswers.some((ans) => userVal === ans.toLowerCase());

                      return (
                        <div key={q.id} className={styles.drillFieldBox}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{q.label}</label>
                          <input
                            type="text"
                            placeholder="Type your answer here..."
                            value={drill1Answers[q.id] || ''}
                            onChange={(e) =>
                              setDrill1Answers((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            disabled={drill1Submitted}
                            className={`${styles.drillInput} ${
                              drill1Submitted
                                ? isCorrect
                                  ? styles.drillInputCorrect
                                  : styles.drillInputIncorrect
                                : ''
                            }`}
                          />
                          {drill1Submitted && (
                            <div style={{ fontSize: '0.78rem', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                              {isCorrect ? (
                                <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <CheckCircle2 size={13} /> Correct! ({q.explanation})
                                </span>
                              ) : (
                                <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: 4 }}>
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
                      <button type="button" onClick={checkDrill1} className="btn btn-primary btn-sm">
                        Check My Answers
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.82rem' }}>
                          Score: {
                            listeningData.interactiveDrills[0].questions.filter((q) =>
                              q.correctAnswers.some((ans) => (drill1Answers[q.id] || '').trim().toLowerCase() === ans.toLowerCase())
                            ).length
                          } / 4
                        </span>
                        <span className="text-sm text-muted">
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
                      <span className="badge badge-purple">Drill 2 • Section 3 Multiple Choice</span>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 700, margin: '6px 0 2px 0' }}>
                        {listeningData.interactiveDrills[1].title}
                      </h3>
                      <p className="text-xs text-muted" style={{ margin: 0 }}>
                        {listeningData.interactiveDrills[1].instruction}
                      </p>
                    </div>

                    {drill2Submitted && (
                      <button type="button" onClick={resetDrill2} className="btn btn-outline btn-sm">
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
                      <strong>Audio Recording Script:</strong>
                      <p style={{ margin: '8px 0 0 0' }}>{listeningData.interactiveDrills[1].audioTranscript}</p>
                    </div>
                  )}

                  {/* Question Radio Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: '0.94rem', fontWeight: 600, margin: 0 }}>
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
                            background: drill2Selected === opt.letter ? '#F4F0FA' : '#FAF9F5',
                            border: `1px solid ${drill2Selected === opt.letter ? 'var(--accent-purple, #8867B8)' : 'var(--border-color, #E2DDD1)'}`,
                            cursor: drill2Submitted ? 'default' : 'pointer',
                            fontSize: '0.88rem',
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
                          <span style={{ fontWeight: 700, color: 'var(--accent-purple, #8867B8)' }}>
                            {opt.letter}.
                          </span>
                          <span>{opt.text}</span>
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
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #5F5E5B)', margin: 0 }}>
                          <strong>Distractor Breakdown:</strong> {listeningData.interactiveDrills[1].question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION K: FAQS */}
            <section id="faqs" className={styles.contentSection}>
              <div>
                <span className="badge badge-yellow">Frequently Answered Queries</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6 }}>IELTS Listening FAQs</h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 740 }}>
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
                        <ChevronUp size={16} color="var(--accent-purple, #8867B8)" />
                      ) : (
                        <ChevronDown size={16} color="var(--text-muted, #707070)" />
                      )}
                    </button>

                    {openFaq === idx && (
                      <div className={styles.faqAnswerBox}>
                        <p style={{ margin: 0 }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* BOTTOM CALL TO ACTION BANNER */}
            <div className={styles.bottomCtaBanner}>
              <div className={styles.bottomCtaText}>
                <span className="badge badge-yellow" style={{ alignSelf: 'flex-start' }}>Start Your Practice Today</span>
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
                  color: '#1A1A1A',
                  borderColor: '#F6BD28',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
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
                <List size={14} color="var(--accent-purple, #8867B8)" />
                <span>On This Page</span>
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>11 Parts</span>
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
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple, #8867B8)' }}>●</span>
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
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
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
