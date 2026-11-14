'use client';

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
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
                <Badge variant={cat.badge === 'NEW' ? 'yellow' : 'neutral'} style={{ fontSize: '0.7rem' }}>
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
          style={{ width: 280 }}
        />
      </div>

      {/* Reading Architecture Guidance Notice */}
      <div className="card-warm" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', borderRadius: 0 }}>
        <Info size={18} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
        <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
          <strong>Exam Architecture Notice:</strong> IELTS Reading grants exactly 60 minutes with ZERO extra transfer time. All 3 passages and 40 questions per test feature adjustable split-screen layouts, text highlighters, personal scratchpads, and live question navigation palettes.
        </div>
      </div>

      {/* VIEW 1: CAMBRIDGE IELTS COLLECTION OVERVIEW (Books 9–25) */}
      {category === 'Cambridge IELTS' && !selectedBookNum && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Collection Metrics Summary Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, #F1EFE6 0%, #FAF9F5 100%)',
              border: '1px solid var(--border)',
              borderRadius: 0,
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <span className="badge badge-purple" style={{ textTransform: 'uppercase' }}>
                  Official Past Examination Collection
                </span>
                <h2 className="h2" style={{ marginTop: 6, marginBottom: 4 }}>
                  Cambridge IELTS Books 9 through 25 Academic Library
                </h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 840 }}>
                  Explore complete 4-test Academic Reading suites from Cambridge University Press &amp; Assessment. Select any edition below to access its individual Tests 1 through 4 with authentic 3-passage breakdowns and split-screen examination interfaces.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent-purple)' }}>17 Books</div>
                  <div className="text-xs text-muted">13 Published &bull; 4 Forthcoming</div>
                </div>
                <div style={{ width: 1, height: 36, background: 'var(--border)' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#B45309' }}>156 Passages</div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
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

                  <h3 className="h3" style={{ fontSize: '1.05rem', marginBottom: 6 }}>
                    {book.title}
                  </h3>

                  <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <Calendar size={13} />
                    <span>{book.year} &bull; {book.publisher}</span>
                  </div>

                  <p className="text-xs text-muted" style={{ lineHeight: 1.55, margin: '0 0 12px 0' }}>
                    {book.overview}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div className="text-xs text-muted">
                      <strong>{book.testCount} Tests</strong> &bull; {book.passagesCount} Passages
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedBookNum(book.bookNumber)}
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: 0 }}
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
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Back button & Book Overview Banner */}
          <div>
            <button
              type="button"
              onClick={() => setSelectedBookNum(null)}
              className="btn btn-ghost btn-sm"
              style={{ borderRadius: 0, marginBottom: 14, color: 'var(--text-secondary)' }}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="badge badge-yellow">Book {activeBook.bookNumber}</span>
                    <Badge variant={activeBook.isForthcoming ? 'yellow' : 'neutral'}>
                      {activeBook.status}
                    </Badge>
                    <span className="text-xs text-muted">{activeBook.year}</span>
                  </div>
                  <h2 className="h2" style={{ margin: 0 }}>{activeBook.title}</h2>
                  <p className="text-sm text-muted" style={{ margin: '6px 0 0', maxWidth: 880 }}>
                    {activeBook.overview}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'right' }}>
                  <div className="text-xs text-muted"><strong>ISBN:</strong> {activeBook.isbn}</div>
                  <div className="text-xs text-muted"><strong>Publisher:</strong> {activeBook.publisher}</div>
                  {activeBook.officialUrl && (
                    <a
                      href={activeBook.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                      style={{ color: 'var(--accent-purple)', display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}
                    >
                      Official Cambridge Catalog <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Book Tests Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="h3" style={{ margin: 0 }}>
                Academic Reading Tests (Tests 1 through 4)
              </h3>
              <span className="text-xs text-muted">
                3 Passages &bull; 40 Questions &bull; 60 Minutes per Test
              </span>
            </div>

            <div className="grid-2" style={{ gap: 18 }}>
              {activeBookTests.map((test) => {
                const isBookmarked = bookmarks?.has?.(test.id);
                return (
                  <div
                    key={test.id}
                    className="card"
                    style={{
                      borderRadius: 0,
                      border: '1px solid var(--border)',
                      padding: 22,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              background: 'var(--accent-yellow-soft)',
                              color: '#9A6900',
                              padding: '2px 8px',
                              border: '1px solid var(--border)',
                            }}
                          >
                            Test {test.testNumber}
                          </span>
                          <Badge variant={test.difficulty === 'Challenging' ? 'purple' : 'neutral'}>
                            {test.difficulty}
                          </Badge>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div className="text-xs text-muted" style={{ fontWeight: 700, textTransform: 'uppercase' }}>
                        Included Reading Passages:
                      </div>
                      {test.passages?.map((p, pIdx) => (
                        <div
                          key={p.id || pIdx}
                          onClick={() => handleLaunchTest(test, pIdx)}
                          style={{
                            padding: '10px 12px',
                            border: '1px solid var(--border)',
                            background: '#FAF9F5',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.12s ease',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                              Passage {p.passageNumber}: {p.title}
                            </div>
                            <div className="text-xs text-muted" style={{ marginTop: 2 }}>
                              {p.questionTypes?.join(', ')} &bull; ~{p.wordCount} words
                            </div>
                          </div>
                          <span className="text-xs" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                            Practice &rarr;
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> 60 Minutes &bull; 40 Questions
                      </span>

                      <button
                        type="button"
                        onClick={() => handleLaunchTest(test, 0)}
                        className="btn btn-primary btn-sm"
                        style={{ borderRadius: 0 }}
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
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="grid-3">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="card card-interactive"
                style={{
                  borderRadius: 0,
                  border: '1px solid var(--border)',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Badge variant="purple">{test.category || 'Reading'}</Badge>
                  <span className="text-xs text-muted">{test.durationMinutes || 60}m</span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{test.title}</h4>

                <div className="text-xs text-muted">
                  {test.passages?.length || 1} Passages &bull; {test.difficulty || 'Standard'}
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchTest(test, 0)}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 0, marginTop: 'auto', justifyContent: 'center' }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card-warm" style={{ padding: 14, borderRadius: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                {selectedTest.collection || selectedTest.title}
              </div>
              <p className="text-xs text-muted" style={{ margin: '4px 0 0', lineHeight: 1.5 }}>
                Authentic IELTS Academic Reading test interface with split-screen passage viewing, active question navigator, highlighters, and instant band conversion.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Select Starting Passage</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                    <div style={{ fontSize: '0.86rem' }}>
                      <strong>Passage {p.passageNumber}:</strong> {p.title}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Pacing &amp; Timer Mode</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setTimedMode(true)}
                  className={`btn btn-sm ${timedMode ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 0, flex: 1, justifyContent: 'center' }}
                >
                  Timed (60 Mins Strict)
                </button>
                <button
                  type="button"
                  onClick={() => setTimedMode(false)}
                  className={`btn btn-sm ${!timedMode ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 0, flex: 1, justifyContent: 'center' }}
                >
                  Untimed Practice
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                onClick={() => setSelectedTest(null)}
                className="btn btn-secondary"
                style={{ borderRadius: 0 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStartTest}
                className="btn btn-primary"
                style={{ borderRadius: 0 }}
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
