'use client';
import styles from './MockTestLibraryView.module.css';

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

  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockTests
      .filter((t) => (difficulty === 'all' ? true : t.difficulty.toLowerCase().includes(difficulty)))
      .filter((t) => (!q ? true : t.title.toLowerCase().includes(q)));
  }, [difficulty, search]);

  const previousMocks = useMemo(
    () => testResults.filter((r) => r.type === 'mock'),
    [testResults]
  );

  const featuredMock = filtered[0] || mockTests[0];

  return (
    <div ref={rootRef} className={styles.mock_div_1}>
      <PageHeader
        title="Complete IELTS Mock Test"
        description="Experience all four IELTS modules in one timed sitting and receive a realistic overall band estimate."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Full Mock Test' }]}
        badge={<Badge variant="yellow">~2h 40m Official Format</Badge>}
      />

      {/* Centered Hero Setup Card (Inspired by Image 2) */}
      <section
        data-animate="card"
        className={`card ${styles.mock_section_2}`}
        
      >
        <div className={styles.mock_div_3}>
          <Badge variant="yellow">
            <Award size={13} /> FULL MOCK SIMULATION
          </Badge>
        </div>

        <h2 className={styles.mock_h2_4}>
          Ready for a full mock?
        </h2>
        <p className={`text-sm text-muted ${styles.mock_p_5}`} >
          4 modules • 1 continuous session • automatic answer saving • complete band score breakdown.
        </p>

        {/* IELTS Academic Dedicated Banner */}
        <div className={styles.mock_div_6}>
          <div
            className={styles.mock_div_7}
          >
            <span>IELTS Academic Examination Stream</span>
            <span className={`badge badge-purple ${styles.mock_span_8}`} >
              Standard Academic Rubric
            </span>
          </div>
        </div>

        {/* 4 Module Pills + Summary Stats */}
        <div
          className={styles.mock_div_9}
        >
          <div>
            <div className={styles.mock_div_10}>4</div>
            <div className={`text-xs text-muted ${styles.mock_div_11}`} >MODULES</div>
          </div>
          <div>
            <div className={styles.mock_div_10}>2h 40m</div>
            <div className={`text-xs text-muted ${styles.mock_div_11}`} >DURATION</div>
          </div>
          <div>
            <div className={styles.mock_div_10}>0 – 9.0</div>
            <div className={`text-xs text-muted ${styles.mock_div_11}`} >BAND SCORE</div>
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
          className={styles.mock_div_12}
        >
          <div>
            <h2 className="h2">{track} Mock Test Library ({filtered.length})</h2>
            <p className="text-xs text-muted">Choose any curated full examination set</p>
          </div>
          <div className={styles.mock_div_13}>
            <SearchBar value={search} onChange={setSearch} placeholder="Filter mock tests..." className={styles.mock_searchbar_14} />
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
            <div key={test.id} data-animate="card" className={`card card-interactive ${styles.mock_div_15}`} >
              <div className={styles.mock_div_16}>
                <Badge variant={test.status === 'Completed' ? 'success' : 'purple'}>
                  {test.status === 'Completed' ? `Completed • Band ${test.lastScore}` : test.track}
                </Badge>
                <span className={`text-xs text-muted ${styles.mock_span_17}`} >
                  <Clock size={13} /> {test.durationLabel}
                </span>
              </div>

              <div>
                <h3 className="h3">{test.title}</h3>
                <p className={`text-xs text-muted ${styles.mock_p_18}`} >{test.sectionsSummary}</p>
              </div>

              <div className={styles.mock_div_19}>
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
          <Link href="/test-results" className={`text-xs ${styles.mock_link_20}`} >
            All Results →
          </Link>
        </div>
        <div className={styles.mock_div_21}>
          {previousMocks.map((res) => (
            <div
              key={res.id}
              className={`card card-compact ${styles.mock_div_22}`}
              
            >
              <div>
                <div className={styles.mock_div_23}>{res.title}</div>
                <div className="text-xs text-muted">
                  Completed {res.date} • Duration {res.durationUsed}
                </div>
              </div>
              <div className={styles.mock_div_24}>
                {res.moduleScores && (
                  <div className={styles.mock_div_25}>
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
          <div className={styles.mock_div_26}>
            <div className={`card-warm card-compact ${styles.mock_div_27}`} >
              <Info size={16} className={styles.mock_info_28} />
              <p className={`text-xs ${styles.mock_p_29}`} >
                You will move through 4 timed modules: Listening (30m), Reading (60m), Writing (60m), and Speaking (14m). Answers save automatically in LocalStorage.
              </p>
            </div>
            <div className={`grid-2 ${styles.mock_div_30}`} >
              {[
                { name: '1. Listening', time: '30 min', desc: 'Audio playback & completion tasks' },
                { name: '2. Reading', time: '60 min', desc: 'Split-screen passage & questions' },
                { name: '3. Writing', time: '60 min', desc: 'Task 2 Academic essay workspace' },
                { name: '4. Speaking', time: '14 min', desc: 'Recorded Cue Card & interview' },
              ].map((s) => (
                <div key={s.name} className={styles.mock_div_31}>
                  <div className={styles.mock_div_32}>{s.name}</div>
                  <div className={`text-xs ${styles.mock_div_33}`} >{s.time}</div>
                  <div className="text-xs text-muted">{s.desc}</div>
                </div>
              ))}
            </div>
            <div className={styles.mock_div_34}>
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

