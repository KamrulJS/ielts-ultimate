'use client';
import styles from './TestResultsView.module.css';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  TrendingUp,
  Calendar,
  ChevronRight,
  Info,
  List,
  Table as TableIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { FilterDropdown, SearchBar, DataTable } from '@/components/common/DataControls';
import { BandProgressionChart } from '@/components/charts/BandProgressionChart';
import statsData from '@/data/dashboard/statistics.json';

const TYPE_META = {
  reading: { label: 'Reading', icon: BookOpen, badge: 'purple' },
  listening: { label: 'Listening', icon: Headphones, badge: 'yellow' },
  writing: { label: 'Writing', icon: PenTool, badge: 'error' },
  speaking: { label: 'Speaking', icon: Mic, badge: 'success' },
  mock: { label: 'Full Mock', icon: Award, badge: 'dark' },
};

export function TestResultsView() {
  const { testResults, profile } = useApp();
  const rootRef = useGsapEntrance('test-results');

  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('timeline');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return testResults
      .filter((r) => (typeFilter === 'all' ? true : r.type === typeFilter))
      .filter((r) => {
        if (dateFilter === 'nov') return r.date.startsWith('2026-11');
        if (dateFilter === 'oct') return r.date.startsWith('2026-10');
        return true;
      })
      .filter((r) => (!q ? true : r.title.toLowerCase().includes(q) || r.partLabel?.toLowerCase().includes(q)))
      .sort((a, b) => {
        if (sortBy === 'highest') return b.bandScore - a.bandScore;
        if (sortBy === 'oldest') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
  }, [testResults, typeFilter, dateFilter, sortBy, search]);

  // Group filtered results by Month-Year for Image 3 timeline layout
  const groupedByMonth = useMemo(() => {
    const groups = new Map();
    filtered.forEach((item) => {
      const d = new Date(item.date);
      const monthKey = Number.isNaN(d.getTime())
        ? 'Recent'
        : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups.has(monthKey)) groups.set(monthKey, []);
      groups.get(monthKey).push(item);
    });
    return Array.from(groups.entries());
  }, [filtered]);

  const bestBand = useMemo(() => {
    if (!testResults.length) return 0;
    return Math.max(...testResults.map((r) => r.bandScore));
  }, [testResults]);

  const avgBand = useMemo(() => {
    if (!testResults.length) return profile.currentBand;
    const sum = testResults.reduce((acc, r) => acc + r.bandScore, 0);
    return Math.round((sum / testResults.length) * 2) / 2;
  }, [testResults, profile.currentBand]);

  const counts = useMemo(() => {
    return {
      all: testResults.length,
      reading: testResults.filter((r) => r.type === 'reading').length,
      listening: testResults.filter((r) => r.type === 'listening').length,
      writing: testResults.filter((r) => r.type === 'writing').length,
      speaking: testResults.filter((r) => r.type === 'speaking').length,
      mock: testResults.filter((r) => r.type === 'mock').length,
    };
  }, [testResults]);

  return (
    <div ref={rootRef} className={styles.test_div_1}>
      <PageHeader
        title="Your Test Results"
        description="Every practice set and full mock you have completed, with question-level feedback and band progression."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Test Results' }]}
        badge={<Badge variant="dark">{testResults.length} Scored Sessions</Badge>}
      />

      {/* Summary 4-Card Strip (Inspired by Image 3) */}
      <div
        
        className={`results-summary-grid ${styles.test_div_2}`}
      >
        <div data-animate="card" className={`card-dark ${styles.test_div_3}`} >
          <div>
            <Badge variant="yellow">Average Band</Badge>
            <div className={styles.test_div_4}>
              {avgBand.toFixed(1)}
            </div>
            <div className={`text-xs ${styles.test_div_5}`} >
              From {testResults.length} scored sessions
            </div>
          </div>

          <div className={styles.test_div_6}>
            {[
              { label: 'R', val: profile.moduleBands.reading },
              { label: 'L', val: profile.moduleBands.listening },
              { label: 'W', val: profile.moduleBands.writing },
              { label: 'S', val: profile.moduleBands.speaking },
            ].map((m) => (
              <div
                key={m.label}
                className={styles.test_div_7}
              >
                <div className={`text-xs ${styles.test_div_8}`} >{m.label}</div>
                <div className={styles.test_div_9}>{m.val.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>

        <div data-animate="card" className={`card ${styles.test_div_10}`} >
          <div className={`text-xs text-muted ${styles.test_div_11}`} >BEST SCORE</div>
          <div className={styles.test_div_12}>
            {bestBand.toFixed(1)}
          </div>
          <div className={`text-xs ${styles.test_div_13}`} >Target: {profile.targetBand.toFixed(1)}</div>
        </div>

        <div data-animate="card" className={`card ${styles.test_div_10}`} >
          <div className={`text-xs text-muted ${styles.test_div_11}`} >RECENT GROWTH</div>
          <div className={styles.test_div_14}>
            +1.0
          </div>
          <div className="text-xs text-muted">Across last 30 days</div>
        </div>

        <div data-animate="card" className={`card ${styles.test_div_10}`} >
          <div className={`text-xs text-muted ${styles.test_div_11}`} >TOP MODULE</div>
          <div className={styles.test_div_15}>
            Reading & Listening
          </div>
          <div className="text-xs text-muted">Band 7.0 consistent average</div>
        </div>
      </div>

      {/* Notice Banner */}
      <div
        className={`card-warm ${styles.test_div_16}`}
        
      >
        <Info size={16} className={styles.test_info_17} />
        <p className={`text-xs ${styles.test_p_18}`} >
          Reading and Listening scores convert automatically using IELTS 40-question thresholds. Writing and Speaking rubrics display local demo evaluations.
        </p>
      </div>

      {/* Score Progression Chart */}
      <div data-animate="card" className="card">
        <div className="section-header">
          <div>
            <h2 className="h2">Score Progression</h2>
            <p className="text-xs text-muted">Historical overall band trend</p>
          </div>
          <Badge variant="purple">
            <TrendingUp size={13} /> Steady Upward Trend
          </Badge>
        </div>
        <BandProgressionChart data={statsData.bandProgression} activeMetric="overall" height={210} />
      </div>

      {/* Filter & Search Bar */}
      <div
        className={styles.test_div_19}
      >
        <div className="filter-pills">
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'mock', label: `Mock (${counts.mock})` },
            { id: 'reading', label: `Reading (${counts.reading})` },
            { id: 'listening', label: `Listening (${counts.listening})` },
            { id: 'writing', label: `Writing (${counts.writing})` },
            { id: 'speaking', label: `Speaking (${counts.speaking})` },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setTypeFilter(pill.id)}
              className={`filter-pill ${typeFilter === pill.id ? 'active' : ''}`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className={styles.test_div_20}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search tests..." className={styles.test_searchbar_21} />
          <FilterDropdown
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { value: 'all', label: 'All Dates' },
              { value: 'nov', label: 'November 2026' },
              { value: 'oct', label: 'October 2026' },
            ]}
          />
          <FilterDropdown
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'newest', label: 'Newest first' },
              { value: 'highest', label: 'Highest score' },
              { value: 'oldest', label: 'Oldest first' },
            ]}
          />
          <div className={`tabs-list ${styles.test_div_22}`} >
            <button
              type="button"
              className={`tab-trigger ${viewMode === 'timeline' ? 'active' : ''} ${styles.test_button_23}`}
              onClick={() => setViewMode('timeline')}
              
              title="Month Timeline View"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              className={`tab-trigger ${viewMode === 'table' ? 'active' : ''} ${styles.test_button_23}`}
              onClick={() => setViewMode('table')}
              
              title="Table View"
            >
              <TableIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Timeline or Table */}
      {viewMode === 'table' ? (
        <DataTable
          data={filtered}
          columns={[
            {
              key: 'title',
              label: 'Assessment',
              render: (r) => (
                <div>
                  <div className={styles.test_div_11}>{r.title}</div>
                  <div className="text-xs text-muted">{r.partLabel}</div>
                </div>
              ),
            },
            {
              key: 'type',
              label: 'Module',
              render: (r) => {
                const meta = TYPE_META[r.type] || TYPE_META.reading;
                return <Badge variant={meta.badge}>{meta.label}</Badge>;
              },
            },
            { key: 'date', label: 'Date' },
            {
              key: 'bandScore',
              label: 'Band',
              render: (r) => <strong className={styles.test_strong_24}>{r.bandScore.toFixed(1)}</strong>,
            },
            {
              key: 'action',
              label: 'Report',
              render: (r) => (
                <Link href={`/test-results/${r.type}/${r.id}`} className="btn btn-secondary btn-sm">
                  View <ChevronRight size={14} />
                </Link>
              ),
            },
          ]}
        />
      ) : (
        <div className={styles.test_div_1}>
          {groupedByMonth.map(([month, items]) => (
            <div key={month}>
              <div className={styles.test_div_25}>
                <span className="badge badge-neutral">
                  <Calendar size={13} /> {month}
                </span>
                <span className="text-xs text-muted">{items.length} tests</span>
              </div>

              <div className={styles.test_div_26}>
                {items.map((item) => {
                  const dateObj = new Date(item.date);
                  const weekday = Number.isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = item.date.slice(8, 10);
                  const monthShort = Number.isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString('en-US', { month: 'short' });
                  const meta = TYPE_META[item.type] || TYPE_META.reading;

                  return (
                    <div
                      key={item.id}
                      className={`card card-compact card-interactive ${styles.test_div_27}`}
                      
                    >
                      <div className={styles.test_div_28}>
                        <div
                          className={styles.test_div_29}
                        >
                          <div className={`text-xs text-muted ${styles.test_div_30}`} >{weekday}</div>
                          <div className={styles.test_div_31}>{dayNum}</div>
                          <div className={`text-xs text-muted ${styles.test_div_30}`} >{monthShort}</div>
                        </div>

                        <div className={styles.test_div_32}>
                          <div className={styles.test_div_33}>
                            <span className={styles.test_span_34}>{item.title}</span>
                            <Badge variant="neutral">{item.partLabel}</Badge>
                          </div>
                          <div className={styles.test_div_35}>
                            <Badge variant={meta.badge}>{meta.label}</Badge>
                            {item.timeLabel && <span className="text-xs text-muted">{item.timeLabel}</span>}
                            {item.durationUsed && <span className="text-xs text-muted">• {item.durationUsed}</span>}
                          </div>
                        </div>
                      </div>

                      <div className={styles.test_div_36}>
                        <div className={styles.test_div_37}>
                          <div className={styles.test_div_38}>
                            {item.totalQuestions ? `${item.correct}/${item.totalQuestions}` : `Band ${item.bandScore.toFixed(1)}`}
                          </div>
                          <div className="text-xs text-muted">
                            {item.totalQuestions ? `Band ${item.bandScore.toFixed(1)}` : item.wordCount ? `${item.wordCount} words` : 'Scored'}
                          </div>
                        </div>

                        <Link href={`/test-results/${item.type}/${item.id}`} className="btn btn-secondary btn-sm">
                          View <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 960px) {
          .results-summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 600px) {
          .results-summary-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

