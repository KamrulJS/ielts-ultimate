'use client';
import styles from './SpeakingResultView.module.css';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Mic } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge, ProgressBar } from '@/components/common/UiPrimitives';
import evaluationsData from '@/data/speaking/evaluations.json';

export function SpeakingResultView({ resultId }) {
  const { testResults } = useApp();
  const result = testResults.find((r) => r.id === resultId) || testResults.find((r) => r.type === 'speaking');
  const evalProfile = evaluationsData.sampleEvaluation;

  return (
    <div className={styles.spea_div_1}>
      <PageHeader
        title={result?.title || 'Speaking Assessment Feedback'}
        description={`Completed ${result?.date || 'Today'} • Parts 1, 2 & 3 Simulation`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Speaking', href: '/speaking' },
          { label: 'Feedback' },
        ]}
        actions={
          <Link href="/speaking" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Speaking Studio
          </Link>
        }
      />

      <div
        className={`card-warm ${styles.spea_div_2}`}
        
      >
        <Info size={16} className={styles.spea_info_3} />
        <p className={`text-xs ${styles.spea_p_4}`} >{evaluationsData.demoDisclaimer}</p>
      </div>

      <div className="result-summary-split">
        <div className={`card-dark ${styles.spea_div_5}`} >
          <Badge variant="yellow"><Mic size={12} /> Overall Speaking</Badge>
          <div className={styles.spea_div_6}>
            {(result?.bandScore || evalProfile.overall).toFixed(1)}
          </div>
          <div className={`text-xs ${styles.spea_div_7}`} >Simulated Rubric Evaluation</div>
        </div>

        <div className="card">
          <h2 className={`h3 ${styles.spea_h2_8}`} >Official Speaking Criteria Breakdown</h2>
          <div className={`grid-2 ${styles.spea_div_9}`} >
            {evalProfile.criteria.map((c) => (
              <div key={c.name} className="card-warm card-compact">
                <div className={styles.spea_div_10}>
                  <span className={styles.spea_span_11}>{c.name}</span>
                  <Badge variant="dark">{c.band.toFixed(1)}</Badge>
                </div>
                <ProgressBar value={Math.round((c.band / 9) * 100)} variant="purple" small />
                <p className={`text-xs text-muted ${styles.spea_p_12}`} >{c.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className={`h3 ${styles.spea_h3_13}`} >Targeted Action Steps</h3>
        <ul className={styles.spea_ul_14}>
          {evalProfile.suggestions.map((s) => (
            <li key={s} className="text-sm">{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

