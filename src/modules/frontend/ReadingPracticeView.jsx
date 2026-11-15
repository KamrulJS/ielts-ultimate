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
    <div className={styles.read_div_1}>
      <div className={styles.container}>
        {/* Mobile / Tablet Sticky Collapsible Table of Contents Bar */}
        <div className={styles.mobileTocStickyWrapper}>
          <button
            type="button"
            className={styles.mobileTocToggle}
            onClick={() => setMobileTocOpen((prev) => !prev)}
            aria-expanded={mobileTocOpen}
          >
            <span className={styles.read_span_2}>
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
                  {activeToc === item.id && <span className={styles.read_span_3}>●</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 1. HERO SECTION (Overview & Metrics) - Completely Transparent over #FAF9F5 */}
        <section id="overview" className={`${styles.contentSection} ${styles.heroBanner}`}>
          <div className={styles.heroLeft}>
            <div className={styles.badgeRow}>
              <span className={`${styles.sectionIndicatorBadge} ${styles.read_span_4}`} >
                <BookOpen size={13} />
                IELTS Academic
              </span>
              <span
                className={styles.read_span_5}
              >
                Cambridge Past Papers
              </span>
            </div>

            <h1 className={styles.heroHeading}>
              Master IELTS Academic <span className={styles.read_span_6}>Reading</span>
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
        <div className={`${styles.layoutGrid} ${styles.read_div_7}`} >
          {/* Main Content Column */}
          <main className={styles.mainColumn}>
            {/* 2. CAMBRIDGE TEST LIBRARY (Books 9–25) */}
            <section id="cambridge-library" className={styles.contentSection}>
              <div className={styles.testLibraryHeader}>
                <div className={styles.read_div_8}>
                  <div>
                    <span className={styles.sectionIndicatorBadge}>CAMBRIDGE PRACTICE TEST LIBRARY</span>
                    <h2 className={`h2 ${styles.read_h2_9}`} >
                      Cambridge IELTS Academic Reading Test Library (Books 9–25)
                    </h2>
                    <p className={styles.read_p_10}>
                      52 authentic Academic Reading tests across 13 published Cambridge volumes (Books 9–21) plus syllabus previews for forthcoming editions (Books 22–25).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProtectedPractice('/reading')}
                    className={`btn btn-outline btn-sm ${styles.read_button_11}`}
                    
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
                        className={styles.read_button_12}
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

                      <h3 className={`${styles.testCardTitle} ${styles.read_h3_13}`} >
                        {book.title}
                      </h3>
                    </div>

                    <div>
                      <div className={`${styles.testMetaRow} ${styles.read_div_14}`} >
                        <span className={styles.read_span_15}>
                          <Clock size={13} color="#8867B8" />
                          <span className={styles.read_span_16}>{book.testCount} Full Academic Tests</span>
                        </span>
                        <span className={styles.read_span_15}>
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
                    className={`btn btn-primary ${styles.read_button_17}`}
                    
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
                <h2 className={`h2 ${styles.read_h2_9}`} >
                  IELTS Academic Reading Examination Format & Regulations
                </h2>
                <p className={styles.read_p_10}>
                  {guideData.formatRules.subtitle}
                </p>
              </div>

              {/* Format Cards with 24px Icons */}
              <div className={styles.formatGrid}>
                {guideData.formatRules.rules.map((rule, idx) => (
                  <div key={idx} className={styles.formatCard}>
                    <div className={styles.formatCardTop}>
                      <div className={styles.read_div_18}>
                        <div className={styles.formatIconBox}>
                          {idx === 0 && <Layers size={24} color="#8867B8" />}
                          {idx === 1 && <Clock size={24} color="#B45309" />}
                          {idx === 2 && <Globe size={24} color="#047857" />}
                          {idx === 3 && <AlertTriangle size={24} color="#DC2626" />}
                        </div>
                        <h3 className={styles.formatCardTitle}>{rule.title}</h3>
                      </div>
                      <span className={`${styles.sectionIndicatorBadge} ${styles.read_span_19}`} >
                        Rule 0{idx + 1}
                      </span>
                    </div>

                    <p className={styles.read_p_20}>
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Academic Reading 3-Passage Architecture Table */}
              <div className={styles.read_div_21}>
                <h3 className={styles.read_h3_22}>
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
                          <td className={styles.read_td_23}>{row.component}</td>
                          <td className={styles.read_td_24}>{row.specification}</td>
                          <td className={styles.read_td_25}>{row.competencies}</td>
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
                <h2 className={`h2 ${styles.read_h2_9}`} >
                  The Three Academic Reading Passages Explained
                </h2>
                <p className={styles.read_p_10}>
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
                        <strong className={styles.read_strong_26}>
                          Passage {passNum}
                        </strong>
                        <span className={styles.read_span_27}>
                          {idx === 0 ? '13 Questions' : idx === 1 ? '13 Questions' : '14 Questions'}
                        </span>
                      </div>

                      <div className={styles.sectionDetailBody}>
                        <h3 className={styles.sectionDetailTitle}>{row.component}</h3>
                        <p className={styles.read_p_28}>
                          {row.specification}
                        </p>

                        <div className={styles.read_div_29}>
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
                <h2 className={`h2 ${styles.read_h2_9}`} >
                  14 IELTS Academic Reading Question Formats
                </h2>
                <p className={styles.read_p_10}>
                  Master the specific answering strategy, identification keys, and distractor avoidance technique required for each of the 14 official question types.
                </p>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className={styles.read_div_30}>
                <div className={styles.read_div_31}>
                  {['All', 'Verification', 'Matching', 'Completion', 'Selection'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedQtType(cat)}
                      className={`${styles.qtCategoryTab} ${selectedQtType === cat ? styles.qtCategoryTabActive : styles.qtCategoryTabDefault}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className={styles.read_div_32}>
                  <Search size={14} className={styles.read_search_33} />
                  <input
                    type="text"
                    value={qtSearch}
                    onChange={(e) => setQtSearch(e.target.value)}
                    placeholder="Search question types..."
                    className={`${styles.searchInput} ${styles.read_input_34}`}
                    
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
                        <span className={styles.read_span_35}>
                          Type {qt.id < 10 ? `0${qt.id}` : qt.id} &bull; {qt.badge}
                        </span>
                      </div>
                      <span className={styles.qTypeFormatTag}>
                        Freq: {qt.frequency}
                      </span>
                    </div>

                    <p className={styles.qTypeDesc}>{qt.meaning}</p>

                    <div className={styles.read_div_36}>
                      <div><strong>Identification:</strong> {qt.identification}</div>
                    </div>

                    {/* Step-by-Step Solving Protocol */}
                    <div className={styles.read_div_37}>
                      <div className={styles.read_div_38}>
                        Step-by-Step Solving Protocol:
                      </div>
                      <ol className={styles.read_ol_39}>
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
                        <span className={styles.read_span_40}>
                          <Sparkles size={14} color="#15803d" />
                          <span>Expert Pro Tip &amp; Common Pitfalls</span>
                        </span>
                        {openTips[qt.id] ? <ChevronUp size={14} color="#15803d" /> : <ChevronDown size={14} color="#707070" />}
                      </button>

                      {openTips[qt.id] && (
                        <div className={styles.accordionCardContent}>
                          <div className={styles.read_div_41}>
                            <strong>Pro Tip:</strong> {qt.tips}
                          </div>
                          <div className={styles.read_div_42}>
                            ⚠ Common Trap: {qt.pitfalls}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cambridge Example Question Accordion (Collapsed by Default) */}
                    <div className={styles.read_div_43}>
                      <button
                        type="button"
                        onClick={() => toggleExample(qt.id)}
                        className={styles.exampleAccordionToggle}
                        aria-expanded={!!openExamples[qt.id]}
                      >
                        <span className={styles.read_span_44}>
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
                          <div className={styles.read_div_45}>
                            {qt.sampleQuestion}
                          </div>
                          {qt.sampleOptions && (
                            <div className={styles.read_div_46}>
                              {qt.sampleOptions.map((opt, oIdx) => (
                                <div key={oIdx} className={styles.read_div_47}>
                                  &bull; {opt}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Correct Answer & Explanation Toggle inside Example */}
                          <div className={styles.read_div_48}>
                            <button
                              type="button"
                              onClick={() => toggleAnswer(qt.id)}
                              className={styles.accordionAnswerToggle}
                              aria-expanded={!!openAnswers[qt.id]}
                            >
                              <span className={styles.read_span_49}>
                                <CheckCircle2 size={13} color="#8867B8" />
                                <span>{openAnswers[qt.id] ? 'Hide Answer Explanation' : 'View Correct Answer & Detailed Explanation'}</span>
                              </span>
                              {openAnswers[qt.id] ? <ChevronUp size={14} color="#8867B8" /> : <ChevronDown size={14} color="#707070" />}
                            </button>

                            {openAnswers[qt.id] && (
                              <div className={styles.qtAnswerExpl}>
                                <strong className={styles.read_td_24}>Correct Answer:</strong> {qt.sampleAnswer}
                                <div className={styles.read_div_50}>
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
                <h2 className={`h2 ${styles.read_h2_9}`} >
                  IELTS Academic Reading Raw Score to Band Conversion
                </h2>
                <p className={styles.read_p_10}>
                  Each of the 40 questions carries exactly 1 mark. There is no negative marking for incorrect answers.
                </p>
              </div>

              <div className={styles.scoringContainer}>
                <table className={styles.scoringTable}>
                  <thead>
                    <tr>
                      <th className={styles.read_th_51}>Raw Score (out of 40)</th>
                      <th className={styles.read_th_51}>IELTS Band Score</th>
                      <th className={styles.read_th_52}>Candidate Skill Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guideData.scoringTables.academic.map((row, idx) => (
                      <tr key={idx}>
                        <td className={styles.read_td_53}>{row.rawScore}</td>
                        <td className={styles.bandCell}>Band {row.band}</td>
                        <td className={styles.read_td_54}>{row.level}</td>
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
                <h2 className={`h2 ${styles.read_h2_9}`} >
                  Core Reading Strategies &amp; 60-Minute Time Management
                </h2>
                <p className={styles.read_p_10}>
                  Execute a disciplined reading methodology to conquer time pressure across Passages 1, 2, and 3.
                </p>
              </div>

              {/* Strategy Cards with Protocol Accordions */}
              <div className={styles.read_div_55}>
                {guideData.strategies.list.map((strat) => (
                  <div key={strat.id} className={styles.strategyCard}>
                    <div className={styles.strategyHeader}>
                      <div className={styles.read_div_56}>
                        <h3 className={styles.strategyTitle}>{strat.name}</h3>
                        <span className={`${styles.sectionIndicatorBadge} ${styles.read_span_19}`} >
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

                    <p className={styles.read_p_57}>
                      {strat.summary}
                    </p>

                    {openStrategyDetails[strat.id] && (
                      <div className={styles.read_div_58}>
                        <div className={styles.prosConsGrid}>
                          <div className={styles.proBox}>
                            <div className={`${styles.boxTitle} ${styles.read_div_59}`} >
                              <Check size={14} /> Key Advantages
                            </div>
                            <ul className={styles.bulletList}>
                              {strat.pros.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          </div>

                          <div className={styles.conBox}>
                            <div className={`${styles.boxTitle} ${styles.read_div_60}`} >
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
              <div className={styles.read_div_21}>
                <h3 className={styles.read_h3_22}>
                  60-Minute Pacing Matrix
                </h3>
                <div className={styles.timeGrid}>
                  {guideData.timeManagement.breakdown.map((item, idx) => (
                    <div key={idx} className={styles.timeCard}>
                      <div className={styles.timeMinutes}>{item.allocatedMinutes}m</div>
                      <div className={styles.timeLabel}>{item.passage}</div>
                      <div className={styles.read_span_27}>{item.questions}</div>
                      <div className={styles.read_div_61}>{item.pacing}</div>
                      <p className={styles.read_p_62}>
                        {item.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 90-Second Roadblock Protocol Accordion */}
              <div className={`card-warm ${styles.read_div_63}`} >
                <button
                  type="button"
                  onClick={() => setOpenRoadblock(!openRoadblock)}
                  className={styles.read_button_64}
                  aria-expanded={openRoadblock}
                >
                  <strong className={styles.read_strong_65}>
                    {guideData.timeManagement.roadblockProtocol.title}
                  </strong>
                  <span className={styles.read_span_66}>
                    <span>{openRoadblock ? 'Collapse Protocol' : 'Expand Protocol'}</span>
                    {openRoadblock ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                {openRoadblock && (
                  <div className={styles.read_div_67}>
                    <p className={styles.read_p_68}>
                      <strong>Rule:</strong> {guideData.timeManagement.roadblockProtocol.rule}
                    </p>
                    <p className={styles.read_p_69}>
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
                <h2 className={`h2 ${styles.read_h2_9}`} >
                  Interactive Reading Practice Mini-Drills
                </h2>
                <p className={styles.read_p_10}>
                  Test your active scanning and verification precision on authentic academic excerpts.
                </p>
              </div>

              <div className={styles.interactiveStack}>
                <div className={styles.interactiveCard}>
                  <div className={styles.read_div_70}>
                    <h3 className={styles.read_h3_71}>
                      {guideData.interactiveDrills[0].title}
                    </h3>
                    <span className={`${styles.sectionIndicatorBadge} ${styles.read_span_19}`} >
                      True / False / Not Given
                    </span>
                  </div>

                  <div className={styles.drillPassage}>
                    &ldquo;{guideData.interactiveDrills[0].passage}&rdquo;
                  </div>

                  <div className={styles.read_div_72}>
                    {guideData.interactiveDrills[0].questions.map((q) => (
                      <div key={q.id} className={styles.drillQuestionRow}>
                        <div className={styles.read_div_73}>{q.statement}</div>
                        <div className={styles.read_div_74}>
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
                          <div className={styles.read_div_75}>
                            <strong className={drillAnswers[q.id] === q.correct ? styles.drillCorrectText : styles.drillIncorrectText}>
                              {drillAnswers[q.id] === q.correct ? '✓ Correct!' : `✗ Incorrect (Correct: ${q.correct})`}
                            </strong>
                            <div className={styles.read_div_76}>{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={styles.read_div_77}>
                    <button
                      type="button"
                      onClick={() => setDrillChecked(true)}
                      className={`btn btn-sm ${styles.read_button_78}`}
                      
                    >
                      Check TFNG Answers
                    </button>
                    <button
                      type="button"
                      onClick={handleResetDrill}
                      className={`btn btn-secondary btn-sm ${styles.read_button_79}`}
                      
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
                <h2 className={`h2 ${styles.read_h2_9}`} >
                  IELTS Academic Reading FAQs
                </h2>
                <p className={styles.read_p_10}>
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
                        <p className={styles.read_p_80}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* BOTTOM CALL TO ACTION BANNER */}
            <div className={styles.bottomCtaBanner}>
              <div className={styles.bottomCtaText}>
                <span className={`${styles.sectionIndicatorBadge} ${styles.read_span_81}`} >
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
                className={`btn btn-primary ${styles.read_button_82}`}
                
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
                      <span className={styles.read_span_83}>
                        {item.label}
                      </span>
                      {activeToc === item.id && (
                        <span className={styles.read_span_84}>●</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.read_div_85}>
              <button
                type="button"
                onClick={() => handleProtectedPractice('/reading')}
                className={`btn btn-primary btn-sm ${styles.read_button_86}`}
                
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
