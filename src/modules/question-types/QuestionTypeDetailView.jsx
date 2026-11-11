'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import guides from '@/data/question-types/guides.json';

export function QuestionTypeDetailView({ guideId }) {
  const guide = guides.find((g) => g.id === guideId) || guides[0];
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const correctCount = guide.practice.filter((p, idx) => selectedAnswers[idx] === p.answer).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title={guide.title}
        description={guide.overview}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Question Types', href: '/question-types' },
          { label: guide.module },
        ]}
        badge={<Badge variant="purple">{guide.frequency}</Badge>}
        actions={
          <Link href="/question-types" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> All Question Types
          </Link>
        }
      />

      {/* Step-by-Step Solving Guide */}
      <div className="grid-2">
        <div className="card">
          <h2 className="h2" style={{ marginBottom: 12 }}>Step-by-Step Solving Strategy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {guide.strategies.map((step, idx) => (
              <div
                key={step}
                className="card-warm card-compact"
                style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
              >
                <span className="badge badge-dark">{idx + 1}</span>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Annotated Example */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Lightbulb size={18} style={{ color: 'var(--accent-yellow)' }} />
            <h2 className="h2">Annotated Example</h2>
          </div>
          <div style={{ padding: 14, borderRadius: 12, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', marginBottom: 12 }}>
            <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 4 }}>SAMPLE EXCERPT</div>
            <p className="text-sm">{guide.example.excerpt}</p>
          </div>
          <div className="text-sm" style={{ marginBottom: 6 }}>
            <strong>Prompt:</strong> {guide.example.statement}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="text-xs text-muted">Correct Answer:</span>
            <Badge variant="success">{guide.example.correctAnswer}</Badge>
          </div>
          <p className="text-xs text-muted">{guide.example.why}</p>
        </div>
      </div>

      {/* Interactive Mini Practice Drill */}
      <div className="card">
        <div className="section-header">
          <div>
            <h2 className="h2">Interactive Practice Exercise</h2>
            <p className="text-xs text-muted">Apply the rules immediately and check your reasoning</p>
          </div>
          {checked && (
            <Badge variant={correctCount === guide.practice.length ? 'success' : 'yellow'}>
              Score: {correctCount} / {guide.practice.length}
            </Badge>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {guide.practice.map((item, idx) => {
            const chosen = selectedAnswers[idx];
            const isRight = chosen === item.answer;
            return (
              <div
                key={idx}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-primary)',
                }}
              >
                <p style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 10 }}>
                  {idx + 1}. {item.q}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {item.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedAnswers((p) => ({ ...p, [idx]: opt }))}
                      className={`filter-pill ${chosen === opt ? 'active' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {checked && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: isRight ? 'var(--success-soft)' : 'var(--error-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.82rem',
                    }}
                  >
                    {isRight ? <CheckCircle2 size={16} color="var(--success)" /> : <XCircle size={16} color="var(--error)" />}
                    <span>
                      <strong>{isRight ? 'Correct!' : `Correct answer: ${item.answer}.`}</strong> {item.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button type="button" className="btn btn-primary" onClick={() => setChecked(true)}>
            Check Answers
          </button>
          {checked && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSelectedAnswers({});
                setChecked(false);
              }}
            >
              <RotateCcw size={14} /> Reset Exercise
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

