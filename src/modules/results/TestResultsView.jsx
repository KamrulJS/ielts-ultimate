'use client';

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
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="Your Test Results"
        description="Every practice set and full mock you have completed, with question-level feedback and band progression."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Test Results' }]}
        badge={<Badge variant="dark">{testResults.length} Scored Sessions</Badge>}
      />

      {/* Summary 4-Card Strip (Inspired by Image 3) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 1.3fr) repeat(3, minmax(0, 1fr))',
          gap: 14,
        }}
        className="results-summary-grid"
      >
        <div data-animate="card" className="card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
          <div>
            <Badge variant="yellow">Average Band</Badge>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.3rem', fontWeight: 800, marginTop: 8, lineHeight: 1 }}>
              {avgBand.toFixed(1)}
            </div>
            <div className="text-xs" style={{ color: '#B7B5AD', marginTop: 4 }}>
              From {testResults.length} scored sessions
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { label: 'R', val: profile.moduleBands.reading },
              { label: 'L', val: profile.moduleBands.listening },
              { label: 'W', val: profile.moduleBands.writing },
              { label: 'S', val: profile.moduleBands.speaking },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  padding: '8px 6px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  textAlign: 'center',
                }}
              >
                <div className="text-xs" style={{ color: '#B7B5AD' }}>{m.label}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.val.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>

        <div data-animate="card" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="text-xs text-muted" style={{ fontWeight: 600 }}>BEST SCORE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
            {bestBand.toFixed(1)}
          </div>
          <div className="text-xs" style={{ color: 'var(--success)', fontWeight: 600 }}>Target: {profile.targetBand.toFixed(1)}</div>
        </div>

        <div data-animate="card" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="text-xs text-muted" style={{ fontWeight: 600 }}>RECENT GROWTH</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
            +1.0
          </div>
          <div className="text-xs text-muted">Across last 30 days</div>
        </div>

        <div data-animate="card" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="text-xs text-muted" style={{ fontWeight: 600 }}>TOP MODULE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>
            Reading & Listening
          </div>
          <div className="text-xs text-muted">Band 7.0 consistent average</div>
        </div>
      </div>

      {/* Notice Banner */}
      <div
        className="card-warm"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'var(--accent-yellow-soft)',
          borderColor: 'rgba(246, 189, 40, 0.45)',
        }}
      >
        <Info size={16} style={{ color: '#8A6100', flexShrink: 0 }} />
        <p className="text-xs" style={{ color: '#5D4400' }}>
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
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search tests..." style={{ width: 210 }} />
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
          <div className="tabs-list" style={{ padding: 3 }}>
            <button
              type="button"
              className={`tab-trigger ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
              style={{ padding: '5px 9px' }}
              title="Month Timeline View"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              className={`tab-trigger ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              style={{ padding: '5px 9px' }}
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
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
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
              render: (r) => <strong style={{ fontSize: '0.95rem' }}>{r.bandScore.toFixed(1)}</strong>,
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groupedByMonth.map(([month, items]) => (
            <div key={month}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="badge badge-neutral">
                  <Calendar size={13} /> {month}
                </span>
                <span className="text-xs text-muted">{items.length} tests</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item) => {
                  const dateObj = new Date(item.date);
                  const weekday = Number.isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = item.date.slice(8, 10);
                  const monthShort = Number.isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString('en-US', { month: 'short' });
                  const meta = TYPE_META[item.type] || TYPE_META.reading;

                  return (
                    <div
                      key={item.id}
                      className="card card-compact card-interactive"
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 14,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: 50,
                            padding: '6px 0',
                            borderRadius: 10,
                            backgroundColor: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            textAlign: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <div className="text-xs text-muted" style={{ fontSize: '0.68rem' }}>{weekday}</div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.1 }}>{dayNum}</div>
                          <div className="text-xs text-muted" style={{ fontSize: '0.68rem' }}>{monthShort}</div>
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>{item.title}</span>
                            <Badge variant="neutral">{item.partLabel}</Badge>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                            <Badge variant={meta.badge}>{meta.label}</Badge>
                            {item.timeLabel && <span className="text-xs text-muted">{item.timeLabel}</span>}
                            {item.durationUsed && <span className="text-xs text-muted">• {item.durationUsed}</span>}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
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

