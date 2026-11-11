'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ArrowRight,
  Info,
  Clock,
  Bookmark,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import { Modal } from '@/components/common/Modal';
import collections from '@/data/reading/collections.json';
import passages from '@/data/reading/passages.json';

export function ReadingLibraryView() {
  const router = useRouter();
  const { bookmarks, toggleBookmark } = useApp();
  const rootRef = useGsapEntrance('reading-library');

  const [track, setTrack] = useState('Academic');
  const [partFilter, setPartFilter] = useState('All');
  const [categoryTab, setCategoryTab] = useState('All');
  const [search, setSearch] = useState('');
  const [popupTest, setPopupTest] = useState(null);
  const [selectedPartMode, setSelectedPartMode] = useState('Full');
  const [timedMode, setTimedMode] = useState(true);

  const filteredCollections = useMemo(() => {
    const q = search.trim().toLowerCase();
    return collections
      .filter((col) => (categoryTab === 'All' ? true : col.category === categoryTab))
      .map((col) => {
        const tests = col.tests.filter((t) => {
          const matchesSearch = !q || t.topic.toLowerCase().includes(q) || col.title.toLowerCase().includes(q);
          return matchesSearch;
        });
        return { ...col, tests };
      })
      .filter((col) => col.tests.length > 0);
  }, [categoryTab, search]);

  const filteredPassages = useMemo(() => {
    const q = search.trim().toLowerCase();
    return passages.filter((p) => {
      const matchPart = partFilter === 'All' || p.partLabel === partFilter;
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchPart && matchQ;
    });
  }, [partFilter, search]);

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="Explore the Reading Library"
        description="Official-style academic passages, recent practice sets, and timed speed drills across all 14 IELTS Reading question types."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Reading' }]}
        actions={
          <div className="tabs-list">
            {['Academic', 'General'].map((t) => (
              <button
                key={t}
                type="button"
                className={`tab-trigger ${track === t ? 'active' : ''}`}
                onClick={() => setTrack(t)}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      {/* Part Mode Pills + Category Tabs + Search */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div className="filter-pills">
          {['All', 'Recent Real Tests', 'Official-Style Library', 'Road to IELTS'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryTab(cat)}
              className={`filter-pill ${categoryTab === cat ? 'active' : ''}`}
            >
              <span>{cat}</span>
              {cat === 'Recent Real Tests' && <Badge variant="yellow">NEW</Badge>}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="tabs-list" style={{ padding: 3 }}>
            {['All', 'Part 1', 'Part 2', 'Part 3'].map((p) => (
              <button
                key={p}
                type="button"
                className={`tab-trigger ${partFilter === p ? 'active' : ''}`}
                onClick={() => setPartFilter(p)}
                style={{ padding: '5px 10px', fontSize: '0.76rem' }}
              >
                {p}
              </button>
            ))}
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Search passages..." style={{ width: 210 }} />
        </div>
      </div>

      {/* Guidance Banner (Image 5 inspired) */}
      <div
        className="card-warm"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Info size={16} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
        <p className="text-xs text-muted">
          <strong>Practice Guidance:</strong> All passages use original IELTS Ultimate academic texts (no copyrighted exam reproductions). Use text highlighting and personal notes inside the split-screen exam viewer.
        </p>
      </div>

      {/* Practice Collections Grid (Image 5 3-column collection cards with clickable Test 1-4 rows) */}
      <section>
        <div className="section-header">
          <h2 className="h2">Reading Practice Collections</h2>
          <span className="text-xs text-muted">{filteredCollections.length} volumes</span>
        </div>

        <div className="grid-3">
          {filteredCollections.map((col) => (
            <div key={col.id} data-animate="card" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      backgroundColor: '#EDF4FF',
                      color: '#3B6FD4',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BookOpen size={17} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>{col.title}</div>
                    <div className="text-xs text-muted">{col.tests.length} TESTS • {col.category}</div>
                  </div>
                </div>
                <Link
                  href={`/reading/collections/${col.id}`}
                  className="btn btn-ghost btn-sm"
                  title="Open collection"
                >
                  <FolderOpen size={15} />
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.tests.map((test, idx) => (
                  <button
                    key={`${col.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      setPopupTest({ ...test, collectionTitle: col.title });
                      setSelectedPartMode('Full');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-primary)',
                      textAlign: 'left',
                      transition: 'border-color 0.16s ease, background-color 0.16s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 999,
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
                        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{test.label}: {test.topic}</div>
                        <div className="text-xs text-muted">{test.difficulty} • {test.duration}m</div>
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
      </section>

      {/* Individual Passage Bank */}
      <section>
        <div className="section-header">
          <div>
            <h2 className="h2">Individual Passages & Question Bank</h2>
            <p className="text-xs text-muted">Jump directly into single timed academic passages</p>
          </div>
          <span className="text-xs text-muted">{filteredPassages.length} passages</span>
        </div>

        <div className="grid-2">
          {filteredPassages.map((p) => {
            const saved = bookmarks.tests.includes(p.id);
            return (
              <div key={p.id} data-animate="card" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Badge variant="purple">{p.partLabel}</Badge>
                    <Badge variant="neutral">{p.category}</Badge>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => toggleBookmark('tests', p.id, 'Saved Tests')}
                    aria-label="Bookmark passage"
                  >
                    <Bookmark
                      size={15}
                      fill={saved ? 'var(--accent-yellow)' : 'none'}
                      color={saved ? '#B48200' : 'var(--text-secondary)'}
                    />
                  </button>
                </div>

                <div>
                  <h3 className="h3">{p.title}</h3>
                  <p className="text-xs text-muted" style={{ marginTop: 4 }}>{p.subtitle}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 6 }}>
                  <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={13} /> {p.durationMinutes} min • {p.wordCount} words
                  </span>
                  <Link href={`/reading/test/${p.id}`} className="btn btn-primary btn-sm">
                    Start Passage →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Test Selection & Instructions Popup */}
      <Modal
        open={Boolean(popupTest)}
        onClose={() => setPopupTest(null)}
        title={popupTest ? `${popupTest.collectionTitle} — ${popupTest.label}` : ''}
        subtitle={popupTest?.topic}
      >
        {popupTest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div className="field-label" style={{ marginBottom: 8 }}>Select Practice Scope</div>
              <div className="filter-pills">
                {['Full', 'Part 1', 'Part 2', 'Part 3'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`filter-pill ${selectedPartMode === mode ? 'active' : ''}`}
                    onClick={() => setSelectedPartMode(mode)}
                  >
                    {mode === 'Full' ? 'Full Reading Mode' : `${mode} Only`}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="card-warm card-compact"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Exam Countdown Timer</div>
                <div className="text-xs text-muted">Recommended: {selectedPartMode === 'Full' ? '60 minutes' : '20 minutes'}</div>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${timedMode ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTimedMode((v) => !v)}
              >
                {timedMode ? 'Timed ON' : 'Untimed'}
              </button>
            </div>

            <div className="text-xs text-muted" style={{ lineHeight: 1.6 }}>
              Instructions: Highlight key sentences directly on the passage, jot down paragraph notes, and bookmark uncertain questions before submitting.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setPopupTest(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const targetId = popupTest.id;
                  setPopupTest(null);
                  router.push(`/reading/test/${targetId}?mode=${encodeURIComponent(selectedPartMode)}&timed=${timedMode ? '1' : '0'}`);
                }}
              >
                <CheckCircle2 size={15} /> Launch Reading Interface
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

