'use client';
import styles from './WritingResultView.module.css';

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
    <div className={styles.writ_div_1}>
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
        className={`card-warm ${styles.writ_div_2}`}
        
      >
        <Info size={16} className={styles.writ_info_3} />
        <p className={`text-xs ${styles.writ_p_4}`} >{evaluationsData.demoDisclaimer}</p>
      </div>

      {/* Overall Score & Criteria */}
      <div className="result-summary-split">
        <div className={`card-dark ${styles.writ_div_5}`} >
          <Badge variant="yellow">Estimated Band</Badge>
          <div className={styles.writ_div_6}>
            {displayBand.toFixed(1)}
          </div>
          <div className={`text-xs ${styles.writ_div_7}`} >
            Word count: {sub?.wordCount || 250} words
          </div>
        </div>
        <div className="card">
          <h2 className={`h3 ${styles.writ_h2_8}`} >4-Criterion Breakdown</h2>
          <div className={`grid-2 ${styles.writ_div_9}`} >
            {template.criteria.map((c) => (
              <div key={c.name} className="card-warm card-compact">
                <div className={styles.writ_div_10}>
                  <span className={styles.writ_span_11}>{c.name}</span>
                  <Badge variant="dark">{c.band.toFixed(1)}</Badge>
                </div>
                <ProgressBar value={Math.round((c.band / 9) * 100)} variant="purple" small />
                <p className={`text-xs text-muted ${styles.writ_p_12}`} >{c.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grammar & Vocabulary Suggestions */}
      <div className="grid-2">
        <div className="card">
          <div className={styles.writ_div_13}>
            <CheckCircle2 size={17} className={styles.writ_checkcircle2_14} />
            <h3 className="h3">Grammar & Structure Suggestions (Demo)</h3>
          </div>
          <div className={styles.writ_div_15}>
            {template.grammarSuggestions.map((g, i) => (
              <div key={i} className="card-warm card-compact">
                <div className={`text-xs ${styles.writ_div_16}`} >{g.original}</div>
                <div className={`text-sm ${styles.writ_div_17}`} >{g.improved}</div>
                <div className={`text-xs text-muted ${styles.writ_div_18}`} >{g.rule}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className={styles.writ_div_13}>
            <Sparkles size={17} className={styles.writ_sparkles_19} />
            <h3 className="h3">Vocabulary Upgrades (Band 7.5+)</h3>
          </div>
          <div className={styles.writ_div_15}>
            {template.vocabularyUpgrades.map((v, i) => (
              <div
                key={i}
                className={styles.writ_div_20}
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
          <h3 className={`h3 ${styles.writ_h3_21}`} >Your Submitted Text</h3>
          <p className={styles.writ_p_22}>
            {sub.content || sub.essayExcerpt}
          </p>
        </div>
      )}
    </div>
  );
}

