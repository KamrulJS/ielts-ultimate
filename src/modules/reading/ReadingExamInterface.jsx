'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Highlighter,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Eraser,
  BookOpen,
  ListChecks,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ExamTopBar } from '@/components/examination/ExamTopBar';
import { QuestionNavigator } from '@/components/examination/QuestionNavigator';
import { QuestionInput } from '@/components/examination/QuestionInput';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { Badge } from '@/components/common/UiPrimitives';
import { getReadingTestPackage } from '@/lib/reading-repository';
import { validateReadingAnswer, rawScoreToAcademicReadingBand } from '@/lib/reading-validation';

export function ReadingExamInterface({ passageId }) {
  const router = useRouter();
  const { bookmarks, toggleBookmark, addTestResult, showToast } = useApp();

  // Load complete 3-passage test package and all 40 questions
  const testPackage = useMemo(() => getReadingTestPackage(passageId), [passageId]);
  const { test, passages, questions, totalQuestions } = testPackage;

  // Active passage index: 0 (Passage 1), 1 (Passage 2), 2 (Passage 3)
  const [activePassageIndex, setActivePassageIndex] = useState(() => {
    const idx = passages.findIndex((p) => p.id === passageId);
    return idx >= 0 ? idx : 0;
  });

  const activePassage = passages[activePassageIndex] || passages[0];

  // Active question index: 0 to questions.length - 1
  const [activeQIndex, setActiveQIndex] = useState(0);

  // Candidate answers map: { [questionId]: answerString }
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [highlights, setHighlights] = useState([]); // { phrase, color }
  const [splitPercent, setSplitPercent] = useState(50);
  const [fontSize, setFontSize] = useState('md');
  const [mobileTab, setMobileTab] = useState('passage'); // 'passage' | 'questions'
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const draftKey = `ielts_academic_reading_draft_${test.id}`;

  // Restore saved draft from localStorage
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(draftKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.notes) setNotes(parsed.notes);
          if (parsed.highlights) setHighlights(parsed.highlights);
          if (typeof parsed.activePassageIndex === 'number') setActivePassageIndex(parsed.activePassageIndex);
        }
      } catch {
        // ignore storage errors
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [draftKey]);

  // Autosave draft
  useEffect(() => {
    try {
      window.localStorage.setItem(
        draftKey,
        JSON.stringify({ answers, notes, highlights, activePassageIndex })
      );
    } catch {
      // ignore
    }
  }, [draftKey, answers, notes, highlights, activePassageIndex]);

  // Highlight functionality
  const handleHighlightSelection = (color) => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (!text || text.length < 3) {
      showToast('Select a phrase in the passage first to highlight it', 'info');
      return;
    }
    setHighlights((prev) => {
      if (prev.some((h) => h.phrase === text)) return prev;
      return [...prev, { phrase: text, color }];
    });
    sel.removeAllRanges();
  };

  const renderHighlightedText = (paragraphText) => {
    if (!highlights.length) return paragraphText;
    let segments = [{ text: paragraphText, color: null }];
    highlights.forEach((h) => {
      const nextSegments = [];
      segments.forEach((seg) => {
        if (seg.color || !seg.text.includes(h.phrase)) {
          nextSegments.push(seg);
          return;
        }
        const parts = seg.text.split(h.phrase);
        parts.forEach((part, idx) => {
          if (part) nextSegments.push({ text: part, color: null });
          if (idx < parts.length - 1) nextSegments.push({ text: h.phrase, color: h.color });
        });
      });
      segments = nextSegments;
    });

    return segments.map((seg, i) =>
      seg.color ? (
        <mark
          key={i}
          onClick={() => setHighlights((prev) => prev.filter((x) => x.phrase !== seg.text))}
          title="Click to remove highlight"
          style={{
            backgroundColor: seg.color === 'purple' ? '#E9DDFB' : '#FDE89B',
            color: '#202020',
            padding: '1px 3px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {seg.text}
        </mark>
      ) : (
        <React.Fragment key={i}>{seg.text}</React.Fragment>
      )
    );
  };

  // Switch passage when user selects a question outside current passage
  const handleSelectQuestion = (idx) => {
    const targetQ = questions[idx];
    if (!targetQ) return;
    setActiveQIndex(idx);

    // Find which passage this question belongs to
    const targetPassageIdx = passages.findIndex((p) => p.id === targetQ.passageId);
    if (targetPassageIdx >= 0 && targetPassageIdx !== activePassageIndex) {
      setActivePassageIndex(targetPassageIdx);
    }

    // Scroll question into view in the questions pane
    requestAnimationFrame(() => {
      const qEl = document.getElementById(`reading-q-${targetQ.id}`);
      qEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  // Navigate Previous / Next question
  const handlePrevQuestion = () => {
    if (activeQIndex > 0) {
      handleSelectQuestion(activeQIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (activeQIndex < questions.length - 1) {
      handleSelectQuestion(activeQIndex + 1);
    }
  };

  // Questions filtered to the current active passage
  const currentPassageQuestions = useMemo(() => {
    return questions.filter((q) => q.passageId === activePassage.id);
  }, [questions, activePassage.id]);

  // Answer counts and unanswered tracking
  const answeredCount = useMemo(() => {
    return questions.filter((q) => Boolean(answers[q.id] && String(answers[q.id]).trim())).length;
  }, [questions, answers]);

  const unansweredQuestions = useMemo(() => {
    return questions
      .filter((q) => !Boolean(answers[q.id] && String(answers[q.id]).trim()))
      .map((q) => q.number);
  }, [questions, answers]);

  // Submit test and calculate authentic Academic band
  const handleSubmit = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const passageScores = [
      { label: 'Passage 1', correct: 0, total: 0 },
      { label: 'Passage 2', correct: 0, total: 0 },
      { label: 'Passage 3', correct: 0, total: 0 },
    ];

    const items = questions.map((q) => {
      const pIdx = Math.max(0, (q.passageNumber || 1) - 1);
      if (passageScores[pIdx]) passageScores[pIdx].total += 1;

      const validation = validateReadingAnswer(answers[q.id], q);

      if (validation.isUnanswered) {
        unansweredCount += 1;
      } else if (validation.isCorrect) {
        correctCount += 1;
        if (passageScores[pIdx]) passageScores[pIdx].correct += 1;
      } else {
        incorrectCount += 1;
      }

      return {
        number: q.number,
        question: q.prompt,
        userAnswer: validation.userAnswer,
        correctAnswer: validation.correctAnswer,
        status: validation.status,
        explanation: validation.explanation,
      };
    });

    // Official IELTS Academic Reading Band Score
    const band = rawScoreToAcademicReadingBand(correctCount);
    const resultId = `res-reading-${Date.now()}`;

    addTestResult({
      id: resultId,
      type: 'reading',
      title: test.title,
      partLabel: `IELTS Academic Reading (${test.collection || 'Official Practice'})`,
      date: new Date().toISOString().slice(0, 10),
      timeLabel: 'Just now',
      bandScore: band,
      correct: correctCount,
      incorrect: incorrectCount,
      unanswered: unansweredCount,
      totalQuestions: questions.length,
      durationUsed: 'Completed',
      testId: test.id,
      breakdown: passageScores.map((ps) => ({
        label: ps.label,
        correct: ps.correct,
        total: ps.total,
        band: rawScoreToAcademicReadingBand(Math.round((ps.correct / (ps.total || 13)) * 40)),
      })),
      items,
    });

    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }

    router.push(`/reading/result/${resultId}`);
  };

  const passageFontSize = fontSize === 'sm' ? '0.9rem' : fontSize === 'lg' ? '1.08rem' : '0.98rem';

  return (
    <div className="exam-shell">
      <ExamTopBar
        title={test.title}
        subtitle={`${activePassage.partLabel}: ${activePassage.title} • 3 Passages • ${questions.length} Questions`}
        totalSeconds={60 * 60}
        answeredCount={answeredCount}
        totalCount={questions.length}
        exitHref="/reading"
        onSubmitClick={() => setConfirmSubmit(true)}
        submitLabel="Submit Reading Test"
      />

      {/* Reading Utility Toolbar */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '8px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleHighlightSelection('yellow')}
            title="Select passage text then click to highlight"
            style={{ borderRadius: 0 }}
          >
            <Highlighter size={14} style={{ color: '#A67400' }} /> Highlight Yellow
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleHighlightSelection('purple')}
            style={{ borderRadius: 0 }}
          >
            <Highlighter size={14} style={{ color: 'var(--accent-purple)' }} /> Highlight Purple
          </button>
          {highlights.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setHighlights([])}
              style={{ borderRadius: 0 }}
            >
              <Eraser size={14} /> Clear ({highlights.length})
            </button>
          )}
          <button
            type="button"
            className={`btn btn-sm ${showNotes ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowNotes((v) => !v)}
            style={{ borderRadius: 0 }}
          >
            <StickyNote size={14} /> Notes
          </button>
        </div>

        {/* Split Width Presets & Font Size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="desktop-split-controls" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="text-xs text-muted">Split:</span>
            {[40, 50, 60].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setSplitPercent(pct)}
                className={`btn btn-sm ${splitPercent === pct ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 8px', fontSize: '0.73rem', borderRadius: 0 }}
              >
                {pct}/{100 - pct}
              </button>
            ))}
          </div>

          <div className="tabs-list" style={{ padding: 2 }}>
            {['sm', 'md', 'lg'].map((sz) => (
              <button
                key={sz}
                type="button"
                className={`tab-trigger ${fontSize === sz ? 'active' : ''}`}
                onClick={() => setFontSize(sz)}
                style={{ padding: '3px 8px', fontSize: '0.74rem', textTransform: 'uppercase' }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Passage/Question Switcher */}
      <div className="mobile-reading-tabs" style={{ padding: '10px 16px 0' }}>
        <div className="tabs-list" style={{ width: '100%' }}>
          <button
            type="button"
            className={`tab-trigger ${mobileTab === 'passage' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setMobileTab('passage')}
          >
            <BookOpen size={14} /> Passage {activePassage.passageNumber}
          </button>
          <button
            type="button"
            className={`tab-trigger ${mobileTab === 'questions' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setMobileTab('questions')}
          >
            <ListChecks size={14} /> Questions ({answeredCount}/{questions.length})
          </button>
        </div>
      </div>

      {/* Split Screen Exam Body */}
      <div
        className="reading-split-grid"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: `${splitPercent}% ${100 - splitPercent}%`,
          height: 'calc(100vh - 118px)',
          overflow: 'hidden',
        }}
      >
        {/* Left Panel: Passages Navigation & Reading Content */}
        <section
          className={`reading-pane ${mobileTab !== 'passage' ? 'mobile-hidden' : ''}`}
          style={{
            padding: '20px 28px',
            overflowY: 'auto',
            minWidth: 0,
            borderRight: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          {/* Top 3-Passage Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 12,
              marginBottom: 16,
              flexWrap: 'wrap',
            }}
          >
            {passages.map((p, idx) => {
              const isActive = activePassageIndex === idx;
              const qRange = idx === 0 ? 'Q1–13' : idx === 1 ? 'Q14–26' : 'Q27–40';
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePassageIndex(idx)}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    borderRadius: 0,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                  }}
                >
                  <span>Passage {p.passageNumber}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      opacity: 0.9,
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                      padding: '2px 5px',
                    }}
                  >
                    {qRange}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Badge variant="purple">{activePassage.partLabel}</Badge>
            <Badge variant="neutral">{activePassage.category}</Badge>
            <Badge variant="yellow">Academic Standard</Badge>
          </div>

          <h1 className="h1" style={{ fontSize: '1.45rem', marginBottom: 6 }}>
            {activePassage.title}
          </h1>

          <p className="text-sm text-muted" style={{ marginTop: 4, marginBottom: 16, lineHeight: 1.55 }}>
            {activePassage.subtitle}
          </p>

          {showNotes && (
            <div className="card-warm card-compact" style={{ marginBottom: 18, borderRadius: 0 }}>
              <div className="field-label" style={{ marginBottom: 6 }}>Candidate Scratchpad &amp; Notes</div>
              <textarea
                className="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot key facts, dates, or paragraph anchors here..."
                style={{ borderRadius: 0 }}
              />
            </div>
          )}

          {/* Reading Paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: passageFontSize, lineHeight: 1.75 }}>
            {activePassage.paragraphs?.map((para) => (
              <p key={para.label} style={{ margin: 0 }}>
                <strong
                  style={{
                    display: 'inline-flex',
                    width: 24,
                    height: 24,
                    backgroundColor: 'var(--bg-secondary)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    fontSize: '0.82rem',
                    fontWeight: 800,
                  }}
                >
                  {para.label}
                </strong>
                {renderHighlightedText(para.text)}
              </p>
            ))}
          </div>
        </section>

        {/* Right Panel: Question Navigator & Inputs */}
        <section
          className={`reading-pane ${mobileTab !== 'questions' ? 'mobile-hidden' : ''}`}
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            minWidth: 0,
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Question Navigator across all 40 questions */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Questions Navigator (1–{questions.length})
              </span>
              <span className="text-xs text-muted">
                {answeredCount} / {questions.length} Answered
              </span>
            </div>
            <QuestionNavigator
              questions={questions}
              answers={answers}
              bookmarkedIds={bookmarks.questions}
              activeIndex={activeQIndex}
              onSelect={handleSelectQuestion}
            />
          </div>

          {/* Passage Range Header */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(136, 103, 184, 0.08)',
              borderLeft: '3px solid var(--accent-purple)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)' }}>
              {activePassage.partLabel}: Questions {activePassageIndex === 0 ? '1–13' : activePassageIndex === 1 ? '14–26' : '27–40'}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {activePassage.title}
            </span>
          </div>

          {/* Render Questions for Current Passage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {currentPassageQuestions.map((q) => (
              <div
                key={q.id}
                id={`reading-q-${q.id}`}
                onFocus={() => setActiveQIndex(q.number - 1)}
                onClick={() => setActiveQIndex(q.number - 1)}
              >
                <QuestionInput
                  question={q}
                  value={answers[q.id] || ''}
                  onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                  isBookmarked={bookmarks.questions.includes(q.id)}
                  onToggleBookmark={(qId) => toggleBookmark('questions', qId, 'Saved Questions')}
                />
              </div>
            ))}
          </div>

          {/* Bottom Question Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 24,
              borderTop: '1px solid var(--border)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={activeQIndex === 0}
              onClick={handlePrevQuestion}
              style={{ borderRadius: 0 }}
            >
              <ChevronLeft size={15} /> Previous Question
            </button>

            <span className="text-xs text-muted" style={{ fontWeight: 600 }}>
              Question {activeQIndex + 1} of {questions.length}
            </span>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={activeQIndex >= questions.length - 1}
              onClick={handleNextQuestion}
              style={{ borderRadius: 0 }}
            >
              Next Question <ChevronRight size={15} />
            </button>
          </div>
        </section>
      </div>

      {/* Confirmation Dialog on Submit */}
      <ConfirmationDialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        onConfirm={handleSubmit}
        title="Submit IELTS Academic Reading Test?"
        message={
          unansweredQuestions.length > 0
            ? `You have answered ${answeredCount} of ${questions.length} questions. You currently have ${unansweredQuestions.length} unanswered questions (${unansweredQuestions.slice(0, 8).join(', ')}${unansweredQuestions.length > 8 ? '...' : ''}). Submit now?`
            : `You have completed all ${questions.length} questions! Submit now to view your official band score and question explanations?`
        }
        confirmLabel="Submit Test Now"
      />

      <style jsx>{`
        .mobile-reading-tabs {
          display: none;
        }
        @media (max-width: 960px) {
          .desktop-split-controls {
            display: none !important;
          }
          .mobile-reading-tabs {
            display: block;
          }
          .reading-split-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            height: auto !important;
            overflow: visible !important;
          }
          .reading-pane {
            border-right: none !important;
            overflow: visible !important;
            padding: 16px !important;
          }
          .mobile-hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
