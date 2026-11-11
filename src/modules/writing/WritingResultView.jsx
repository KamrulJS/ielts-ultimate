'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge, ProgressBar } from '@/components/common/UiPrimitives';
import evaluationsData from '@/data/writing/evaluations.json';

export function WritingResultView({ submissionId }) {
  const { writingSubmissions, testResults } = useApp();

  const sub =
    writingSubmissions.find((s) => s.id === submissionId) ||
    testResults.find((r) => r.id === submissionId) ||
    writingSubmissions[0];

  const template =
    sub?.taskNumber === 1
      ? evaluationsData.templatesByBand.task1Standard
      : evaluationsData.templatesByBand.task2Strong;

  const displayBand = sub?.bandScore || template.overall;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title={sub?.title || 'Writing Feedback Report'}
        description={`Submitted ${sub?.submittedAt || sub?.date || 'Today'} • ${sub?.wordCount || 250} words`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Writing', href: '/writing' },
          { label: 'Feedback' },
        ]}
        actions={
          <Link href="/writing" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Writing Library
          </Link>
        }
      />

      {/* Explicit Demo Notice */}
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
        <p className="text-xs" style={{ color: '#5D4400' }}>{evaluationsData.demoDisclaimer}</p>
      </div>

      {/* Overall Score & Criteria */}
      <div className="result-summary-split">
        <div className="card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Badge variant="yellow">Estimated Band</Badge>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', margin: '8px 0' }}>
            {displayBand.toFixed(1)}
          </div>
          <div className="text-xs" style={{ color: '#B7B5AD' }}>
            Word count: {sub?.wordCount || 250} words
          </div>
        </div>
        <div className="card">
          <h2 className="h3" style={{ marginBottom: 12 }}>4-Criterion Breakdown</h2>
          <div className="grid-2" style={{ gap: 12 }}>
            {template.criteria.map((c) => (
              <div key={c.name} className="card-warm card-compact">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>{c.name}</span>
                  <Badge variant="dark">{c.band.toFixed(1)}</Badge>
                </div>
                <ProgressBar value={Math.round((c.band / 9) * 100)} variant="purple" small />
                <p className="text-xs text-muted" style={{ marginTop: 6 }}>{c.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grammar & Vocabulary Suggestions */}
      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CheckCircle2 size={17} style={{ color: 'var(--success)' }} />
            <h3 className="h3">Grammar & Structure Suggestions (Demo)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {template.grammarSuggestions.map((g, i) => (
              <div key={i} className="card-warm card-compact">
                <div className="text-xs" style={{ color: 'var(--error)', textDecoration: 'line-through' }}>{g.original}</div>
                <div className="text-sm" style={{ color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>{g.improved}</div>
                <div className="text-xs text-muted" style={{ marginTop: 4 }}>{g.rule}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={17} style={{ color: 'var(--accent-purple)' }} />
            <h3 className="h3">Vocabulary Upgrades (Band 7.5+)</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {template.vocabularyUpgrades.map((v, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <span className="text-xs text-muted">{v.basic}</span>
                <span className="badge badge-purple">{v.academic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submitted Essay */}
      {(sub?.content || sub?.essayExcerpt) && (
        <div className="card">
          <h3 className="h3" style={{ marginBottom: 10 }}>Your Submitted Text</h3>
          <p style={{ fontSize: '0.94rem', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
            {sub.content || sub.essayExcerpt}
          </p>
        </div>
      )}
    </div>
  );
}

