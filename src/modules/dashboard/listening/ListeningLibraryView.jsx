'use client';
import styles from './ListeningLibraryView.module.css';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Headphones,
  ArrowRight,
  Info,
  Clock,
  CheckCircle2,
  Bookmark,
  BookOpen,
  ExternalLink,
  ChevronLeft,
  Calendar,
  Sparkles,
  Layers,
  Volume2,
  FileCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import { Modal } from '@/components/common/Modal';

import listeningTests from '@/data/listening/tests.json';
import cambridgeBooks from '@/data/listening/cambridge-books.json';

export function ListeningLibraryView() {
  const router = useRouter();
  const { bookmarks, toggleBookmark } = useApp();
  const rootRef = useGsapEntrance('listening-library');

  const [category, setCategory] = useState('Cambridge IELTS');
  const [search, setSearch] = useState('');
  const [selectedBookNum, setSelectedBookNum] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [startPart, setStartPart] = useState('1');

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
    return listeningTests.filter((t) => t.bookNumber === selectedBookNum);
  }, [selectedBookNum]);

  // General filtered tests (for other categories or search)
  const filteredTests = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listeningTests
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
            t.collection.toLowerCase().includes(q) ||
            t.accent.toLowerCase().includes(q)
      );
  }, [category, search]);

  // Grouped collections for legacy categories
  const groupedLegacy = useMemo(() => {
    const map = new Map();
    filteredTests
      .filter((t) => t.category !== 'Cambridge Official Collection')
      .forEach((item) => {
        if (!map.has(item.collection)) map.set(item.collection, []);
        map.get(item.collection).push(item);
      });
    return Array.from(map.entries());
  }, [filteredTests]);

  return (
    <div ref={rootRef} className={styles.list_div_1}>
      <PageHeader
        title="IELTS Listening Practice Library"
        description="Authentic Cambridge IELTS examination collection (Books 9–22) with synchronized transcripts, British RP audio synthesis, and real exam scoring."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Listening', href: '/listening' },
          ...(activeBook ? [{ label: `Cambridge ${activeBook.bookNumber}` }] : []),
        ]}
        badge={<Badge variant="yellow">Cambridge Books 9–22 Integrated</Badge>}
      />

      {/* Category Pills & Search Controls */}
      <div className={styles.list_div_2}>
        <div className="filter-pills">
          {[
            { key: 'Cambridge IELTS', label: 'Cambridge IELTS (Books 9–22)', badge: '56 Tests' },
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
                <Badge variant={cat.badge === 'NEW' ? 'yellow' : 'neutral'} className={styles.list_badge_3}>
                  {cat.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search tests, topics, or Cambridge books..."
          className={styles.list_searchbar_4}
        />
      </div>

      {/* Audio Engine Notice */}
      <div className={`card-warm ${styles.list_div_5}`} >
        <Info size={18} className={styles.list_info_6} />
        <div className={`text-xs text-muted ${styles.list_div_7}`} >
          <strong>Audio Architecture Notice:</strong> Listening practice sessions utilize Web Speech British RP synthesis synchronized to authentic section scripts, with automatic support for local MP3 assets in <code>/media/ielts/listening/</code>. All 4 sections per test operate offline with zero buffering delays.
        </div>
      </div>

      {/* VIEW 1: CAMBRIDGE IELTS COLLECTION */}
      {category === 'Cambridge IELTS' && !selectedBookNum && (
        <section className={styles.list_section_8}>
          {/* Collection Metrics Summary Card */}
          <div
            className={`card ${styles.list_div_9}`}
            
          >
            <div className={styles.list_div_10}>
              <div>
                <span className={`badge badge-purple ${styles.list_span_11}`} >
                  Official Past Examination Collection
                </span>
                <h2 className={`h2 ${styles.list_h2_12}`} >
                  Cambridge IELTS Books 9 through 22 Library
                </h2>
                <p className={`text-sm text-muted ${styles.list_p_13}`} >
                  Explore complete 4-test listening suites from Cambridge University Press &amp; Assessment. Select any edition below to access its individual Tests 1 through 4 with complete section breakdowns and real-time audio playback.
                </p>
              </div>

              <div className={styles.list_div_14}>
                <div className={styles.list_div_15}>
                  <div className={styles.list_div_16}>14 Books</div>
                  <div className="text-xs text-muted">56 Total Tests</div>
                </div>
                <div className={styles.list_div_17} />
                <div>
                  <div className={styles.list_div_18}>224 Sections</div>
                  <div className="text-xs text-muted">2,240 Questions</div>
                </div>
              </div>
            </div>
          </div>

          {/* 14 Book Cards Grid */}
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
                  <div className={styles.list_div_19}>
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

                  <h3 className={`h3 ${styles.list_h3_20}`} >
                    {book.title}
                  </h3>

                  <div className={`text-xs text-muted ${styles.list_div_21}`} >
                    <Calendar size={13} />
                    <span>{book.year} • {book.publisher}</span>
                  </div>

                  <p className={`text-xs text-muted ${styles.list_p_22}`} >
                    {book.overview}
                  </p>

                  <div className={styles.list_div_23}>
                    <div className={styles.list_div_24}>
                      <Layers size={13} color="var(--accent-purple)" />
                      <span><strong>Tests:</strong> {book.tests.length} Complete Tests (Parts 1–4)</span>
                    </div>
                    <div className={styles.list_div_24}>
                      <Volume2 size={13} color="#047857" />
                      <span><strong>Audio:</strong> {book.audioStatus.split('(')[0].trim()}</span>
                    </div>
                    <div className={styles.list_div_24}>
                      <FileCheck size={13} color="#B45309" />
                      <span><strong>Questions:</strong> {book.questionStatus}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.list_div_25}>
                  <span className={`text-xs ${styles.list_span_26}`} >
                    {book.isbn}
                  </span>

                  <button
                    type="button"
                    className={`btn btn-primary btn-sm ${styles.list_button_27}`}
                    
                    onClick={() => setSelectedBookNum(book.bookNumber)}
                  >
                    <span>{book.isForthcoming ? 'Preview Tests' : 'Open Book Tests'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIEW 2: INDIVIDUAL CAMBRIDGE BOOK DETAIL PAGE */}
      {category === 'Cambridge IELTS' && activeBook && (
        <section className={styles.list_section_8}>
          {/* Back button */}
          <div>
            <button
              type="button"
              className={`btn btn-secondary btn-sm ${styles.list_button_28}`}
              onClick={() => setSelectedBookNum(null)}
              
            >
              <ChevronLeft size={15} />
              <span>Back to All Cambridge Books</span>
            </button>
          </div>

          {/* Book Banner */}
          <div
            className={`card ${styles.list_div_29}`}
            
          >
            <div className={styles.list_div_30}>
              <div>
                <div className={styles.list_div_31}>
                  <span className="badge badge-purple">Volume {activeBook.bookNumber}</span>
                  <span className="badge badge-yellow">{activeBook.year} Edition</span>
                  <span className="badge badge-neutral">{activeBook.status}</span>
                </div>

                <h2 className={`h2 ${styles.list_h2_32}`} >
                  {activeBook.title}
                </h2>
                <div className={`text-xs text-muted ${styles.list_div_33}`} >
                  <span>Publisher: {activeBook.publisher}</span>
                  <span>•</span>
                  <span>ISBN: {activeBook.isbn}</span>
                  <span>•</span>
                  <span>Tests: 4 Authentic Sets (16 Sections)</span>
                </div>
              </div>

              <a
                href={activeBook.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-outline btn-sm ${styles.list_button_27}`}
                
              >
                <span>Cambridge Official Catalog</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <p className={`text-sm ${styles.list_p_34}`} >
              {activeBook.overview}
            </p>

            <div className={`card-warm card-compact text-xs text-muted ${styles.list_div_35}`} >
              <strong>Licensing &amp; Practice Information:</strong> {activeBook.licenseNote} Official audio and Cambridge One resources are accessible via authorized Cambridge University Press portals.
            </div>
          </div>

          {/* Tests List for Selected Book */}
          <h3 className={`h3 ${styles.list_h3_36}`} >
            Available Practice Tests ({activeBookTests.length})
          </h3>

          <div className="grid-2">
            {activeBookTests.map((test) => {
              const saved = bookmarks.tests.includes(test.id);

              return (
                <div
                  key={test.id}
                  className={`card card-interactive ${styles.list_div_37}`}
                  
                >
                  <div>
                    <div className={styles.list_div_38}>
                      <div className={styles.list_div_39}>
                        <span className="badge badge-purple">Test {test.testNumber}</span>
                        <span className="badge badge-neutral">{test.accent}</span>
                        <span className="badge badge-yellow">{test.difficulty}</span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => toggleBookmark('tests', test.id, 'Saved Tests')}
                        title="Bookmark test"
                      >
                        <Bookmark
                          size={15}
                          fill={saved ? 'var(--accent-yellow)' : 'none'}
                          color={saved ? '#B48200' : 'var(--text-secondary)'}
                        />
                      </button>
                    </div>

                    <h4 className={styles.list_h4_40}>
                      {test.title}
                    </h4>

                    {/* 4 Parts Breakdown */}
                    <div className={styles.list_div_41}>
                      {test.parts.map((pt) => (
                        <div
                          key={pt.partNumber}
                          className={styles.list_div_42}
                        >
                          <span className={styles.list_span_43}>
                            {pt.title}
                          </span>
                          <span className={styles.list_span_44}>
                            {Math.round(pt.durationSec / 60)} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.list_div_45}>
                    <span className={`text-xs text-muted ${styles.list_span_46}`} >
                      <Clock size={13} /> 30 min • 40 Questions
                    </span>

                    <button
                      type="button"
                      className={`btn btn-primary btn-sm ${styles.list_button_27}`}
                      
                      onClick={() => {
                        setSelectedTest(test);
                        setStartPart('1');
                      }}
                    >
                      <span>Configure &amp; Start Test</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* VIEW 3: LEGACY / OTHER CATEGORIES VIEW */}
      {category !== 'Cambridge IELTS' && (
        <section className={styles.list_div_1}>
          {/* Legacy Grouped Collections */}
          <div className="grid-3">
            {groupedLegacy.map(([colTitle, items]) => (
              <div key={colTitle} data-animate="card" className={`card ${styles.list_div_47}`} >
                <div className={styles.list_div_48}>
                  <span
                    className={styles.list_span_49}
                  >
                    <Headphones size={17} />
                  </span>
                  <div>
                    <div className={styles.list_div_50}>{colTitle}</div>
                    <div className="text-xs text-muted">{items.length} TESTS • {items[0]?.category}</div>
                  </div>
                </div>

                <div className={styles.list_div_51}>
                  {items.map((test, idx) => (
                    <button
                      key={test.id}
                      type="button"
                      onClick={() => {
                        setSelectedTest(test);
                        setStartPart('1');
                      }}
                      className={styles.list_button_52}
                    >
                      <div className={styles.list_div_53}>
                        <span
                          className={styles.list_span_54}
                        >
                          {idx + 1}
                        </span>
                        <div className={styles.list_div_55}>
                          <div className={styles.list_div_56}>{test.title}</div>
                          <div className="text-xs text-muted">{test.accent} • {test.difficulty}</div>
                        </div>
                      </div>
                      <div className={styles.list_div_24}>
                        {test.completedScore && <Badge variant="success">{test.completedScore}</Badge>}
                        <ArrowRight size={14} className="text-muted" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* All Practice Sets in selected category */}
          <div>
            <h2 className={`h2 ${styles.list_h2_57}`} >All Listening Practice Sets ({filteredTests.length})</h2>
            <div className="grid-2">
              {filteredTests.map((test) => {
                const saved = bookmarks.tests.includes(test.id);
                return (
                  <div key={test.id} className={`card card-interactive ${styles.list_div_58}`} >
                    <div className={styles.list_div_59}>
                      <div className={styles.list_div_39}>
                        <Badge variant="yellow">{test.category}</Badge>
                        <Badge variant="neutral">{test.accent}</Badge>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => toggleBookmark('tests', test.id, 'Saved Tests')}
                      >
                        <Bookmark size={15} fill={saved ? 'var(--accent-yellow)' : 'none'} color={saved ? '#B48200' : 'var(--text-secondary)'} />
                      </button>
                    </div>
                    <h3 className="h3">{test.title}</h3>
                    <p className="text-xs text-muted">4 sections: Everyday Dialogue, Orientation Map, Academic Tutorial &amp; University Lecture</p>
                    <div className={styles.list_div_60}>
                      <span className={`text-xs text-muted ${styles.list_span_61}`} >
                        <Clock size={13} /> {test.durationMinutes} min • {test.difficulty}
                      </span>
                      <button
                        type="button"
                        className={`btn btn-primary btn-sm ${styles.list_div_35}`}
                        
                        onClick={() => {
                          setSelectedTest(test);
                          setStartPart('1');
                        }}
                      >
                        Configure &amp; Start →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Test Configuration Modal */}
      <Modal
        open={Boolean(selectedTest)}
        onClose={() => setSelectedTest(null)}
        title={selectedTest?.title}
        subtitle={`${selectedTest?.accent} • ${selectedTest?.durationMinutes} minutes • 4 Parts`}
      >
        {selectedTest && (
          <div className={styles.list_div_62}>
            <div>
              <div className={`field-label ${styles.list_div_63}`} >Select Starting Section</div>
              <div className="filter-pills">
                {selectedTest.parts.map((pt) => (
                  <button
                    key={pt.partNumber}
                    type="button"
                    className={`filter-pill ${startPart === String(pt.partNumber) ? 'active' : ''} ${styles.list_div_35}`}
                    onClick={() => setStartPart(String(pt.partNumber))}
                    
                  >
                    Part {pt.partNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Part Preview */}
            {selectedTest.parts.find((p) => String(p.partNumber) === startPart) && (
              <div
                className={styles.list_div_64}
              >
                <div className={styles.list_div_65}>
                  {selectedTest.parts.find((p) => String(p.partNumber) === startPart)?.title}
                </div>
                <div className="text-muted">
                  {selectedTest.parts.find((p) => String(p.partNumber) === startPart)?.context}
                </div>
              </div>
            )}

            <div className={`card-warm card-compact text-xs text-muted ${styles.list_div_66}`} >
              <strong>Instructions:</strong> Preview the questions before starting playback. The audio plays continuously. Spellings, plural forms, and word limits must be exact. All 40 questions across Parts 1–4 are evaluated upon submission.
            </div>

            <div className={styles.list_div_67}>
              <button
                type="button"
                className={`btn btn-secondary ${styles.list_div_35}`}
                
                onClick={() => setSelectedTest(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn btn-primary ${styles.list_button_27}`}
                
                onClick={() => {
                  const id = selectedTest.id;
                  setSelectedTest(null);
                  router.push(`/listening/test/${id}?part=${startPart}`);
                }}
              >
                <CheckCircle2 size={15} /> Enter Listening Exam
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
