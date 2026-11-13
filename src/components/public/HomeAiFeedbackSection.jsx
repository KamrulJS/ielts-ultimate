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
    <section className={styles.sectionSpace} style={{ padding: '0 20px' }}>
      <div className={styles.container}>
        <div className={homeStyles.aiFeedbackWrapper}>
          {/* Section Header */}
          <div className={homeStyles.aiFeedbackHeader}>
            <span className={homeStyles.aiFeedbackEyebrow}>
              AI-Powered Feedback
            </span>
            <h2 className={homeStyles.aiFeedbackTitle}>
              Your personal AI examiner, <span style={{ color: 'var(--accent-yellow)' }}>available 24/7</span>
            </h2>
            <p className={homeStyles.aiFeedbackSubtitle}>
              Don&apos;t wait weeks for human feedback. Get detailed, rubric-based band scores on your Writing and Speaking instantly.
            </p>
          </div>

          {/* Two Distinct Cards Grid (Screenshot 04) */}
          <div className={homeStyles.aiFeedbackTwoCards}>
            {/* Card 1: AI Writing Examiner */}
            <div className={homeStyles.aiFeedbackCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className={homeStyles.aiCardIconBox}>
                  <PenTool size={22} />
                </div>
                <h3 className={homeStyles.aiCardTitle}>AI Writing Examiner</h3>
              </div>

              <p className={homeStyles.aiCardDesc}>
                Submit your Task 1 or Task 2 essay and get a full IELTS band breakdown in seconds. Every one of the four criteria is scored individually with comments that tell you exactly where you gained or lost marks, and how to push to the next band.
              </p>

              {/* 4 Criteria Matrix */}
              <div className={homeStyles.aiCriteriaMatrix}>
                <div className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>TA</span>
                  <span>Task Achievement</span>
                </div>
                <div className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>CC</span>
                  <span>Coherence &amp; Cohesion</span>
                </div>
                <div className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>LR</span>
                  <span>Lexical Resource</span>
                </div>
                <div className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>GR</span>
                  <span>Grammatical Range</span>
                </div>
              </div>

              {/* Feature Chips */}
              <div className={homeStyles.aiFeatureChips}>
                <span className={homeStyles.aiFeatureChip}>Task 1 &amp; Task 2</span>
                <span className={homeStyles.aiFeatureChip}>Per-Criterion Score</span>
                <span className={homeStyles.aiFeatureChip}>Instant Feedback</span>
                <span className={homeStyles.aiFeatureChip}>Improvement Tips</span>
              </div>
            </div>

            {/* Card 2: AI Speaking Examiner */}
            <div className={homeStyles.aiFeedbackCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className={homeStyles.aiCardIconBox}>
                  <Mic size={22} />
                </div>
                <h3 className={homeStyles.aiCardTitle}>AI Speaking Examiner</h3>
              </div>

              <p className={homeStyles.aiCardDesc}>
                Record your answer in the browser. We transcribe it with OpenAI Whisper, then grade the transcript against all four IELTS Speaking criteria. Covers every part, including Part 2 cue cards and Part 3 abstract discussion questions.
              </p>

              {/* 4 Criteria Matrix */}
              <div className={homeStyles.aiCriteriaMatrix}>
                <div className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>FC</span>
                  <span>Fluency &amp; Coherence</span>
                </div>
                <div className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>LR</span>
                  <span>Lexical Resource</span>
                </div>
                <div className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>GR</span>
                  <span>Grammatical Range</span>
                </div>
                <div className={homeStyles.aiCriteriaTag}>
                  <span className={homeStyles.aiCriteriaCode}>PR</span>
                  <span>Pronunciation</span>
                </div>
              </div>

              {/* Feature Chips */}
              <div className={homeStyles.aiFeatureChips}>
                <span className={homeStyles.aiFeatureChip}>Parts 1, 2 &amp; 3</span>
                <span className={homeStyles.aiFeatureChip}>Whisper Transcription</span>
                <span className={homeStyles.aiFeatureChip}>Audio Recording</span>
                <span className={homeStyles.aiFeatureChip}>Per-Criterion Score</span>
              </div>
            </div>
          </div>

          {/* Model Calibration Verification Notice Box */}
          <div className={homeStyles.aiVerifyCallout}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-yellow)', flexShrink: 0 }} />
            <span>
              Both examiners run on <strong>GPT-4o</strong>, calibrated against the official public IELTS band descriptors and validated by an internal eval harness (<code>ai:eval-writing</code>, <code>ai:eval-speaking</code>) that keeps the mean error below 0.25 band.
            </span>
          </div>

          {/* Centered CTA Button */}
          <div className={homeStyles.aiFeedbackCtaRow}>
            <Link
              href="/resources/ai-examiner"
              className="btn btn-primary btn-lg"
              style={{
                borderRadius: 0,
                backgroundColor: '#FFFFFF',
                color: '#202020',
                fontWeight: 700,
                padding: '14px 28px',
                border: 'none',
              }}
            >
              <span>Try AI Examiner Free</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

