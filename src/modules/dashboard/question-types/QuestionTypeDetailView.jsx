'use client';
import styles from './QuestionTypeDetailView.module.css';

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
    <div className={styles.ques_div_1}>
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
          <h2 className={`h2 ${styles.ques_h2_2}`} >Step-by-Step Solving Strategy</h2>
          <div className={styles.ques_div_3}>
            {guide.strategies.map((step, idx) => (
              <div
                key={step}
                className={`card-warm card-compact ${styles.ques_div_4}`}
                
              >
                <span className="badge badge-dark">{idx + 1}</span>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Annotated Example */}
        <div className="card">
          <div className={styles.ques_div_5}>
            <Lightbulb size={18} className={styles.ques_lightbulb_6} />
            <h2 className="h2">Annotated Example</h2>
          </div>
          <div className={styles.ques_div_7}>
            <div className={`text-xs text-muted ${styles.ques_div_8}`} >SAMPLE EXCERPT</div>
            <p className="text-sm">{guide.example.excerpt}</p>
          </div>
          <div className={`text-sm ${styles.ques_div_9}`} >
            <strong>Prompt:</strong> {guide.example.statement}
          </div>
          <div className={styles.ques_div_10}>
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

        <div className={styles.ques_div_11}>
          {guide.practice.map((item, idx) => {
            const chosen = selectedAnswers[idx];
            const isRight = chosen === item.answer;
            return (
              <div
                key={idx}
                className={styles.ques_div_12}
              >
                <p className={styles.ques_p_13}>
                  {idx + 1}. {item.q}
                </p>
                <div className={styles.ques_div_14}>
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

        <div className={styles.ques_div_15}>
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

