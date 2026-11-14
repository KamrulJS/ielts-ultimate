'use client';

import React from 'react';
import Link from 'next/link';
import {
  PenTool,
  Mic,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import styles from './PublicLayout.module.css';

export function HomeAiFeedbackSection() {
  return (
    <section className={styles.sectionSpace} style={{ padding: '20px 20px 60px' }}>
      <div className={styles.container}>
        {/* Dark Purple Section Shell Matching Screenshot 5 */}
        <div
          style={{
            backgroundColor: '#281B46',
            borderRadius: 24,
            padding: '64px 36px 56px',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#F1EFE6',
                borderRadius: '9999px',
                padding: '5px 16px',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              AI-Powered Feedback
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                margin: '0 0 12px',
                color: '#FFFFFF',
              }}
            >
              Your personal AI examiner, available 24/7
            </h2>
            <p
              style={{
                fontSize: '0.98rem',
                color: '#D3CEE0',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Don&apos;t wait weeks for human feedback. Get detailed, rubric-based band scores on your Writing and Speaking instantly.
            </p>
          </div>

          {/* Two Distinct Cards Grid Matching Screenshot 5 */}
          <div
            className="ai-two-cards-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 28,
              maxWidth: 1100,
              margin: '0 auto 36px',
            }}
          >
            {/* Card 1: AI Writing Examiner */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 20,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: 'rgba(136, 103, 184, 0.35)',
                    border: '1px solid rgba(136, 103, 184, 0.5)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FAF9F5',
                  }}
                >
                  <PenTool size={20} />
                </div>
                <h3 style={{ fontSize: '1.24rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  AI Writing Examiner
                </h3>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#D3CEE0', lineHeight: 1.6, margin: 0 }}>
                Submit your Task 1 or Task 2 essay and get a full IELTS band breakdown in seconds. Every one of the four criteria is scored individually with comments that tell you exactly where you gained or lost marks, and how to push to the next band.
              </p>

              {/* 4 Criteria Matrix */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 10,
                }}
              >
                {[
                  { code: 'TA', label: 'Task Achievement' },
                  { code: 'CC', label: 'Coherence & Cohesion' },
                  { code: 'LR', label: 'Lexical Resource' },
                  { code: 'GR', label: 'Grammatical Range' },
                ].map((crit) => (
                  <div
                    key={crit.code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 8,
                      padding: '8px 10px',
                      fontSize: '0.78rem',
                      color: '#E8E5EE',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: '#8867B8',
                        color: '#FFFFFF',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      {crit.code}
                    </span>
                    <span>{crit.label}</span>
                  </div>
                ))}
              </div>

              {/* Feature Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
                {['Task 1 & Task 2', 'Per-Criterion Score', 'Instant Feedback', 'Improvement Tips'].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      backgroundColor: 'rgba(136, 103, 184, 0.22)',
                      color: '#E9D5FF',
                      borderRadius: '9999px',
                      padding: '4px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 500,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: AI Speaking Examiner */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 20,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: 'rgba(136, 103, 184, 0.35)',
                    border: '1px solid rgba(136, 103, 184, 0.5)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FAF9F5',
                  }}
                >
                  <Mic size={20} />
                </div>
                <h3 style={{ fontSize: '1.24rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  AI Speaking Examiner
                </h3>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#D3CEE0', lineHeight: 1.6, margin: 0 }}>
                Record your answer in the browser. We transcribe it with OpenAI Whisper, then grade the transcript against all four IELTS Speaking criteria. Covers every part, including Part 2 cue cards and Part 3 abstract discussion questions.
              </p>

              {/* 4 Criteria Matrix */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 10,
                }}
              >
                {[
                  { code: 'FC', label: 'Fluency & Coherence' },
                  { code: 'LR', label: 'Lexical Resource' },
                  { code: 'GR', label: 'Grammatical Range' },
                  { code: 'PR', label: 'Pronunciation' },
                ].map((crit) => (
                  <div
                    key={crit.code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 8,
                      padding: '8px 10px',
                      fontSize: '0.78rem',
                      color: '#E8E5EE',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: '#8867B8',
                        color: '#FFFFFF',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      {crit.code}
                    </span>
                    <span>{crit.label}</span>
                  </div>
                ))}
              </div>

              {/* Feature Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
                {['Parts 1, 2 & 3', 'Whisper Transcription', 'Audio Recording', 'Per-Criterion Score'].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      backgroundColor: 'rgba(136, 103, 184, 0.22)',
                      color: '#E9D5FF',
                      borderRadius: '9999px',
                      padding: '4px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 500,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Model Calibration Verification Notice Box */}
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto 36px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 14,
              padding: '16px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: '0.84rem',
              color: '#D3CEE0',
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck size={20} color="#F6BD28" style={{ flexShrink: 0 }} />
            <span>
              Both examiners run on <strong>GPT-4o</strong>, calibrated against the public IELTS band descriptors and validated by an internal eval harness ( <code style={{ color: '#F6BD28', background: 'rgba(0,0,0,0.2)', padding: '2px 5px', borderRadius: 4 }}>ai:eval-writing</code> , <code style={{ color: '#F6BD28', background: 'rgba(0,0,0,0.2)', padding: '2px 5px', borderRadius: 4 }}>ai:eval-speaking</code> ) that keeps the mean error below 0.25 band.
            </span>
          </div>

          {/* Centered CTA Button Matching Screenshot 5 */}
          <div style={{ textAlign: 'center' }}>
            <Link
              href="/resources/ai-examiner"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: '9999px',
                backgroundColor: '#FFFFFF',
                color: '#202020',
                fontWeight: 700,
                fontSize: '0.92rem',
                padding: '14px 32px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <span>Try AI Examiner Free</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .ai-two-cards-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
