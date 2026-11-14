'use client';

import React from 'react';
import Link from 'next/link';
import {
  PenTool,
  Mic,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import homeStyles from '@/modules/public/PublicHome.module.css';
import styles from './PublicLayout.module.css';

export function HomeAiFeedbackSection() {
  return (
    <section className={styles.sectionWarmBand} style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 0' }}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={homeStyles.aiFeedbackHeader}>
          <span
            className="badge badge-purple"
            style={{
              borderRadius: 0,
              padding: '5px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: 14,
              display: 'inline-flex',
            }}
          >
            AI-Powered Feedback
          </span>
          <h2 className={homeStyles.aiFeedbackTitle}>
            Your Personal AI Examiner, Available 24/7
          </h2>
          <p className={homeStyles.aiFeedbackSubtitle}>
            Don&apos;t wait weeks for human feedback. Get detailed, rubric-based band scores on your Writing and Speaking instantly.
          </p>
        </div>

        {/* Two Distinct Cards Grid */}
        <div className={homeStyles.aiFeedbackTwoCards}>
          {/* Card 1: AI Writing Examiner */}
          <div className={homeStyles.aiFeedbackCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className={homeStyles.aiCardIconBox}>
                <PenTool size={22} />
              </div>
              <h3 className={homeStyles.aiCardTitle}>
                AI Writing Examiner
              </h3>
            </div>

            <p className={homeStyles.aiCardDesc}>
              Submit your Task 1 or Task 2 essay and get a full IELTS band breakdown in seconds. Every one of the four criteria is scored individually with comments that tell you exactly where you gained or lost marks, and how to push to the next band.
            </p>

            {/* 4 Criteria Matrix */}
            <div className={homeStyles.aiCriteriaMatrix}>
              {[
                { code: 'TA', label: 'Task Achievement' },
                { code: 'CC', label: 'Coherence & Cohesion' },
                { code: 'LR', label: 'Lexical Resource' },
                { code: 'GR', label: 'Grammatical Range' },
              ].map((crit) => (
                <div key={crit.code} className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>
                    {crit.code}
                  </span>
                  <span>{crit.label}</span>
                </div>
              ))}
            </div>

            {/* Feature Chips */}
            <div className={homeStyles.aiFeatureChips}>
              {['Task 1 & Task 2', 'Per-Criterion Score', 'Instant Feedback', 'Improvement Tips'].map((chip) => (
                <span key={chip} className={homeStyles.aiFeatureChip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: AI Speaking Examiner */}
          <div className={homeStyles.aiFeedbackCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className={homeStyles.aiCardIconBox}>
                <Mic size={22} />
              </div>
              <h3 className={homeStyles.aiCardTitle}>
                AI Speaking Examiner
              </h3>
            </div>

            <p className={homeStyles.aiCardDesc}>
              Record your answer in the browser. We transcribe it with high precision, then grade the transcript against all four IELTS Speaking criteria. Covers every part, including Part 2 cue cards and Part 3 abstract discussion questions.
            </p>

            {/* 4 Criteria Matrix */}
            <div className={homeStyles.aiCriteriaMatrix}>
              {[
                { code: 'FC', label: 'Fluency & Coherence' },
                { code: 'LR', label: 'Lexical Resource' },
                { code: 'GR', label: 'Grammatical Range' },
                { code: 'PR', label: 'Pronunciation' },
              ].map((crit) => (
                <div key={crit.code} className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>
                    {crit.code}
                  </span>
                  <span>{crit.label}</span>
                </div>
              ))}
            </div>

            {/* Feature Chips */}
            <div className={homeStyles.aiFeatureChips}>
              {['Parts 1, 2 & 3', 'Speech Transcription', 'Audio Recording', 'Per-Criterion Score'].map((chip) => (
                <span key={chip} className={homeStyles.aiFeatureChip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Model Calibration Verification Notice Box */}
        <div className={homeStyles.aiVerifyCallout}>
          <ShieldCheck size={22} color="#8867B8" style={{ flexShrink: 0 }} />
          <span>
            Both examiners run on fine-tuned LLM architectures calibrated against official public IELTS band descriptors and validated by an internal evaluation harness (<code style={{ color: '#8867B8', background: 'rgba(136, 103, 184, 0.14)', padding: '2px 6px', borderRadius: 0, fontWeight: 700 }}>ai:eval-writing</code>, <code style={{ color: '#8867B8', background: 'rgba(136, 103, 184, 0.14)', padding: '2px 6px', borderRadius: 0, fontWeight: 700 }}>ai:eval-speaking</code>) keeping the mean absolute score deviation below 0.25 band.
          </span>
        </div>

        {/* Centered CTA Button */}
        <div className={homeStyles.aiFeedbackCtaRow}>
          <Link
            href="/resources/ai-examiner"
            className="btn btn-primary btn-lg"
            style={{
              borderRadius: 0,
              padding: '14px 34px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>Try AI Examiner Free</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
