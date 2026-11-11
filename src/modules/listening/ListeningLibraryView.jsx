'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Headphones, ArrowRight, Info, Clock, CheckCircle2, Bookmark } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import { Modal } from '@/components/common/Modal';
import listeningTests from '@/data/listening/tests.json';

export function ListeningLibraryView() {
  const router = useRouter();
  const { bookmarks, toggleBookmark } = useApp();
  const rootRef = useGsapEntrance('listening-library');

  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [startPart, setStartPart] = useState('1');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listeningTests
      .filter((t) => (category === 'All' ? true : t.category === category))
      .filter((t) => (!q ? true : t.title.toLowerCase().includes(q) || t.collection.toLowerCase().includes(q)));
  }, [category, search]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((item) => {
      if (!map.has(item.collection)) map.set(item.collection, []);
      map.get(item.collection).push(item);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="Tune into the Listening Library"
        description="Four-part realistic listening tests with form, map labelling, multiple choice, and lecture note completion."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Listening' }]}
        badge={<Badge variant="yellow">Free Audio Practice</Badge>}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div className="filter-pills">
          {['All', 'Recent Real Tests', 'Official-Style Library', 'Road to IELTS'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              <span>{cat}</span>
              {cat === 'Recent Real Tests' && <Badge variant="yellow">NEW</Badge>}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search audio tests..." style={{ width: 220 }} />
      </div>

      <div className="card-warm" style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <Info size={16} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
        <p className="text-xs text-muted">
          <strong>Demo Audio Player Notice:</strong> Listening sessions use your browser&apos;s Web Speech synthesis and timed audio tracks synced to test scripts so every feature works reliably offline.
        </p>
      </div>

      {/* Collection Groups Grid (Inspired by Image 4) */}
      <div className="grid-3">
        {grouped.map(([colTitle, items]) => (
          <div key={colTitle} data-animate="card" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
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
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-primary)',
                    textAlign: 'left',
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

      {/* Individual Test Cards List */}
      <section>
        <h2 className="h2" style={{ marginBottom: 14 }}>All Listening Practice Sets ({filtered.length})</h2>
        <div className="grid-2">
          {filtered.map((test) => {
            const saved = bookmarks.tests.includes(test.id);
            return (
              <div key={test.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                <p className="text-xs text-muted">4 sections: Everyday Dialogue, Orientation Map, Academic Tutorial & University Lecture</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 6 }}>
                  <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={13} /> {test.durationMinutes} min • {test.difficulty}
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedTest(test);
                      setStartPart('1');
                    }}
                  >
                    Configure & Start →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Test Configuration Modal */}
      <Modal
        open={Boolean(selectedTest)}
        onClose={() => setSelectedTest(null)}
        title={selectedTest?.title}
        subtitle={`${selectedTest?.accent} • ${selectedTest?.durationMinutes} minutes`}
      >
        {selectedTest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div className="field-label" style={{ marginBottom: 8 }}>Start at Section</div>
              <div className="filter-pills">
                {selectedTest.parts.map((pt) => (
                  <button
                    key={pt.partNumber}
                    type="button"
                    className={`filter-pill ${startPart === String(pt.partNumber) ? 'active' : ''}`}
                    onClick={() => setStartPart(String(pt.partNumber))}
                  >
                    Part {pt.partNumber}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-warm card-compact text-xs text-muted" style={{ lineHeight: 1.6 }}>
              <strong>Instructions:</strong> Preview the questions in each part before pressing Play. Spellings and singular/plural endings must match exactly. You can review all answers across Parts 1–4 prior to submitting.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedTest(null)}>Cancel</button>
              <button
                type="button"
                className="btn btn-primary"
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

