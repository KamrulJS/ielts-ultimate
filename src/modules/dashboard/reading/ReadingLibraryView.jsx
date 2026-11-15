'use client';
import styles from './ReadingLibraryView.module.css';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ArrowRight,
  Info,
  Clock,
  Bookmark,
  CheckCircle2,
  FolderOpen,
  ChevronLeft,
  Calendar,
  Sparkles,
  Layers,
  FileCheck,
  ExternalLink,
  BookMarked,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import { Modal } from '@/components/common/Modal';

import readingTests from '@/data/reading/tests.json';
import cambridgeBooks from '@/data/reading/cambridge-reading-books.json';
import collections from '@/data/reading/collections.json';
import passages from '@/data/reading/passages.json';

export function ReadingLibraryView() {
  const router = useRouter();
  const { bookmarks, toggleBookmark } = useApp();
  const rootRef = useGsapEntrance('reading-library');

  const [category, setCategory] = useState('Cambridge IELTS');
  const [search, setSearch] = useState('');
  const [selectedBookNum, setSelectedBookNum] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [timedMode, setTimedMode] = useState(true);

  // Filtered Cambridge books
  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cambridgeBooks;
    return cambridgeBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        String(b.bookNumber).includes(q) ||
        b.overview.toLowerCase().includes(q)
    );
  }, [search]);

  // Selected Cambridge Book details
  const activeBook = useMemo(() => {
    if (!selectedBookNum) return null;
    return cambridgeBooks.find((b) => b.bookNumber === selectedBookNum) || null;
  }, [selectedBookNum]);

  // Tests for active Cambridge book
  const activeBookTests = useMemo(() => {
    if (!selectedBookNum) return [];
    return readingTests.filter((t) => t.bookNumber === selectedBookNum);
  }, [selectedBookNum]);

  // Filtered tests for other categories
  const filteredTests = useMemo(() => {
    const q = search.trim().toLowerCase();
    return readingTests
      .filter((t) => {
        if (category === 'Cambridge IELTS') {
          return t.category === 'Cambridge Official Collection';
        }
        if (category === 'All') return true;
        return t.category === category;
      })
      .filter((t) =>
        !q
          ? true
          : t.title.toLowerCase().includes(q) ||
            (t.collection && t.collection.toLowerCase().includes(q))
      );
  }, [category, search]);

  const handleLaunchTest = (test, passageIdx = 0) => {
    setSelectedTest(test);
    setSelectedPassageIndex(passageIdx);
  };

  const confirmStartTest = () => {
    if (!selectedTest) return;
    const passage = selectedTest.passages?.[selectedPassageIndex] || selectedTest.passages?.[0];
    const targetId = passage?.id || selectedTest.id;
    router.push(`/reading/test/${targetId}`);
  };

  return (
    <div ref={rootRef} className={styles.read_div_1}>
      <PageHeader
        title="IELTS Reading Practice Library"
        description="Authentic Cambridge IELTS Academic Reading collection (Books 9–25) with full 3-passage examination sets, split-screen reading interface, live question navigator, and instant band scoring."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reading', href: '/reading' },
          ...(activeBook ? [{ label: `Cambridge ${activeBook.bookNumber}` }] : []),
        ]}
        badge={<Badge variant="yellow">Cambridge Books 9–25 Integrated</Badge>}
        actions={<Badge variant="purple">IELTS Academic Dedicated</Badge>}
      />

      {/* Category Pills & Search Controls */}
      <div className={styles.read_div_2}>
        <div className="filter-pills">
          {[
            { key: 'Cambridge IELTS', label: 'Cambridge IELTS (Books 9–25)', badge: '68 Tests' },
            { key: 'All', label: 'All Practice Sets' },
            { key: 'Recent Real Tests', label: 'Recent Real Tests', badge: 'NEW' },
            { key: 'Official-Style Library', label: 'Official-Style Library' },
            { key: 'Road to IELTS', label: 'Road to IELTS' },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`filter-pill ${category === cat.key ? 'active' : ''}`}
              onClick={() => {
                setCategory(cat.key);
                setSelectedBookNum(null);
              }}
            >
              <span>{cat.label}</span>
              {cat.badge && (
                <Badge variant={cat.badge === 'NEW' ? 'yellow' : 'neutral'} className={styles.read_badge_3}>
                  {cat.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search passages, topics, or Cambridge books..."
          className={styles.read_searchbar_4}
        />
      </div>

      {/* Reading Architecture Guidance Notice */}
      <div className={`card-warm ${styles.read_div_5}`} >
        <Info size={18} className={styles.read_info_6} />
        <div className={`text-xs text-muted ${styles.read_div_7}`} >
          <strong>Exam Architecture Notice:</strong> IELTS Reading grants exactly 60 minutes with ZERO extra transfer time. All 3 passages and 40 questions per test feature adjustable split-screen layouts, text highlighters, personal scratchpads, and live question navigation palettes.
        </div>
      </div>

      {/* VIEW 1: CAMBRIDGE IELTS COLLECTION OVERVIEW (Books 9–25) */}
      {category === 'Cambridge IELTS' && !selectedBookNum && (
        <section className={styles.read_section_8}>
          {/* Collection Metrics Summary Card */}
          <div
            className={`card ${styles.read_div_9}`}
            
          >
            <div className={styles.read_div_10}>
              <div>
                <span className={`badge badge-purple ${styles.read_span_11}`} >
                  Official Past Examination Collection
                </span>
                <h2 className={`h2 ${styles.read_h2_12}`} >
                  Cambridge IELTS Books 9 through 25 Academic Library
                </h2>
                <p className={`text-sm text-muted ${styles.read_p_13}`} >
                  Explore complete 4-test Academic Reading suites from Cambridge University Press &amp; Assessment. Select any edition below to access its individual Tests 1 through 4 with authentic 3-passage breakdowns and split-screen examination interfaces.
                </p>
              </div>

              <div className={styles.read_div_14}>
                <div className={styles.read_div_15}>
                  <div className={styles.read_div_16}>17 Books</div>
                  <div className="text-xs text-muted">13 Published &bull; 4 Forthcoming</div>
                </div>
                <div className={styles.read_div_17} />
                <div>
                  <div className={styles.read_div_18}>156 Passages</div>
                  <div className="text-xs text-muted">2,080 Questions</div>
                </div>
              </div>
            </div>
          </div>

          {/* 17 Book Cards Grid */}
          <div className="grid-3">
            {filteredBooks.map((book) => (
              <div
                key={book.bookNumber}
                className="card card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  borderRadius: 0,
                  border: book.isForthcoming ? '1px dashed var(--border)' : '1px solid var(--border)',
                  backgroundColor: book.isForthcoming ? '#FAF9F5' : '#FFFFFF',
                }}
              >
                <div>
                  <div className={styles.read_div_19}>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background: book.isForthcoming ? '#F3F4F6' : 'var(--accent-yellow-soft)',
                        color: book.isForthcoming ? '#4B5563' : '#9A6900',
                        padding: '4px 8px',
                        border: '1px solid var(--border)',
                        borderRadius: 0,
                      }}
                    >
                      Cambridge {book.bookNumber}
                    </span>

                    <span
                      className="badge"
                      style={{
                        backgroundColor: book.isForthcoming ? '#FEF3C7' : '#ECFDF5',
                        color: book.isForthcoming ? '#B45309' : '#047857',
                        border: 'none',
                        fontSize: '0.72rem',
                      }}
                    >
                      {book.status}
                    </span>
                  </div>

                  <h3 className={`h3 ${styles.read_h3_20}`} >
                    {book.title}
                  </h3>

                  <div className={`text-xs text-muted ${styles.read_div_21}`} >
                    <Calendar size={13} />
                    <span>{book.year} &bull; {book.publisher}</span>
                  </div>

                  <p className={`text-xs text-muted ${styles.read_p_22}`} >
                    {book.overview}
                  </p>
                </div>

                <div>
                  <div
                    className={styles.read_div_23}
                  >
                    <div className="text-xs text-muted">
                      <strong>{book.testCount} Tests</strong> &bull; {book.passagesCount} Passages
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedBookNum(book.bookNumber)}
                      className={`btn btn-primary btn-sm ${styles.read_button_24}`}
                      
                    >
                      <span>{book.isForthcoming ? 'View Syllabus' : 'Explore Tests'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIEW 2: SELECTED CAMBRIDGE BOOK TESTS */}
      {category === 'Cambridge IELTS' && selectedBookNum && activeBook && (
        <section className={styles.read_section_8}>
          {/* Back button & Book Overview Banner */}
          <div>
            <button
              type="button"
              onClick={() => setSelectedBookNum(null)}
              className={`btn btn-ghost btn-sm ${styles.read_button_25}`}
              
            >
              <ChevronLeft size={16} /> Back to Cambridge Books Collection
            </button>

            <div
              className="card"
              style={{
                borderRadius: 0,
                border: '1px solid var(--border)',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                backgroundColor: activeBook.isForthcoming ? '#FAF9F5' : '#FFFFFF',
              }}
            >
              <div className={styles.read_div_26}>
                <div>
                  <div className={styles.read_div_27}>
                    <span className="badge badge-yellow">Book {activeBook.bookNumber}</span>
                    <Badge variant={activeBook.isForthcoming ? 'yellow' : 'neutral'}>
                      {activeBook.status}
                    </Badge>
                    <span className="text-xs text-muted">{activeBook.year}</span>
                  </div>
                  <h2 className={`h2 ${styles.read_h2_28}`} >{activeBook.title}</h2>
                  <p className={`text-sm text-muted ${styles.read_p_29}`} >
                    {activeBook.overview}
                  </p>
                </div>

                <div className={styles.read_div_30}>
                  <div className="text-xs text-muted"><strong>ISBN:</strong> {activeBook.isbn}</div>
                  <div className="text-xs text-muted"><strong>Publisher:</strong> {activeBook.publisher}</div>
                  {activeBook.officialUrl && (
                    <a
                      href={activeBook.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs ${styles.read_a_31}`}
                      
                    >
                      Official Cambridge Catalog <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Book Tests Grid */}
          <div className={styles.read_div_32}>
            <div className={styles.read_div_33}>
              <h3 className={`h3 ${styles.read_h2_28}`} >
                Academic Reading Tests (Tests 1 through 4)
              </h3>
              <span className="text-xs text-muted">
                3 Passages &bull; 40 Questions &bull; 60 Minutes per Test
              </span>
            </div>

            <div className={`grid-2 ${styles.read_div_34}`} >
              {activeBookTests.map((test) => {
                const isBookmarked = bookmarks?.has?.(test.id);
                return (
                  <div
                    key={test.id}
                    className={`card ${styles.read_div_35}`}
                    
                  >
                    <div className={styles.read_div_36}>
                      <div>
                        <div className={styles.read_div_37}>
                          <span
                            className={styles.read_span_38}
                          >
                            Test {test.testNumber}
                          </span>
                          <Badge variant={test.difficulty === 'Challenging' ? 'purple' : 'neutral'}>
                            {test.difficulty}
                          </Badge>
                        </div>
                        <h4 className={styles.read_h4_39}>
                          {test.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBookmark?.(test.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: 6, color: isBookmarked ? '#B45309' : 'var(--text-muted)' }}
                        title="Bookmark Test"
                      >
                        <Bookmark size={18} fill={isBookmarked ? '#B45309' : 'none'} />
                      </button>
                    </div>

                    {/* Passages List */}
                    <div className={styles.read_div_40}>
                      <div className={`text-xs text-muted ${styles.read_div_41}`} >
                        Included Reading Passages:
                      </div>
                      {test.passages?.map((p, pIdx) => (
                        <div
                          key={p.id || pIdx}
                          onClick={() => handleLaunchTest(test, pIdx)}
                          className={styles.read_div_42}
                        >
                          <div>
                            <div className={styles.read_div_43}>
                              Passage {p.passageNumber}: {p.title}
                            </div>
                            <div className={`text-xs text-muted ${styles.read_div_44}`} >
                              {p.questionTypes?.join(', ')} &bull; ~{p.wordCount} words
                            </div>
                          </div>
                          <span className={`text-xs ${styles.read_span_45}`} >
                            Practice &rarr;
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.read_div_46}>
                      <span className={`text-xs text-muted ${styles.read_span_47}`} >
                        <Clock size={13} /> 60 Minutes &bull; 40 Questions
                      </span>

                      <button
                        type="button"
                        onClick={() => handleLaunchTest(test, 0)}
                        className={`btn btn-primary btn-sm ${styles.read_button_24}`}
                        
                      >
                        Start Full 60m Test &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* VIEW 3: LEGACY COLLECTIONS & OTHER SETS */}
      {category !== 'Cambridge IELTS' && (
        <section className={styles.read_section_8}>
          <div className="grid-3">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className={`card card-interactive ${styles.read_div_48}`}
                
              >
                <div className={styles.read_div_36}>
                  <Badge variant="purple">{test.category || 'Reading'}</Badge>
                  <span className="text-xs text-muted">{test.durationMinutes || 60}m</span>
                </div>

                <h4 className={styles.read_h4_49}>{test.title}</h4>

                <div className="text-xs text-muted">
                  {test.passages?.length || 1} Passages &bull; {test.difficulty || 'Standard'}
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchTest(test, 0)}
                  className={`btn btn-primary btn-sm ${styles.read_button_50}`}
                  
                >
                  Start Reading Test &rarr;
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Test Launch Configuration Modal */}
      {selectedTest && (
        <Modal
          isOpen={Boolean(selectedTest)}
          onClose={() => setSelectedTest(null)}
          title={`Configure Reading Examination: ${selectedTest.title}`}
          maxWidth="600px"
        >
          <div className={styles.read_div_51}>
            <div className={`card-warm ${styles.read_div_52}`} >
              <div className={styles.read_div_53}>
                {selectedTest.collection || selectedTest.title}
              </div>
              <p className={`text-xs text-muted ${styles.read_p_54}`} >
                Authentic IELTS Academic Reading test interface with split-screen passage viewing, active question navigator, highlighters, and instant band conversion.
              </p>
            </div>

            <div className={styles.read_div_40}>
              <label className={styles.read_label_55}>Select Starting Passage</label>
              <div className={styles.read_div_56}>
                {selectedTest.passages?.map((p, idx) => (
                  <label
                    key={p.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      border: '1px solid var(--border)',
                      background: selectedPassageIndex === idx ? 'rgba(136, 103, 184, 0.08)' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="startingPassage"
                      checked={selectedPassageIndex === idx}
                      onChange={() => setSelectedPassageIndex(idx)}
                    />
                    <div className={styles.read_div_57}>
                      <strong>Passage {p.passageNumber}:</strong> {p.title}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.read_div_40}>
              <label className={styles.read_label_55}>Pacing &amp; Timer Mode</label>
              <div className={styles.read_div_58}>
                <button
                  type="button"
                  onClick={() => setTimedMode(true)}
                  className={`btn btn-sm ${timedMode ? 'btn-primary' : 'btn-secondary'} ${styles.read_button_59}`}
                  
                >
                  Timed (60 Mins Strict)
                </button>
                <button
                  type="button"
                  onClick={() => setTimedMode(false)}
                  className={`btn btn-sm ${!timedMode ? 'btn-primary' : 'btn-secondary'} ${styles.read_button_59}`}
                  
                >
                  Untimed Practice
                </button>
              </div>
            </div>

            <div className={styles.read_div_60}>
              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                className={`btn btn-secondary ${styles.read_button_24}`}
                
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStartTest}
                className={`btn btn-primary ${styles.read_button_24}`}
                
              >
                Begin Reading Examination &rarr;
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
