'use client';

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
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
          placeholder="Search tests, topics, or Cambridge books..."
          style={{ width: 280 }}
        />
      </div>

      {/* Audio Engine Notice */}
      <div className="card-warm" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', borderRadius: 0 }}>
        <Info size={18} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
        <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
          <strong>Audio Architecture Notice:</strong> Listening practice sessions utilize Web Speech British RP synthesis synchronized to authentic section scripts, with automatic support for local MP3 assets in <code>/media/ielts/listening/</code>. All 4 sections per test operate offline with zero buffering delays.
        </div>
      </div>

      {/* VIEW 1: CAMBRIDGE IELTS COLLECTION */}
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
                  Cambridge IELTS Books 9 through 22 Library
                </h2>
                <p className="text-sm text-muted" style={{ margin: 0, maxWidth: 840 }}>
                  Explore complete 4-test listening suites from Cambridge University Press &amp; Assessment. Select any edition below to access its individual Tests 1 through 4 with complete section breakdowns and real-time audio playback.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent-purple)' }}>14 Books</div>
                  <div className="text-xs text-muted">56 Total Tests</div>
                </div>
                <div style={{ width: 1, height: 36, background: 'var(--border)' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#B45309' }}>224 Sections</div>
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
                    <span>{book.year} • {book.publisher}</span>
                  </div>

                  <p className="text-xs text-muted" style={{ lineHeight: 1.5, marginBottom: 12 }}>
                    {book.overview}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Layers size={13} color="var(--accent-purple)" />
                      <span><strong>Tests:</strong> {book.tests.length} Complete Tests (Parts 1–4)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Volume2 size={13} color="#047857" />
                      <span><strong>Audio:</strong> {book.audioStatus.split('(')[0].trim()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileCheck size={13} color="#B45309" />
                      <span><strong>Questions:</strong> {book.questionStatus}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {book.isbn}
                  </span>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}
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
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Back button */}
          <div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedBookNum(null)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 0 }}
            >
              <ChevronLeft size={15} />
              <span>Back to All Cambridge Books</span>
            </button>
          </div>

          {/* Book Banner */}
          <div
            className="card"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: 0,
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className="badge badge-purple">Volume {activeBook.bookNumber}</span>
                  <span className="badge badge-yellow">{activeBook.year} Edition</span>
                  <span className="badge badge-neutral">{activeBook.status}</span>
                </div>

                <h2 className="h2" style={{ margin: '0 0 6px 0' }}>
                  {activeBook.title}
                </h2>
                <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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
                className="btn btn-outline btn-sm"
                style={{ borderRadius: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <span>Cambridge Official Catalog</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, maxWidth: 960 }}>
              {activeBook.overview}
            </p>

            <div className="card-warm card-compact text-xs text-muted" style={{ borderRadius: 0 }}>
              <strong>Licensing &amp; Practice Information:</strong> {activeBook.licenseNote} Official audio and Cambridge One resources are accessible via authorized Cambridge University Press portals.
            </div>
          </div>

          {/* Tests List for Selected Book */}
          <h3 className="h3" style={{ marginTop: 8 }}>
            Available Practice Tests ({activeBookTests.length})
          </h3>

          <div className="grid-2">
            {activeBookTests.map((test) => {
              const saved = bookmarks.tests.includes(test.id);

              return (
                <div
                  key={test.id}
                  className="card card-interactive"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 14,
                    borderRadius: 0,
                    border: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 6 }}>
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

                    <h4 style={{ fontSize: '1.08rem', fontWeight: 700, margin: '0 0 10px 0' }}>
                      {test.title}
                    </h4>

                    {/* 4 Parts Breakdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      {test.parts.map((pt) => (
                        <div
                          key={pt.partNumber}
                          style={{
                            fontSize: '0.8rem',
                            padding: '6px 10px',
                            background: '#FAF9F5',
                            border: '1px solid var(--border)',
                            borderRadius: 0,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {pt.title}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                            {Math.round(pt.durationSec / 60)} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} /> 30 min • 40 Questions
                    </span>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}
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
        <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Legacy Grouped Collections */}
          <div className="grid-3">
            {groupedLegacy.map(([colTitle, items]) => (
              <div key={colTitle} data-animate="card" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, borderRadius: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 0,
                      backgroundColor: 'var(--accent-yellow-soft)',
                      color: '#9A6900',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Headphones size={17} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>{colTitle}</div>
                    <div className="text-xs text-muted">{items.length} TESTS • {items[0]?.category}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((test, idx) => (
                    <button
                      key={test.id}
                      type="button"
                      onClick={() => {
                        setSelectedTest(test);
                        setStartPart('1');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 0,
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-primary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 0,
                            backgroundColor: 'var(--surface)',
                            border: '1px solid var(--border)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{test.title}</div>
                          <div className="text-xs text-muted">{test.accent} • {test.difficulty}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
            <h2 className="h2" style={{ marginBottom: 14 }}>All Listening Practice Sets ({filteredTests.length})</h2>
            <div className="grid-2">
              {filteredTests.map((test) => {
                const saved = bookmarks.tests.includes(test.id);
                return (
                  <div key={test.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 6 }}>
                      <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={13} /> {test.durationMinutes} min • {test.difficulty}
                      </span>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ borderRadius: 0 }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div className="field-label" style={{ marginBottom: 8 }}>Select Starting Section</div>
              <div className="filter-pills">
                {selectedTest.parts.map((pt) => (
                  <button
                    key={pt.partNumber}
                    type="button"
                    className={`filter-pill ${startPart === String(pt.partNumber) ? 'active' : ''}`}
                    onClick={() => setStartPart(String(pt.partNumber))}
                    style={{ borderRadius: 0 }}
                  >
                    Part {pt.partNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Part Preview */}
            {selectedTest.parts.find((p) => String(p.partNumber) === startPart) && (
              <div
                style={{
                  background: '#FAF9F5',
                  border: '1px solid var(--border)',
                  padding: '12px 14px',
                  borderRadius: 0,
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {selectedTest.parts.find((p) => String(p.partNumber) === startPart)?.title}
                </div>
                <div className="text-muted">
                  {selectedTest.parts.find((p) => String(p.partNumber) === startPart)?.context}
                </div>
              </div>
            )}

            <div className="card-warm card-compact text-xs text-muted" style={{ lineHeight: 1.6, borderRadius: 0 }}>
              <strong>Instructions:</strong> Preview the questions before starting playback. The audio plays continuously. Spellings, plural forms, and word limits must be exact. All 40 questions across Parts 1–4 are evaluated upon submission.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ borderRadius: 0 }}
                onClick={() => setSelectedTest(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ borderRadius: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}
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
