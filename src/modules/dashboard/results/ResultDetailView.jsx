'use client';
import styles from './ResultDetailView.module.css';

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
    <div className={styles.resu_div_1}>
      <PageHeader
        title={result.title}
        description={`${result.partLabel || result.type} • Completed on ${result.date} ${result.timeLabel ? `at ${result.timeLabel}` : ''}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Test Results', href: '/test-results' },
          { label: result.type.toUpperCase() },
        ]}
        actions={
          <div className={`no-print ${styles.resu_div_2}`} >
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
          <div className={`text-xs ${styles.resu_div_3}`} >ESTIMATED BAND</div>
          <div className={styles.resu_div_4}>
            {result.bandScore.toFixed(1)}
          </div>
          <div className={`text-xs ${styles.resu_div_5}`} >Duration: {result.durationUsed || 'Completed'}</div>
        </div>

        <div className="card">
          <div className={`text-xs text-muted ${styles.resu_div_6}`} >
            <CheckCircle2 size={14} className={styles.resu_checkcircle2_7} /> CORRECT
          </div>
          <div className={styles.resu_div_8}>
            {result.correct ?? '—'}
          </div>
          <div className="text-xs text-muted">
            {result.totalQuestions ? `Out of ${result.totalQuestions} items` : 'Criterion evaluated'}
          </div>
        </div>

        <div className="card">
          <div className={`text-xs text-muted ${styles.resu_div_6}`} >
            <XCircle size={14} className={styles.resu_xcircle_9} /> INCORRECT
          </div>
          <div className={styles.resu_div_10}>
            {result.incorrect ?? '—'}
          </div>
          <div className="text-xs text-muted">Review explanations below</div>
        </div>

        <div className="card">
          <div className={`text-xs text-muted ${styles.resu_div_6}`} >
            <MinusCircle size={14} /> UNANSWERED
          </div>
          <div className={styles.resu_div_11}>
            {result.unanswered ?? (result.wordCount ? `${result.wordCount}w` : 0)}
          </div>
          <div className="text-xs text-muted">{result.wordCount ? 'Total words written' : 'Skipped questions'}</div>
        </div>
      </div>

      {/* Module Breakdown (for Mock / Reading / Listening) */}
      {result.breakdown && (
        <div className="card">
          <h2 className={`h2 ${styles.resu_h2_12}`} >Section Breakdown</h2>
          <div className="grid-2">
            {result.breakdown.map((sec) => {
              const pct = sec.total ? Math.round((sec.correct / sec.total) * 100) : Math.round(((sec.band || result.bandScore) / 9) * 100);
              return (
                <div key={sec.label} className="card-warm card-compact">
                  <div className={styles.resu_div_13}>
                    <span className={styles.resu_span_14}>{sec.label}</span>
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
                <div className={styles.resu_div_15}>
                  <span className={styles.resu_span_16}>{c.name}</span>
                  <Badge variant="dark">{c.band.toFixed(1)}</Badge>
                </div>
                <ProgressBar value={Math.round((c.band / 9) * 100)} variant="yellow" small />
                <p className={`text-sm text-muted ${styles.resu_p_17}`} >{c.comment || c.feedback}</p>
              </div>
            ))}
          </div>
          {result.essayExcerpt && (
            <div className={styles.resu_div_18}>
              <div className={`text-xs text-muted ${styles.resu_div_19}`} >SUBMITTED RESPONSE EXCERPT</div>
              <p className={`text-sm ${styles.resu_p_20}`} >{result.essayExcerpt}</p>
            </div>
          )}
        </div>
      )}

      {/* Question-by-Question Answer Explanations */}
      {result.items && result.items.length > 0 && (
        <div className="card">
          <h2 className={`h2 ${styles.resu_h2_12}`} >Answer Key & Detailed Explanations</h2>
          <div className={styles.resu_div_21}>
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
                <div className={styles.resu_div_22}>
                  <span className={styles.resu_span_23}>
                    Q{it.number}. {it.question}
                  </span>
                  <Badge variant={it.status === 'correct' ? 'success' : it.status === 'incorrect' ? 'error' : 'neutral'}>
                    {it.status.toUpperCase()}
                  </Badge>
                </div>
                <div className={`text-xs ${styles.resu_div_24}`} >
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

