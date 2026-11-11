'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { countWords, rawScoreToBand, roundIeltsBand } from '@/lib/utils';
import { ExamTopBar } from '@/components/examination/ExamTopBar';
import { AudioPlayer } from '@/components/examination/AudioPlayer';
import { QuestionInput } from '@/components/examination/QuestionInput';
import { RecordingControls } from '@/components/examination/RecordingControls';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { Badge, ProgressBar } from '@/components/common/UiPrimitives';

import mockTests from '@/data/tests/mock-tests.json';
import listeningTests from '@/data/listening/tests.json';
import listeningQuestions from '@/data/listening/questions.json';
import passages from '@/data/reading/passages.json';
import readingQuestions from '@/data/reading/questions.json';
import writingTasks from '@/data/writing/tasks.json';
import speakingTopics from '@/data/speaking/topics.json';

const SECTIONS = [
  { id: 'listening', label: '1. Listening', seconds: 1800, icon: Headphones },
  { id: 'reading', label: '2. Reading', seconds: 3600, icon: BookOpen },
  { id: 'writing', label: '3. Writing', seconds: 3600, icon: PenTool },
  { id: 'speaking', label: '4. Speaking', seconds: 840, icon: Mic },
];

export function MockExamSession({ mockId }) {
  const router = useRouter();
  const { addTestResult } = useApp();

  const mockMeta = mockTests.find((m) => m.id === mockId) || mockTests[0];
  const listenSet = listeningTests.find((l) => l.id === mockMeta.modules?.listeningId) || listeningTests[0];
  const readPassage = passages.find((p) => p.id === mockMeta.modules?.readingId) || passages[0];
  const writeTask = writingTasks.find((w) => w.id === mockMeta.modules?.writingId) || writingTasks[1];
  const speakTopic = speakingTopics.find((s) => s.id === mockMeta.modules?.speakingId) || speakingTopics[0];

  const lQuestions = useMemo(
    () => listeningQuestions.filter((q) => q.testId === listenSet.id).slice(0, 6),
    [listenSet.id]
  );
  const rQuestions = useMemo(
    () => readingQuestions.filter((q) => q.passageId === readPassage.id).slice(0, 8),
    [readPassage.id]
  );

  const storageKey = `ieltswist_mock_draft_${mockId}`;

  const [activeSection, setActiveSection] = useState('listening');
  const [listenAnswers, setListenAnswers] = useState({});
  const [readAnswers, setReadAnswers] = useState({});
  const [essayText, setEssayText] = useState('');
  const [speakingDone, setSpeakingDone] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  // Restore autosaved mock draft
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.listenAnswers) setListenAnswers(parsed.listenAnswers);
          if (parsed.readAnswers) setReadAnswers(parsed.readAnswers);
          if (parsed.essayText) setEssayText(parsed.essayText);
          if (parsed.speakingDone) setSpeakingDone(parsed.speakingDone);
        }
      } catch {
        // ignore
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [storageKey]);

  // Autosave
  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ listenAnswers, readAnswers, essayText, speakingDone })
      );
    } catch {
      // ignore
    }
  }, [storageKey, listenAnswers, readAnswers, essayText, speakingDone]);

  const completedSections = {
    listening: Object.keys(listenAnswers).length >= Math.max(1, Math.floor(lQuestions.length / 2)),
    reading: Object.keys(readAnswers).length >= Math.max(1, Math.floor(rQuestions.length / 2)),
    writing: countWords(essayText) >= 40,
    speaking: speakingDone,
  };

  const completedCount = Object.values(completedSections).filter(Boolean).length;
  const activeIdx = SECTIONS.findIndex((s) => s.id === activeSection);
  const currentSecMeta = SECTIONS[activeIdx] || SECTIONS[0];

  const handleFinalSubmit = () => {
    const lCorrect = lQuestions.filter(
      (q) => String(listenAnswers[q.id] || '').trim().toLowerCase() === String(q.answer).toLowerCase()
    ).length;
    const rCorrect = rQuestions.filter(
      (q) => String(readAnswers[q.id] || '').trim().toLowerCase() === String(q.answer).toLowerCase()
    ).length;

    const lBand = lQuestions.length ? rawScoreToBand(lCorrect, lQuestions.length) : 6.5;
    const rBand = rQuestions.length ? rawScoreToBand(rCorrect, rQuestions.length) : 6.5;
    const words = countWords(essayText);
    const wBand = words >= 200 ? 7.0 : words >= 100 ? 6.5 : 5.5;
    const sBand = speakingDone ? 6.5 : 6.0;
    const overall = roundIeltsBand((lBand + rBand + wBand + sBand) / 4);

    const resultId = `res-mock-${Date.now()}`;
    addTestResult({
      id: resultId,
      type: 'mock',
      title: mockMeta.title,
      partLabel: '4-Module Full Mock',
      date: new Date().toISOString().slice(0, 10),
      timeLabel: 'Just now',
      bandScore: overall,
      durationUsed: 'Completed session',
      testId: mockMeta.id,
      moduleScores: { reading: rBand, listening: lBand, writing: wBand, speaking: sBand },
      correct: lCorrect + rCorrect,
      incorrect: lQuestions.length + rQuestions.length - (lCorrect + rCorrect),
      unanswered: 0,
      totalQuestions: lQuestions.length + rQuestions.length,
      breakdown: [
        { label: 'Listening', correct: lCorrect, total: lQuestions.length, band: lBand },
        { label: 'Reading', correct: rCorrect, total: rQuestions.length, band: rBand },
        { label: `Writing (${words} words)`, band: wBand },
        { label: 'Speaking (Parts 1-3)', band: sBand },
      ],
    });

    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    router.push(`/test-results/mock/${resultId}`);
  };

  return (
    <div className="exam-shell">
      <ExamTopBar
        title={mockMeta.title}
        subtitle={`Section ${activeIdx + 1} of 4 • ${currentSecMeta.label}`}
        totalSeconds={currentSecMeta.seconds}
        answeredCount={completedCount}
        totalCount={4}
        exitHref="/mock-test"
        onSubmitClick={() => setConfirmSubmit(true)}
        submitLabel="Finish Mock Exam"
      />

      {/* Section Stepper Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            const done = completedSections[sec.id];
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Icon size={14} />
                <span>{sec.label}</span>
                {done && <CheckCircle2 size={13} style={{ color: active ? '#F6BD28' : '#39966B' }} />}
              </button>
            );
          })}
        </div>
        <div style={{ minWidth: 160 }}>
          <ProgressBar value={Math.round((completedCount / 4) * 100)} variant="purple" small showLabel />
        </div>
      </div>

      {/* Main Distraction-Free Section Body */}
      <main style={{ flex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: '20px' }}>
        {activeSection === 'listening' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AudioPlayer
              partTitle={listenSet.title}
              context="Listen carefully and answer Questions 1–6 below."
              durationSec={listenSet.parts?.[0]?.durationSec || 180}
              transcript={listenSet.parts?.[0]?.transcript || []}
            />
            <div className="grid-2">
              {lQuestions.map((q) => (
                <QuestionInput
                  key={q.id}
                  question={q}
                  value={listenAnswers[q.id] || ''}
                  onChange={(val) => setListenAnswers((p) => ({ ...p, [q.id]: val }))}
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'reading' && (
          <div className="grid-2" style={{ alignItems: 'start', gap: 20 }}>
            <div className="card" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              <Badge variant="purple">{readPassage.category}</Badge>
              <h2 className="h2" style={{ marginTop: 8, marginBottom: 12 }}>{readPassage.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, lineHeight: 1.7 }}>
                {readPassage.paragraphs.map((p) => (
                  <p key={p.label} style={{ fontSize: '0.94rem' }}>
                    <strong>{p.label}. </strong>
                    {p.text}
                  </p>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '72vh', overflowY: 'auto' }}>
              {rQuestions.map((q) => (
                <QuestionInput
                  key={q.id}
                  question={q}
                  value={readAnswers[q.id] || ''}
                  onChange={(val) => setReadAnswers((p) => ({ ...p, [q.id]: val }))}
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'writing' && (
          <div className="grid-2" style={{ alignItems: 'start', gap: 20 }}>
            <div className="card">
              <Badge variant="yellow">Writing Task {writeTask.taskNumber}</Badge>
              <h2 className="h2" style={{ marginTop: 10 }}>{writeTask.title}</h2>
              <p className="text-sm" style={{ marginTop: 10, lineHeight: 1.65 }}>{writeTask.prompt}</p>
              <div className="card-warm card-compact" style={{ marginTop: 16 }}>
                <div className="text-xs" style={{ fontWeight: 700, marginBottom: 6 }}>KEY CHECKLIST</div>
                <ul style={{ paddingLeft: 18, fontSize: '0.82rem' }}>
                  {writeTask.keyTips?.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>Response Editor</span>
                <Badge variant={countWords(essayText) >= writeTask.minWords ? 'success' : 'neutral'}>
                  {countWords(essayText)} / {writeTask.minWords}+ words
                </Badge>
              </div>
              <textarea
                className="textarea"
                rows={15}
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Write your essay here. Your text saves automatically..."
              />
            </div>
          </div>
        )}

        {activeSection === 'speaking' && (
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <Badge variant="purple">Speaking Part 2 Cue Card</Badge>
              <h2 className="h2" style={{ marginTop: 10 }}>{speakTopic.part2.cueTitle}</h2>
              <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {speakTopic.part2.bullets.map((b) => (
                  <li key={b} className="text-sm">{b}</li>
                ))}
              </ul>
            </div>
            <RecordingControls maxSeconds={120} onRecordingComplete={() => setSpeakingDone(true)} />
          </div>
        )}

        {/* Bottom Prev / Next Section Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 22,
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            disabled={activeIdx === 0}
            onClick={() => setActiveSection(SECTIONS[activeIdx - 1].id)}
          >
            <ChevronLeft size={16} /> Previous Section
          </button>

          {activeIdx < SECTIONS.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setActiveSection(SECTIONS[activeIdx + 1].id)}
            >
              Next Section <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => setConfirmSubmit(true)}
            >
              Submit Complete Mock Exam →
            </button>
          )}
        </div>
      </main>

      <ConfirmationDialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        onConfirm={handleFinalSubmit}
        title="Submit Full Mock Exam?"
        message={`You have completed ${completedCount} of 4 modules. Submitting now will score your Listening & Reading answers and generate your overall band report.`}
        confirmLabel="Submit & View Report"
      />
    </div>
  );
}

