'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Eye, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { rawScoreToBand } from '@/lib/utils';
import { ExamTopBar } from '@/components/examination/ExamTopBar';
import { AudioPlayer } from '@/components/examination/AudioPlayer';
import { QuestionNavigator } from '@/components/examination/QuestionNavigator';
import { QuestionInput } from '@/components/examination/QuestionInput';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/UiPrimitives';

import listeningTests from '@/data/listening/tests.json';
import allQuestions from '@/data/listening/questions.json';

export function ListeningExamInterface({ testId, initialPart = 1 }) {
  const router = useRouter();
  const { bookmarks, toggleBookmark, addTestResult } = useApp();

  const test = listeningTests.find((t) => t.id === testId) || listeningTests[0];
  const questions = useMemo(() => {
    const specific = allQuestions.filter((q) => q.testId === test.id);
    if (specific.length) return specific;
    // Fallback realistic questions distributed across parts 1-4
    return allQuestions.slice(0, 10).map((q, idx) => ({
      ...q,
      id: `${test.id}-q-${idx + 1}`,
      number: idx + 1,
    }));
  }, [test.id]);

  const draftKey = `ielts_ultimate_listening_draft_${test.id}`;
  const [activePart, setActivePart] = useState(Number(initialPart) || 1);
  const [answers, setAnswers] = useState({});
  const [reviewOpen, setReviewOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(draftKey);
        if (saved) setAnswers(JSON.parse(saved));
      } catch {
        // ignore
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [draftKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(draftKey, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [draftKey, answers]);

  const currentPartMeta = test.parts.find((p) => p.partNumber === activePart) || test.parts[0];
  const partQuestions = questions.filter((q) => q.partNumber === activePart);
  const visibleQuestions = partQuestions.length ? partQuestions : questions;
  const answeredCount = questions.filter((q) => Boolean(answers[q.id] && String(answers[q.id]).trim())).length;

  const handleSubmit = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    const items = questions.map((q) => {
      const userAns = String(answers[q.id] || '').trim();
      if (!userAns) {
        unanswered += 1;
        return {
          number: q.number,
          question: q.prompt,
          userAnswer: '',
          correctAnswer: q.answer,
          status: 'unanswered',
          explanation: q.explanation,
        };
      }
      const isRight = userAns.toLowerCase() === String(q.answer).toLowerCase();
      if (isRight) correct += 1;
      else incorrect += 1;
      return {
        number: q.number,
        question: q.prompt,
        userAnswer: userAns,
        correctAnswer: q.answer,
        status: isRight ? 'correct' : 'incorrect',
        explanation: q.explanation,
      };
    });

    const band = rawScoreToBand(correct, questions.length);
    const resultId = `res-listening-${Date.now()}`;

    addTestResult({
      id: resultId,
      type: 'listening',
      title: test.title,
      partLabel: 'All 4 Sections',
      date: new Date().toISOString().slice(0, 10),
      timeLabel: 'Just now',
      bandScore: band,
      correct,
      incorrect,
      unanswered,
      totalQuestions: questions.length,
      durationUsed: 'Completed',
      testId: test.id,
      items,
    });

    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
    router.push(`/listening/result/${resultId}`);
  };

  return (
    <div className="exam-shell">
      <ExamTopBar
        title={test.title}
        subtitle={`Part ${activePart} of 4 • ${test.accent}`}
        totalSeconds={test.durationMinutes * 60}
        answeredCount={answeredCount}
        totalCount={questions.length}
        exitHref="/listening"
        onSubmitClick={() => setConfirmSubmit(true)}
        submitLabel="Submit Listening"
      />

      {/* Part 1-4 Navigation Tabs */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div className="tabs-list">
          {test.parts.map((pt) => (
            <button
              key={pt.partNumber}
              type="button"
              className={`tab-trigger ${activePart === pt.partNumber ? 'active' : ''}`}
              onClick={() => setActivePart(pt.partNumber)}
            >
              Part {pt.partNumber}
            </button>
          ))}
        </div>

        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setReviewOpen(true)}>
          <Eye size={14} /> Review All Answers ({answeredCount}/{questions.length})
        </button>
      </div>

      <main style={{ flex: 1, maxWidth: 1040, width: '100%', margin: '0 auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <AudioPlayer
          partTitle={currentPartMeta.title}
          context={currentPartMeta.context}
          durationSec={currentPartMeta.durationSec}
          transcript={currentPartMeta.transcript}
          audioUrl={currentPartMeta.audioUrl}
        />

        {activePart === 2 && (
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <MapPin size={16} style={{ color: 'var(--accent-purple)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Interactive Reference Map — Part 2 Orientation</span>
              <Badge variant="purple">N ↑</Badge>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                gap: 8,
                padding: 12,
                borderRadius: 12,
                backgroundColor: 'var(--bg-primary)',
                border: '1px dashed var(--border-strong)',
                textAlign: 'center',
                fontSize: '0.8rem',
              }}
            >
              <div className="card card-compact">NW: Glasshouse Entry</div>
              <div className="card card-compact">N: Lotus Pond</div>
              <div className="card card-compact" style={{ backgroundColor: 'var(--accent-yellow-soft)' }}>NE: Zone B</div>
              <div className="card card-compact">W: Heritage Clocktower</div>
              <div className="card-dark card-compact" style={{ padding: 12 }}>Main Courtyard (Start)</div>
              <div className="card card-compact">E: Fountain Plaza</div>
            </div>
          </div>
        )}

        <QuestionNavigator
          questions={questions}
          answers={answers}
          bookmarkedIds={bookmarks.questions}
          activeIndex={Math.max(0, questions.findIndex((q) => q.partNumber === activePart))}
          onSelect={(idx) => {
            const targetQ = questions[idx];
            if (targetQ) setActivePart(targetQ.partNumber);
          }}
        />

        <div className="grid-2" style={{ gap: 14 }}>
          {visibleQuestions.map((q) => (
            <QuestionInput
              key={q.id}
              question={q}
              value={answers[q.id] || ''}
              onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
              isBookmarked={bookmarks.questions.includes(q.id)}
              onToggleBookmark={(id) => toggleBookmark('questions', id, 'Saved Questions')}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={activePart <= 1}
            onClick={() => setActivePart((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={15} /> Previous Part
          </button>
          {activePart < 4 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setActivePart((p) => Math.min(4, p + 1))}
            >
              Next Part <ChevronRight size={15} />
            </button>
          ) : (
            <button type="button" className="btn btn-accent" onClick={() => setConfirmSubmit(true)}>
              Finish & Submit →
            </button>
          )}
        </div>
      </main>

      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title="Listening Answer Sheet Review" large>
        <div className="grid-2" style={{ gap: 10 }}>
          {questions.map((q) => (
            <div
              key={q.id}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <span className="text-xs" style={{ fontWeight: 600 }}>Q{q.number} (Part {q.partNumber})</span>
              <span className="text-xs" style={{ fontWeight: 700, color: answers[q.id] ? 'var(--success)' : 'var(--error)' }}>
                {answers[q.id] || 'Unanswered'}
              </span>
            </div>
          ))}
        </div>
      </Modal>

      <ConfirmationDialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        onConfirm={handleSubmit}
        title="Submit Listening Test?"
        message={`You answered ${answeredCount} of ${questions.length} questions. Ready to score and view explanations?`}
        confirmLabel="Submit Listening"
      />
    </div>
  );
}

