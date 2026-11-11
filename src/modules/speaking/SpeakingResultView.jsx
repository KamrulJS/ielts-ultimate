'use client';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

      <div className="result-summary-split">
        <div className="card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Badge variant="yellow"><Mic size={12} /> Overall Speaking</Badge>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', margin: '10px 0' }}>
            {(result?.bandScore || evalProfile.overall).toFixed(1)}
          </div>
          <div className="text-xs" style={{ color: '#B7B5AD' }}>Simulated Rubric Evaluation</div>
        </div>

        <div className="card">
          <h2 className="h3" style={{ marginBottom: 12 }}>Official Speaking Criteria Breakdown</h2>
          <div className="grid-2" style={{ gap: 12 }}>
            {evalProfile.criteria.map((c) => (
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

      <div className="card">
        <h3 className="h3" style={{ marginBottom: 10 }}>Targeted Action Steps</h3>
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {evalProfile.suggestions.map((s) => (
            <li key={s} className="text-sm">{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

