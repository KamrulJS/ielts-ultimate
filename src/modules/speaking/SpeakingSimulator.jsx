'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ExamTopBar } from '@/components/examination/ExamTopBar';
import { RecordingControls } from '@/components/examination/RecordingControls';
import { Badge } from '@/components/common/UiPrimitives';
import speakingTopics from '@/data/speaking/topics.json';

const STEPS = [
  { id: 'mic', label: 'Mic Check' },
  { id: 'part1', label: 'Part 1: Interview' },
  { id: 'part2-prep', label: 'Part 2: 60s Prep' },
  { id: 'part2-rec', label: 'Part 2: Cue Card' },
  { id: 'part3', label: 'Part 3: Discussion' },
  { id: 'review', label: 'Review & Submit' },
];

export function SpeakingSimulator({ topicId }) {
  const router = useRouter();
  const { addSpeakingRecording, addTestResult } = useApp();

  const topic = speakingTopics.find((t) => t.id === topicId) || speakingTopics[0];
  const [stepIdx, setStepIdx] = useState(0);
  const [micPermission, setMicPermission] = useState('untested'); // untested | granted | fallback
  const [prepSeconds, setPrepSeconds] = useState(60);
  const [prepNotes, setPrepNotes] = useState('');
  const [recordings, setRecordings] = useState({});
  const [evaluating, setEvaluating] = useState(false);

  const currentStep = STEPS[stepIdx];

  // Part 2 60s prep countdown
  useEffect(() => {
    if (currentStep.id !== 'part2-prep') return undefined;
    if (prepSeconds <= 0) return undefined;
    const t = setInterval(() => setPrepSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [currentStep.id, prepSeconds]);

  const testMicrophone = async () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        setMicPermission('granted');
        return;
      } catch {
        setMicPermission('fallback');
        return;
      }
    }
    setMicPermission('fallback');
  };

  const handleSubmit = () => {
    setEvaluating(true);
    setTimeout(() => {
      const resId = `res-speaking-${Date.now()}`;
      addSpeakingRecording({
        id: resId,
        topicId: topic.id,
        title: topic.title,
        date: new Date().toISOString().slice(0, 10),
        bandScore: 6.5,
      });

      addTestResult({
        id: resId,
        type: 'speaking',
        title: topic.title,
        partLabel: 'Full Speaking (Parts 1-3)',
        date: new Date().toISOString().slice(0, 10),
        timeLabel: 'Just now',
        bandScore: 6.5,
        durationUsed: 'Completed',
        testId: topic.id,
        criteria: [
          { name: 'Fluency and Coherence', band: 6.5, comment: 'Clear pacing and cohesive storytelling.' },
          { name: 'Lexical Resource', band: 6.5, comment: 'Relevant descriptive vocabulary.' },
          { name: 'Grammatical Range and Accuracy', band: 6.0, comment: 'Use more complex hypothetical structures in Part 3.' },
          { name: 'Pronunciation', band: 7.0, comment: 'Clear consonant articulation and natural intonation.' },
        ],
      });

      router.push(`/speaking/result/${resId}`);
    }, 1100);
  };

  if (evaluating) {
    return (
      <div className="exam-shell" style={{ alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 420, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <Sparkles size={28} style={{ color: 'var(--accent-purple)' }} />
          <h2 className="h2">Preparing Demo Speaking Feedback...</h2>
          <p className="text-sm text-muted">Generating criterion-level notes across Fluency, Lexis, Grammar, and Pronunciation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-shell">
      <ExamTopBar
        title={topic.title}
        subtitle={`Step ${stepIdx + 1} of ${STEPS.length} • ${currentStep.label}`}
        totalSeconds={840}
        exitHref="/speaking"
        onSubmitClick={handleSubmit}
        submitLabel="Finish Speaking"
      />

      {/* Stepper Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '10px clamp(12px, 2vw, 20px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          maxWidth: '100%',
        }}
      >
        {STEPS.map((st, idx) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setStepIdx(idx)}
            className={`btn btn-sm ${idx === stepIdx ? 'btn-primary' : 'btn-secondary'}`}
          >
            {st.label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, maxWidth: 820, width: '100%', minWidth: 0, margin: '0 auto', padding: 'clamp(12px, 3vw, 24px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {currentStep.id === 'mic' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Badge variant="purple">Audio Setup</Badge>
            <h1 className="h2">Microphone & Recording Check</h1>
            <p className="text-sm text-muted">
              Click below to test browser microphone access for MediaRecorder playback. If a microphone isn&apos;t connected or permitted, IELTS Ultimate seamlessly activates a Demo Timer mode so you can still complete the simulation.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary" onClick={testMicrophone}>
                <Mic size={16} /> Test Microphone Permission
              </button>
              {micPermission === 'granted' && (
                <Badge variant="success"><CheckCircle2 size={13} /> Microphone Ready</Badge>
              )}
              {micPermission === 'fallback' && (
                <Badge variant="yellow"><AlertCircle size={13} /> Demo Timer Fallback Enabled</Badge>
              )}
            </div>
          </div>
        )}

        {currentStep.id === 'part1' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Badge variant="purple">Part 1 • Introduction & Interview (4–5 min)</Badge>
            <h2 className="h2">Answer the examiner&apos;s everyday questions naturally</h2>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topic.part1.map((q) => (
                <li key={q} style={{ fontWeight: 500 }}>{q}</li>
              ))}
            </ul>
            <RecordingControls
              maxSeconds={90}
              onRecordingComplete={(rec) => setRecordings((p) => ({ ...p, part1: rec }))}
            />
          </div>
        )}

        {currentStep.id === 'part2-prep' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge variant="yellow">Part 2 • 1-Minute Preparation</Badge>
              <Badge variant="dark"><Clock size={13} /> {prepSeconds}s remaining</Badge>
            </div>
            <h2 className="h2">{topic.part2.cueTitle}</h2>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {topic.part2.bullets.map((b) => (
                <li key={b} className="text-sm">{b}</li>
              ))}
            </ul>
            <div className="field-group">
              <label className="field-label" htmlFor="prep-notes">Keyword Notes (Optional)</label>
              <textarea
                id="prep-notes"
                className="textarea"
                rows={4}
                value={prepNotes}
                onChange={(e) => setPrepNotes(e.target.value)}
                placeholder="Jot down 4-6 trigger words (When, Where, Sensory detail, Why memorable)..."
              />
            </div>
          </div>
        )}

        {currentStep.id === 'part2-rec' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Badge variant="purple">Part 2 • Long Turn (Up to 2 Minutes)</Badge>
            <h2 className="h2">{topic.part2.cueTitle}</h2>
            {prepNotes && (
              <div className="card-warm card-compact">
                <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 4 }}>YOUR PREP NOTES</div>
                <p className="text-sm">{prepNotes}</p>
              </div>
            )}
            <RecordingControls
              maxSeconds={120}
              onRecordingComplete={(rec) => setRecordings((p) => ({ ...p, part2: rec }))}
            />
          </div>
        )}

        {currentStep.id === 'part3' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Badge variant="purple">Part 3 • Abstract Two-Way Discussion (4–5 min)</Badge>
            <h2 className="h2">Discuss broader societal implications</h2>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topic.part3.map((q) => (
                <li key={q} style={{ fontWeight: 500 }}>{q}</li>
              ))}
            </ul>
            <RecordingControls
              maxSeconds={120}
              onRecordingComplete={(rec) => setRecordings((p) => ({ ...p, part3: rec }))}
            />
          </div>
        )}

        {currentStep.id === 'review' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Badge variant="success">Ready for Review</Badge>
            <h2 className="h2">Review Completed Speaking Sections</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { key: 'part1', label: 'Part 1: Introduction & Interview' },
                { key: 'part2', label: 'Part 2: Cue Card Long Turn' },
                { key: 'part3', label: 'Part 3: Discussion' },
              ].map((s) => (
                <div
                  key={s.key}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</span>
                  {recordings[s.key] ? (
                    <Badge variant="success">Recorded ({recordings[s.key].durationSec}s)</Badge>
                  ) : (
                    <Badge variant="neutral">Ready / Optional</Badge>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Submit & View Demo Speaking Rubric →
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6 }}>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft size={15} /> Back
          </button>
          {stepIdx < STEPS.length - 1 && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStepIdx((i) => Math.min(STEPS.length - 1, i + 1))}
            >
              Continue <ChevronRight size={15} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

