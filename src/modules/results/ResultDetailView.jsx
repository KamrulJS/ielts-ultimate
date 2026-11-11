'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Award,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge, ProgressBar, EmptyState } from '@/components/common/UiPrimitives';

export function ResultDetailView({ resultId, expectedType }) {
  const { testResults, showToast } = useApp();

  const result =
    testResults.find((r) => r.id === resultId) ||
    testResults.find((r) => r.type === expectedType) ||
    testResults[0];

  if (!result) {
    return (
      <EmptyState
        icon={Award}
        title="Result record not found"
        description="Complete a practice test or select a result from your history."
        action={<Link href="/test-results" className="btn btn-primary">Back to Results</Link>}
      />
    );
  }

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.id}-ielts-ultimate-report.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Score report downloaded', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title={result.title}
        description={`${result.partLabel || result.type} • Completed on ${result.date} ${result.timeLabel ? `at ${result.timeLabel}` : ''}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Test Results', href: '/test-results' },
          { label: result.type.toUpperCase() },
        ]}
        actions={
          <div className="no-print" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/test-results" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} /> All Results
            </Link>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              <Printer size={14} /> Print Report
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleDownloadJson}>
              <Download size={14} /> Download Report
            </button>
          </div>
        }
      />

      {/* Score Summary Banner */}
      <div className="grid-4">
        <div className="card-dark">
          <div className="text-xs" style={{ color: '#B7B5AD', fontWeight: 600 }}>ESTIMATED BAND</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-yellow)', marginTop: 6 }}>
            {result.bandScore.toFixed(1)}
          </div>
          <div className="text-xs" style={{ color: '#C7C5BE' }}>Duration: {result.durationUsed || 'Completed'}</div>
        </div>

        <div className="card">
          <div className="text-xs text-muted" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={14} style={{ color: 'var(--success)' }} /> CORRECT
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, marginTop: 8, color: 'var(--success)' }}>
            {result.correct ?? '—'}
          </div>
          <div className="text-xs text-muted">
            {result.totalQuestions ? `Out of ${result.totalQuestions} items` : 'Criterion evaluated'}
          </div>
        </div>

        <div className="card">
          <div className="text-xs text-muted" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <XCircle size={14} style={{ color: 'var(--error)' }} /> INCORRECT
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, marginTop: 8, color: 'var(--error)' }}>
            {result.incorrect ?? '—'}
          </div>
          <div className="text-xs text-muted">Review explanations below</div>
        </div>

        <div className="card">
          <div className="text-xs text-muted" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MinusCircle size={14} /> UNANSWERED
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, marginTop: 8 }}>
            {result.unanswered ?? (result.wordCount ? `${result.wordCount}w` : 0)}
          </div>
          <div className="text-xs text-muted">{result.wordCount ? 'Total words written' : 'Skipped questions'}</div>
        </div>
      </div>

      {/* Module Breakdown (for Mock / Reading / Listening) */}
      {result.breakdown && (
        <div className="card">
          <h2 className="h2" style={{ marginBottom: 14 }}>Section Breakdown</h2>
          <div className="grid-2">
            {result.breakdown.map((sec) => {
              const pct = sec.total ? Math.round((sec.correct / sec.total) * 100) : Math.round(((sec.band || result.bandScore) / 9) * 100);
              return (
                <div key={sec.label} className="card-warm card-compact">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sec.label}</span>
                    <Badge variant="purple">
                      {sec.total ? `${sec.correct}/${sec.total}` : `Band ${(sec.band || result.bandScore).toFixed(1)}`}
                    </Badge>
                  </div>
                  <ProgressBar value={pct} variant="purple" small showLabel />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rubric Criteria (for Writing & Speaking) */}
      {result.criteria && (
        <div className="card">
          <div className="section-header">
            <h2 className="h2">Band Score Rubric Breakdown</h2>
            <Badge variant="yellow">Demo Evaluation Rubric</Badge>
          </div>
          <div className="grid-2">
            {result.criteria.map((c) => (
              <div key={c.name} className="card-warm card-compact">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{c.name}</span>
                  <Badge variant="dark">{c.band.toFixed(1)}</Badge>
                </div>
                <ProgressBar value={Math.round((c.band / 9) * 100)} variant="yellow" small />
                <p className="text-sm text-muted" style={{ marginTop: 8 }}>{c.comment || c.feedback}</p>
              </div>
            ))}
          </div>
          {result.essayExcerpt && (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 6 }}>SUBMITTED RESPONSE EXCERPT</div>
              <p className="text-sm" style={{ whiteSpace: 'pre-line', lineHeight: 1.65 }}>{result.essayExcerpt}</p>
            </div>
          )}
        </div>
      )}

      {/* Question-by-Question Answer Explanations */}
      {result.items && result.items.length > 0 && (
        <div className="card">
          <h2 className="h2" style={{ marginBottom: 14 }}>Answer Key & Detailed Explanations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {result.items.map((it) => (
              <div
                key={it.number}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  backgroundColor:
                    it.status === 'correct'
                      ? 'var(--success-soft)'
                      : it.status === 'incorrect'
                      ? 'var(--error-soft)'
                      : 'var(--bg-primary)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    Q{it.number}. {it.question}
                  </span>
                  <Badge variant={it.status === 'correct' ? 'success' : it.status === 'incorrect' ? 'error' : 'neutral'}>
                    {it.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span>Your answer: <strong>{it.userAnswer || '— (Unanswered)'}</strong></span>
                  <span>Correct answer: <strong>{it.correctAnswer}</strong></span>
                </div>
                <p className="text-xs text-muted">{it.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

