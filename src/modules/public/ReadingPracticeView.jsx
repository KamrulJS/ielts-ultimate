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
  AlertTriangle,
  HelpCircle,
  Filter,
  Layers,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  RotateCcw,
  BookMarked,
  FileText,
  Search,
  List,
  Lock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import guideData from '@/data/public/reading-guide.json';
import cambridgeBooks from '@/data/reading/cambridge-reading-books.json';
import styles from './ReadingPractice.module.css';

export function ReadingPracticeView() {
  const router = useRouter();
  const app = useApp?.() || {};
  const auth = app.auth || { isAuthenticated: false };

  // Table of Contents & Scrollspy
  const [activeToc, setActiveToc] = useState('overview');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Cambridge Practice Test Library State
  const [selectedBookTab, setSelectedBookTab] = useState('all'); // 'all' | 'recent' | 'standard' | 'classic' | 'forthcoming'
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [visibleBookCount, setVisibleBookCount] = useState(9);

  // Question Types Filter & Search
  const [qtSearch, setQtSearch] = useState('');
  const [selectedQtType, setSelectedQtType] = useState('All');

  // Accordion States for Question Types & Strategies
  const [openTips, setOpenTips] = useState({});
  const toggleTip = (id) => setOpenTips((prev) => ({ ...prev, [id]: !prev[id] }));

  const [openExamples, setOpenExamples] = useState({});
  const toggleExample = (id) => setOpenExamples((prev) => ({ ...prev, [id]: !prev[id] }));

  const [openAnswers, setOpenAnswers] = useState({});
  const toggleAnswer = (id) => setOpenAnswers((prev) => ({ ...prev, [id]: !prev[id] }));

  const [openStrategyDetails, setOpenStrategyDetails] = useState({});
  const toggleStrategyDetail = (id) => setOpenStrategyDetails((prev) => ({ ...prev, [id]: !prev[id] }));

  const [openRoadblock, setOpenRoadblock] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Drill State (TFNG)
  const [drillAnswers, setDrillAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
  });
  const [drillChecked, setDrillChecked] = useState(false);

  // IntersectionObserver for TOC highlight
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = guideData.tableOfContents.map((item) => item.id);
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
  const handleProtectedPractice = (targetPath = '/reading') => {
    if (auth.isAuthenticated) {
      router.push(targetPath);
    } else {
      router.push(`/login?next=${encodeURIComponent(targetPath)}`);
    }
  };

  // Filtered Cambridge Books
  const filteredBooks = useMemo(() => {
    return cambridgeBooks.filter((book) => {
      let matchTab = true;
      if (selectedBookTab === 'recent') matchTab = book.bookNumber >= 17 && !book.isForthcoming;
      else if (selectedBookTab === 'standard') matchTab = book.bookNumber >= 13 && book.bookNumber <= 16;
      else if (selectedBookTab === 'classic') matchTab = book.bookNumber >= 9 && book.bookNumber <= 12;
      else if (selectedBookTab === 'forthcoming') matchTab = book.isForthcoming;

      const q = bookSearchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.overview.toLowerCase().includes(q) ||
        String(book.bookNumber).includes(q);

      return matchTab && matchSearch;
    });
  }, [selectedBookTab, bookSearchQuery]);

  // Filtered Question Types
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

  const handleResetDrill = () => {
    setDrillChecked(false);
    setDrillAnswers({ q1: null, q2: null, q3: null });
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
              <span>Table of Contents ({guideData.tableOfContents.length} Sections)</span>
            </span>
            {mobileTocOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {mobileTocOpen && (
            <div className={styles.mobileTocDrawer}>
              {guideData.tableOfContents.map((item) => (
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
                <BookOpen size={13} />
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
                Cambridge Past Papers
              </span>
            </div>

            <h1 className={styles.heroHeading}>
              Master IELTS Academic <span style={{ color: '#8867B8' }}>Reading</span>
            </h1>

            <p className={styles.heroSubtext}>
              {guideData.hero.description}
            </p>

            {/* 4 Stats Grid - Soft Highlight Tiles */}
            <div className={styles.statsBar}>
              {guideData.hero.stats.map((s, idx) => (
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
                onClick={() => handleProtectedPractice('/reading')}
                className={styles.heroPrimaryBtn}
              >
                <span>{guideData.hero.primaryCta.label}</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('cambridge-library')}
                className={styles.heroSecondaryBtn}
              >
                <span>Explore Cambridge Library</span>
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* Right Hero Visual - Large Transparent AI-Generated Illustration */}
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
        </section>

        {/* 2-Column Desktop Layout */}
        <div className={styles.layoutGrid} style={{ marginTop: 28 }}>
          {/* Main Content Column */}
          <main className={styles.mainColumn}>
            {/* 2. CAMBRIDGE TEST LIBRARY (Books 9–25) */}
            <section id="cambridge-library" className={styles.contentSection}>
              <div className={styles.testLibraryHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <span className={styles.sectionIndicatorBadge}>CAMBRIDGE PRACTICE TEST LIBRARY</span>
                    <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                      Cambridge IELTS Academic Reading Test Library (Books 9–25)
                    </h2>
                    <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                      52 authentic Academic Reading tests across 13 published Cambridge volumes (Books 9–21) plus syllabus previews for forthcoming editions (Books 22–25).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProtectedPractice('/reading')}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 0, fontWeight: 700 }}
                  >
                    <Lock size={13} />
                    <span>Open Dashboard Hub</span>
                  </button>
                </div>

                {/* Volume Category Tabs */}
                <div className={styles.tabControls}>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedBookTab === 'all' ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedBookTab('all'); setVisibleBookCount(9); }}
                  >
                    All Cambridge Books (17)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedBookTab === 'recent' ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedBookTab('recent'); setVisibleBookCount(9); }}
                  >
                    Recent Editions (Books 17–21)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedBookTab === 'standard' ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedBookTab('standard'); setVisibleBookCount(9); }}
                  >
                    Standard Editions (Books 13–16)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedBookTab === 'classic' ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedBookTab('classic'); setVisibleBookCount(9); }}
                  >
                    Classic Editions (Books 9–12)
                  </button>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${selectedBookTab === 'forthcoming' ? styles.tabBtnActive : ''}`}
                    onClick={() => { setSelectedBookTab('forthcoming'); setVisibleBookCount(9); }}
                  >
                    Forthcoming Previews (Books 22–25)
                  </button>
                </div>

                {/* Search & Filter Bar */}
                <div className={styles.searchFilterRow}>
                  <div className={styles.searchBox}>
                    <Search size={16} color="#707070" />
                    <input
                      type="text"
                      placeholder="Search Cambridge books by edition, passage, or keyword..."
                      value={bookSearchQuery}
                      onChange={(e) => setBookSearchQuery(e.target.value)}
                      className={styles.searchInput}
                    />
                    {bookSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setBookSearchQuery('')}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#888' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <span className={styles.testCountLabel}>
                    Showing {Math.min(visibleBookCount, filteredBooks.length)} of {filteredBooks.length} books (52 full academic tests)
                  </span>
                </div>
              </div>

              {/* Cambridge Book Cards Grid - #FEF6DD Branded Cards */}
              <div className={styles.testCardsGrid}>
                {filteredBooks.slice(0, visibleBookCount).map((book) => (
                  <div key={book.bookNumber} className={styles.testCard}>
                    <div>
                      <div className={styles.testCardHeader}>
                        <span className={styles.testNumberBadge}>Cambridge Book {book.bookNumber}</span>
                        <span className={styles.testAccentTag}>
                          {book.isForthcoming ? 'Forthcoming' : `Year ${book.year}`}
                        </span>
                      </div>

                      <h3 className={styles.testCardTitle} style={{ marginTop: 10 }}>
                        {book.title}
                      </h3>
                    </div>

                    <div>
                      <div className={styles.testMetaRow} style={{ marginBottom: 12 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={13} color="#8867B8" />
                          <span style={{ fontWeight: 600 }}>{book.testCount} Full Academic Tests</span>
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FileText size={13} color="#8867B8" />
                          <span>{book.passagesCount} Passages</span>
                        </span>
                      </div>

                      <div className={styles.testCardFooter}>
                        <button
                          type="button"
                          onClick={() => handleProtectedPractice('/reading')}
                          className={styles.testPracticeBtn}
                        >
                          <span>{book.isForthcoming ? 'View Syllabus' : 'Practice in Dashboard'}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progressive Loading */}
              {visibleBookCount < filteredBooks.length && (
                <div className={styles.paginationRow}>
                  <button
                    type="button"
                    onClick={() => setVisibleBookCount((prev) => Math.min(prev + 8, filteredBooks.length))}
                    className="btn btn-primary"
                    style={{ minWidth: 240, borderRadius: 0, backgroundColor: '#F6BD28', color: '#202020', border: '1px solid #E5AC1A', fontWeight: 700 }}
                  >
                    Load More Cambridge Books ({filteredBooks.length - visibleBookCount} remaining)
                  </button>
                </div>
              )}
            </section>

            {/* 3. OFFICIAL EXAMINATION REGULATIONS */}
            <section id="test-format" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>OFFICIAL EXAMINATION REGULATIONS</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  IELTS Academic Reading Examination Format & Regulations
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  {guideData.formatRules.subtitle}
                </p>
              </div>

              {/* Format Cards with 24px Icons */}
              <div className={styles.formatGrid}>
                {guideData.formatRules.rules.map((rule, idx) => (
                  <div key={idx} className={styles.formatCard}>
                    <div className={styles.formatCardTop}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className={styles.formatIconBox}>
                          {idx === 0 && <Layers size={24} color="#8867B8" />}
                          {idx === 1 && <Clock size={24} color="#B45309" />}
                          {idx === 2 && <Globe size={24} color="#047857" />}
                          {idx === 3 && <AlertTriangle size={24} color="#DC2626" />}
                        </div>
                        <h3 className={styles.formatCardTitle}>{rule.title}</h3>
                      </div>
                      <span className={styles.sectionIndicatorBadge} style={{ marginBottom: 0, fontSize: '0.7rem' }}>
                        Rule 0{idx + 1}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#202020', lineHeight: 1.55 }}>
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Academic Reading 3-Passage Architecture Table */}
              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#202020', marginBottom: 12 }}>
                  {guideData.academicStandards.title}
                </h3>
                <div className={styles.scoringContainer}>
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
                          <td style={{ fontWeight: 700, color: '#202020' }}>{row.component}</td>
                          <td style={{ color: '#202020' }}>{row.specification}</td>
                          <td style={{ color: '#202020', lineHeight: 1.5 }}>{row.competencies}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 4. THREE ACADEMIC PASSAGES EXPLAINED */}
            <section id="difficulty-guide" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>THREE ACADEMIC PASSAGES EXPLAINED</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  The Three Academic Reading Passages Explained
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Understand the progressive cognitive complexity, vocabulary load, and argument structures across Passages 1, 2, and 3.
                </p>
              </div>

              <div className={styles.sectionsStack}>
                {guideData.academicStandards.rows.map((row, idx) => {
                  const passNum = idx + 1;
                  const tips = [
                    "Allocate no more than 16–17 minutes to Passage 1. Because questions here are predominantly sequential, locate keywords first to build early scoring momentum.",
                    "Tackle question sets before reading the entire passage. For paragraph matching, mark keywords in questions first, then scan paragraph by paragraph.",
                    "Reserve at least 22 minutes for Passage 3. Watch out for subtle counter-arguments introduced by concessions such as 'Albeit', 'Notwithstanding', or 'Conversely'."
                  ];

                  return (
                    <div key={idx} className={styles.sectionExplainCard}>
                      <div className={styles.sectionMetaBox}>
                        <span className={styles.sectionNumberBadge}>0{passNum}</span>
                        <strong style={{ fontSize: '0.98rem', color: '#202020' }}>
                          Passage {passNum}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: '#4A4A4A', fontWeight: 600 }}>
                          {idx === 0 ? '13 Questions' : idx === 1 ? '13 Questions' : '14 Questions'}
                        </span>
                      </div>

                      <div className={styles.sectionDetailBody}>
                        <h3 className={styles.sectionDetailTitle}>{row.component}</h3>
                        <p style={{ color: '#202020', margin: 0, fontSize: '0.92rem', lineHeight: 1.55 }}>
                          {row.specification}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.86rem', color: '#202020' }}>
                          <div><strong>Core Competencies Tested:</strong> {row.competencies}</div>
                        </div>

                        <div className={styles.tipCallout}>
                          <strong>Candidate Strategy Tip:</strong> {tips[idx]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. COMPLETE QUESTION TYPE SYLLABUS — With Cambridge Example Question Accordions */}
            <section id="question-types" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>COMPLETE QUESTION TYPE SYLLABUS</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  14 IELTS Academic Reading Question Formats
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Master the specific answering strategy, identification keys, and distractor avoidance technique required for each of the 14 official question types.
                </p>
              </div>

              {/* Filter Tabs & Search Bar */}
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

                <div style={{ position: 'relative', width: 260 }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#707070' }} />
                  <input
                    type="text"
                    value={qtSearch}
                    onChange={(e) => setQtSearch(e.target.value)}
                    placeholder="Search question types..."
                    className={styles.searchInput}
                    style={{ paddingLeft: 32, fontSize: '0.84rem', height: 36, border: '1px solid var(--border-color, #E2DDD1)' }}
                  />
                </div>
              </div>

              {/* Question Types Grid */}
              <div className={styles.qTypesGrid}>
                {filteredQuestionTypes.map((qt) => (
                  <div key={qt.id} className={styles.qTypeCard}>
                    <div className={styles.qTypeHeader}>
                      <div>
                        <h3 className={styles.qTypeName}>{qt.name}</h3>
                        <span style={{ fontSize: '0.78rem', color: '#8867B8', fontWeight: 700, marginTop: 2, display: 'inline-block' }}>
                          Type {qt.id < 10 ? `0${qt.id}` : qt.id} &bull; {qt.badge}
                        </span>
                      </div>
                      <span className={styles.qTypeFormatTag}>
                        Freq: {qt.frequency}
                      </span>
                    </div>

                    <p className={styles.qTypeDesc}>{qt.meaning}</p>

                    <div style={{ fontSize: '0.84rem', color: '#202020', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div><strong>Identification:</strong> {qt.identification}</div>
                    </div>

                    {/* Step-by-Step Solving Protocol */}
                    <div style={{ background: '#FAF9F5', border: '1px solid var(--border-color, #E2DDD1)', padding: '10px 12px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#4A4A4A', marginBottom: 6 }}>
                        Step-by-Step Solving Protocol:
                      </div>
                      <ol style={{ margin: 0, paddingLeft: 18, fontSize: '0.84rem', color: '#202020', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {qt.strategy.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Pro Tip Accordion (Collapsed by Default) */}
                    <div className={styles.accordionCardBox}>
                      <button
                        type="button"
                        onClick={() => toggleTip(qt.id)}
                        className={styles.accordionCardToggle}
                        aria-expanded={!!openTips[qt.id]}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#15803d', fontSize: '0.82rem' }}>
                          <Sparkles size={14} color="#15803d" />
                          <span>Expert Pro Tip &amp; Common Pitfalls</span>
                        </span>
                        {openTips[qt.id] ? <ChevronUp size={14} color="#15803d" /> : <ChevronDown size={14} color="#707070" />}
                      </button>

                      {openTips[qt.id] && (
                        <div className={styles.accordionCardContent}>
                          <div style={{ fontSize: '0.84rem', color: '#202020', lineHeight: 1.55 }}>
                            <strong>Pro Tip:</strong> {qt.tips}
                          </div>
                          <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#DC2626', fontWeight: 600 }}>
                            ⚠ Common Trap: {qt.pitfalls}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cambridge Example Question Accordion (Collapsed by Default) */}
                    <div style={{ marginTop: 'auto' }}>
                      <button
                        type="button"
                        onClick={() => toggleExample(qt.id)}
                        className={styles.exampleAccordionToggle}
                        aria-expanded={!!openExamples[qt.id]}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#8867B8', fontSize: '0.84rem' }}>
                          <BookMarked size={14} color="#8867B8" />
                          <span>View Cambridge Example Question</span>
                        </span>
                        {openExamples[qt.id] ? (
                          <ChevronUp size={15} color="#8867B8" />
                        ) : (
                          <ChevronDown size={15} color="#707070" />
                        )}
                      </button>

                      {openExamples[qt.id] && (
                        <div className={styles.exampleAccordionContent}>
                          <div className={styles.qtPassageText}>
                            &ldquo;{qt.samplePassage}&rdquo;
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#202020', margin: '6px 0' }}>
                            {qt.sampleQuestion}
                          </div>
                          {qt.sampleOptions && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '4px 0 8px' }}>
                              {qt.sampleOptions.map((opt, oIdx) => (
                                <div key={oIdx} style={{ fontSize: '0.88rem', color: '#202020' }}>
                                  &bull; {opt}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Correct Answer & Explanation Toggle inside Example */}
                          <div style={{ marginTop: 6 }}>
                            <button
                              type="button"
                              onClick={() => toggleAnswer(qt.id)}
                              className={styles.accordionAnswerToggle}
                              aria-expanded={!!openAnswers[qt.id]}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#8867B8', fontSize: '0.82rem' }}>
                                <CheckCircle2 size={13} color="#8867B8" />
                                <span>{openAnswers[qt.id] ? 'Hide Answer Explanation' : 'View Correct Answer & Detailed Explanation'}</span>
                              </span>
                              {openAnswers[qt.id] ? <ChevronUp size={14} color="#8867B8" /> : <ChevronDown size={14} color="#707070" />}
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
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. SCORE AND BAND SCORE CONVERSION — Clean 3-Column Layout */}
            <section id="scoring" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>SCORE &amp; BAND SCORE CONVERSION</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  IELTS Academic Reading Raw Score to Band Conversion
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
                    {guideData.scoringTables.academic.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700, fontSize: '1.05rem', color: '#202020' }}>{row.rawScore}</td>
                        <td className={styles.bandCell}>Band {row.band}</td>
                        <td style={{ fontWeight: 600, color: '#202020', fontSize: '0.92rem' }}>{row.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.scoringNotice}>
                  <strong>Note on Test Scaling:</strong> Official Cambridge conversion curves for Academic Reading require 30 correct answers for Band 7.0, and 35 correct answers for Band 8.0. Maintain a targeted minimum of 32 correct answers during practice sessions.
                </div>
              </div>
            </section>

            {/* 7. SYSTEMATIC READING STRATEGIES & TIME MANAGEMENT */}
            <section id="strategies" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>SYSTEMATIC READING STRATEGIES</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  Core Reading Strategies &amp; 60-Minute Time Management
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Execute a disciplined reading methodology to conquer time pressure across Passages 1, 2, and 3.
                </p>
              </div>

              {/* Strategy Cards with Protocol Accordions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {guideData.strategies.list.map((strat) => (
                  <div key={strat.id} className={styles.strategyCard}>
                    <div className={styles.strategyHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h3 className={styles.strategyTitle}>{strat.name}</h3>
                        <span className={styles.sectionIndicatorBadge} style={{ marginBottom: 0, fontSize: '0.7rem' }}>
                          {strat.tag}
                        </span>
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

                        <div className={styles.tipCallout}>
                          <strong>When to apply: </strong> {strat.whenToUse}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Time Management Grid */}
              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#202020', marginBottom: 12 }}>
                  60-Minute Pacing Matrix
                </h3>
                <div className={styles.timeGrid}>
                  {guideData.timeManagement.breakdown.map((item, idx) => (
                    <div key={idx} className={styles.timeCard}>
                      <div className={styles.timeMinutes}>{item.allocatedMinutes}m</div>
                      <div className={styles.timeLabel}>{item.passage}</div>
                      <div style={{ fontSize: '0.8rem', color: '#4A4A4A', fontWeight: 600 }}>{item.questions}</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#8867B8' }}>{item.pacing}</div>
                      <p style={{ margin: 0, lineHeight: 1.5, fontSize: '0.84rem', color: '#202020' }}>
                        {item.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 90-Second Roadblock Protocol Accordion */}
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
                    <span>{openRoadblock ? 'Collapse Protocol' : 'Expand Protocol'}</span>
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

            {/* 8. INTERACTIVE READING PRACTICE MINI-DRILLS */}
            <section id="interactive-drills" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>INTERACTIVE READING PRACTICE</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  Interactive Reading Practice Mini-Drills
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Test your active scanning and verification precision on authentic academic excerpts.
                </p>
              </div>

              <div className={styles.interactiveStack}>
                <div className={styles.interactiveCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 700, margin: 0, color: '#202020' }}>
                      {guideData.interactiveDrills[0].title}
                    </h3>
                    <span className={styles.sectionIndicatorBadge} style={{ marginBottom: 0, fontSize: '0.7rem' }}>
                      True / False / Not Given
                    </span>
                  </div>

                  <div className={styles.drillPassage}>
                    &ldquo;{guideData.interactiveDrills[0].passage}&rdquo;
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {guideData.interactiveDrills[0].questions.map((q) => (
                      <div key={q.id} className={styles.drillQuestionRow}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#202020' }}>{q.statement}</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectDrillOption(q.id, opt)}
                              className={`${styles.drillOptionBtn} ${drillAnswers[q.id] === opt ? styles.drillOptionBtnSelected : ''}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {drillChecked && (
                          <div style={{ marginTop: 6, fontSize: '0.84rem' }}>
                            <strong style={{ color: drillAnswers[q.id] === q.correct ? '#15803d' : '#b91c1c' }}>
                              {drillAnswers[q.id] === q.correct ? '✓ Correct!' : `✗ Incorrect (Correct: ${q.correct})`}
                            </strong>
                            <div style={{ marginTop: 4, color: '#202020', lineHeight: 1.55 }}>{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setDrillChecked(true)}
                      className="btn btn-sm"
                      style={{ borderRadius: 0, backgroundColor: '#F6BD28', color: '#202020', border: '1px solid #E5AC1A', fontWeight: 700, padding: '8px 18px' }}
                    >
                      Check TFNG Answers
                    </button>
                    <button
                      type="button"
                      onClick={handleResetDrill}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: 0 }}
                    >
                      <RotateCcw size={12} /> Reset
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 9. FAQS */}
            <section id="faqs" className={styles.contentSection}>
              <div>
                <span className={styles.sectionIndicatorBadge}>FREQUENTLY ASKED QUESTIONS</span>
                <h2 className="h2" style={{ marginTop: 8, marginBottom: 6, color: '#202020' }}>
                  IELTS Academic Reading FAQs
                </h2>
                <p style={{ margin: 0, maxWidth: 740, color: '#333333', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Essential answers to critical questions about exam pacing, capitalization, spelling, and scoring rubrics.
                </p>
              </div>

              <div className={styles.faqStack}>
                {(Array.isArray(guideData.faqs) ? guideData.faqs : guideData.faqs?.items || []).map((faq, idx) => (
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
                <h2 className={styles.bottomCtaHeading}>Ready to Achieve Band 8.0+ in IELTS Academic Reading?</h2>
                <p className={styles.bottomCtaDesc}>
                  Access our full suite of 52 timed exam simulations with instant automated marking, synchronized passage highlighting, and comprehensive mistake review logs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleProtectedPractice('/reading')}
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
                <span>Launch Reading Practice Hub</span>
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
                {guideData.tableOfContents.length} Sections
              </span>
            </div>

            <nav>
              <ul className={styles.tocNavList}>
                {guideData.tableOfContents.map((item) => (
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
                onClick={() => handleProtectedPractice('/reading')}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 0, backgroundColor: '#F6BD28', color: '#202020', border: '1px solid #E5AC1A', fontWeight: 700 }}
              >
                <BookOpen size={14} />
                <span>Practice Now</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
