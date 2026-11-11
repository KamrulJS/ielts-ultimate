'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar, FilterDropdown } from '@/components/common/DataControls';
import { Modal } from '@/components/common/Modal';
import mockTests from '@/data/tests/mock-tests.json';

export function MockTestLibraryView() {
  const router = useRouter();
  const { testResults } = useApp();
  const rootRef = useGsapEntrance('mock-library');

  const [track, setTrack] = useState('Academic');
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockTests
      .filter((t) => t.track === track)
      .filter((t) => (difficulty === 'all' ? true : t.difficulty.toLowerCase().includes(difficulty)))
      .filter((t) => (!q ? true : t.title.toLowerCase().includes(q)));
  }, [track, difficulty, search]);

  const previousMocks = useMemo(
    () => testResults.filter((r) => r.type === 'mock'),
    [testResults]
  );

  const featuredMock = filtered[0] || mockTests[0];

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Complete IELTS Mock Test"
        description="Experience all four IELTS modules in one timed sitting and receive a realistic overall band estimate."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Full Mock Test' }]}
        badge={<Badge variant="yellow">~2h 40m Official Format</Badge>}
      />

      {/* Centered Hero Setup Card (Inspired by Image 2) */}
      <section
        data-animate="card"
        className="card"
        style={{
          padding: '32px 24px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9F5 100%)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'inline-flex', marginBottom: 12 }}>
          <Badge variant="yellow">
            <Award size={13} /> FULL MOCK SIMULATION
          </Badge>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: 6 }}>
          Ready for a full mock?
        </h2>
        <p className="text-sm text-muted" style={{ maxWidth: 460, margin: '0 auto 20px' }}>
          4 modules • 1 continuous session • automatic answer saving • complete band score breakdown.
        </p>

        {/* Track Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
          {[
            { id: 'Academic', sub: 'University & Professional Study' },
            { id: 'General', sub: 'Work & Migration Pathways' },
          ].map((opt) => {
            const active = track === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTrack(opt.id)}
                style={{
                  flex: '1 1 150px',
                  maxWidth: 260,
                  minWidth: 0,
                  padding: '12px 18px',
                  borderRadius: 12,
                  border: active ? '2px solid var(--accent-yellow)' : '1px solid var(--border)',
                  backgroundColor: active ? 'var(--accent-yellow-soft)' : 'var(--surface)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{opt.id}</div>
                <div className="text-xs text-muted">{opt.sub}</div>
              </button>
            );
          })}
        </div>

        {/* 4 Module Pills + Summary Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 28,
            flexWrap: 'wrap',
            marginBottom: 22,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>4</div>
            <div className="text-xs text-muted" style={{ fontWeight: 600 }}>MODULES</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>2h 40m</div>
            <div className="text-xs text-muted" style={{ fontWeight: 600 }}>DURATION</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>0 – 9.0</div>
            <div className="text-xs text-muted" style={{ fontWeight: 600 }}>BAND SCORE</div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => setSelectedTest(featuredMock)}
        >
          <Play size={16} /> Start Full Mock →
        </button>
      </section>

      {/* Mock Test Library */}
      <section>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <h2 className="h2">{track} Mock Test Library ({filtered.length})</h2>
            <p className="text-xs text-muted">Choose any curated full examination set</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Filter mock tests..." style={{ width: 220 }} />
            <FilterDropdown
              value={difficulty}
              onChange={setDifficulty}
              options={[
                { value: 'all', label: 'All Difficulties' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'standard', label: 'Standard' },
                { value: 'challenging', label: 'Challenging' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />
          </div>
        </div>

        <div className="grid-2">
          {filtered.map((test) => (
            <div key={test.id} data-animate="card" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <Badge variant={test.status === 'Completed' ? 'success' : 'purple'}>
                  {test.status === 'Completed' ? `Completed • Band ${test.lastScore}` : test.track}
                </Badge>
                <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={13} /> {test.durationLabel}
                </span>
              </div>

              <div>
                <h3 className="h3">{test.title}</h3>
                <p className="text-xs text-muted" style={{ marginTop: 4 }}>{test.sectionsSummary}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 }}>
                <Badge variant="neutral">{test.difficulty}</Badge>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedTest(test)}
                >
                  Open Briefing <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Previous Mock Sessions */}
      <section>
        <div className="section-header">
          <h2 className="h2">Previous Mock Sessions</h2>
          <Link href="/test-results" className="text-xs" style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>
            All Results →
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {previousMocks.map((res) => (
            <div
              key={res.id}
              className="card card-compact"
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{res.title}</div>
                <div className="text-xs text-muted">
                  Completed {res.date} • Duration {res.durationUsed}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {res.moduleScores && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[
                      { k: 'L', v: res.moduleScores.listening, icon: Headphones },
                      { k: 'R', v: res.moduleScores.reading, icon: BookOpen },
                      { k: 'W', v: res.moduleScores.writing, icon: PenTool },
                      { k: 'S', v: res.moduleScores.speaking, icon: Mic },
                    ].map((m) => (
                      <span key={m.k} className="badge badge-neutral">
                        {m.k}: {m.v}
                      </span>
                    ))}
                  </div>
                )}
                <Badge variant="dark">Band {res.bandScore.toFixed(1)}</Badge>
                <Link href={`/test-results/mock/${res.id}`} className="btn btn-secondary btn-sm">
                  View Report
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-Exam Instructions Modal */}
      <Modal
        open={Boolean(selectedTest)}
        onClose={() => setSelectedTest(null)}
        title={selectedTest?.title}
        subtitle="Examination briefing & section timings"
      >
        {selectedTest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card-warm card-compact" style={{ display: 'flex', gap: 10 }}>
              <Info size={16} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: 2 }} />
              <p className="text-xs" style={{ lineHeight: 1.55 }}>
                You will move through 4 timed modules: Listening (30m), Reading (60m), Writing (60m), and Speaking (14m). Answers save automatically in LocalStorage.
              </p>
            </div>
            <div className="grid-2" style={{ gap: 10 }}>
              {[
                { name: '1. Listening', time: '30 min', desc: 'Audio playback & completion tasks' },
                { name: '2. Reading', time: '60 min', desc: 'Split-screen passage & questions' },
                { name: '3. Writing', time: '60 min', desc: 'Task 2 Academic essay workspace' },
                { name: '4. Speaking', time: '14 min', desc: 'Recorded Cue Card & interview' },
              ].map((s) => (
                <div key={s.name} style={{ padding: 10, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.name}</div>
                  <div className="text-xs" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{s.time}</div>
                  <div className="text-xs text-muted">{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedTest(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const id = selectedTest.id;
                  setSelectedTest(null);
                  router.push(`/mock-test/session/${id}`);
                }}
              >
                <CheckCircle2 size={15} /> Begin Exam Now
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

