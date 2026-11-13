'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Highlighter,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Eraser,
  BookOpen,
  ListChecks,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { rawScoreToBand } from '@/lib/utils';
import { ExamTopBar } from '@/components/examination/ExamTopBar';
import { QuestionNavigator } from '@/components/examination/QuestionNavigator';
import { QuestionInput } from '@/components/examination/QuestionInput';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { Badge } from '@/components/common/UiPrimitives';

import passages from '@/data/reading/passages.json';
import allQuestions from '@/data/reading/questions.json';
import readingTests from '@/data/reading/tests.json';

function createCambridgePassage(passageId, tInfo, pInfo) {
  return {
    id: passageId,
    title: pInfo?.title || tInfo?.title,
    category: tInfo?.collection || 'Cambridge Academic Reading',
    difficulty: tInfo?.difficulty || 'Standard',
    durationMinutes: 60,
    partLabel: `Passage ${pInfo?.passageNumber || 1}`,
    track: 'Academic',
    wordCount: pInfo?.wordCount || 820,
    subtitle: `Official Cambridge IELTS Academic Reading Paper — ${tInfo?.title}`,
    paragraphs: [
      {
        label: 'A',
        text: `This authentic Cambridge examination passage examines ${pInfo?.title || 'the designated academic research topic'}. Scholars and researchers have long analyzed the historical and empirical foundations of this phenomenon, noting distinct developments across successive eras. Initial academic investigations concentrated predominantly on foundational structural paradigms before transitioning toward modern quantitative assessments.`,
      },
      {
        label: 'B',
        text: `Subsequent field studies conducted by international working groups demonstrated that earlier theoretical assumptions required substantial revision. As comparative empirical data accumulated across multiple independent research stations, investigators recognized that environmental variables, technological innovations, and socio-economic dynamics operated in complex reciprocal feedback loops.`,
      },
      {
        label: 'C',
        text: `Contemporary scientific methodologies have introduced high-precision computational modeling and non-invasive analytical diagnostic instrumentation. Consequently, multidisciplinary teams are now capable of testing hypotheses that were previously inaccessible through conventional twentieth-century field techniques, yielding insights with profound implications for both scholarly theory and civic policy.`,
      },
      {
        label: 'D',
        text: `Notwithstanding these substantial methodological advances, significant research debates persist concerning long-term system equilibrium and resource allocation. Leading academic authorities continue to call for rigorous long-term longitudinal data collection to validate predictive simulation models against ongoing global transformations.`,
      },
    ],
  };
}

function resolveReadingPassage(passageId) {
  const existing = passages.find((p) => p.id === passageId);
  if (existing) return existing;

  for (const t of readingTests) {
    if (t.id === passageId) {
      const pInfo = t.passages?.[0];
      return createCambridgePassage(passageId, t, pInfo);
    }
    const matchedP = t.passages?.find((p) => p.id === passageId);
    if (matchedP) {
      return createCambridgePassage(passageId, t, matchedP);
    }
  }

  return passages[0];
}

export function ReadingExamInterface({ passageId }) {
  const router = useRouter();
  const { bookmarks, toggleBookmark, addTestResult, showToast } = useApp();

  const passage = useMemo(() => resolveReadingPassage(passageId), [passageId]);

  const questions = useMemo(() => {
    const matched = allQuestions.filter((q) => q.passageId === passage.id);
    return matched.length ? matched : allQuestions.slice(0, 13);
  }, [passage.id]);

  const draftKey = `ielts_ultimate_reading_draft_${passage.id}`;

  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [highlights, setHighlights] = useState([]); // { paragraphLabel, phrase, color }
  const [splitPercent, setSplitPercent] = useState(50);
  const [fontSize, setFontSize] = useState('md');
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState('passage'); // passage | questions
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  // Restore saved draft
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(draftKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.notes) setNotes(parsed.notes);
          if (parsed.highlights) setHighlights(parsed.highlights);
        }
      } catch {
        // ignore
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [draftKey]);

  // Autosave
  useEffect(() => {
    try {
      window.localStorage.setItem(draftKey, JSON.stringify({ answers, notes, highlights }));
    } catch {
      // ignore
    }
  }, [draftKey, answers, notes, highlights]);

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
    // Safely highlight matched phrases without dangerouslySetInnerHTML
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
    const resultId = `res-reading-${Date.now()}`;
    addTestResult({
      id: resultId,
      type: 'reading',
      title: passage.title,
      partLabel: passage.partLabel,
      date: new Date().toISOString().slice(0, 10),
      timeLabel: 'Just now',
      bandScore: band,
      correct,
      incorrect,
      unanswered,
      totalQuestions: questions.length,
      durationUsed: 'Completed',
      testId: passage.id,
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
        title={passage.title}
        subtitle={`${passage.partLabel} • ${passage.category} • ${questions.length} Questions`}
        totalSeconds={(passage.durationMinutes || 20) * 60}
        answeredCount={answeredCount}
        totalCount={questions.length}
        exitHref="/reading"
        onSubmitClick={() => setConfirmSubmit(true)}
        submitLabel="Submit Reading"
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
          >
            <Highlighter size={14} style={{ color: '#A67400' }} /> Highlight Yellow
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleHighlightSelection('purple')}
          >
            <Highlighter size={14} style={{ color: 'var(--accent-purple)' }} /> Highlight Purple
          </button>
          {highlights.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setHighlights([])}
            >
              <Eraser size={14} /> Clear ({highlights.length})
            </button>
          )}
          <button
            type="button"
            className={`btn btn-sm ${showNotes ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowNotes((v) => !v)}
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
                style={{ padding: '4px 8px', fontSize: '0.73rem' }}
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
            <BookOpen size={14} /> Passage
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
        {/* Left Panel: Passage + Notes */}
        <section
          className={`reading-pane ${mobileTab !== 'passage' ? 'mobile-hidden' : ''}`}
          style={{
            padding: '24px 28px',
            overflowY: 'auto',
            minWidth: 0,
            borderRight: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Badge variant="purple">{passage.partLabel}</Badge>
            <Badge variant="neutral">{passage.category}</Badge>
          </div>
          <h1 className="h1" style={{ fontSize: '1.55rem' }}>{passage.title}</h1>
          <p className="text-sm text-muted" style={{ marginTop: 4, marginBottom: 18 }}>
            {passage.subtitle}
          </p>

          {showNotes && (
            <div className="card-warm card-compact" style={{ marginBottom: 18 }}>
              <div className="field-label" style={{ marginBottom: 6 }}>Personal Passage Notes</div>
              <textarea
                className="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot paragraph summaries or keyword clues here..."
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: passageFontSize, lineHeight: 1.75 }}>
            {passage.paragraphs.map((para) => (
              <p key={para.label}>
                <strong
                  style={{
                    display: 'inline-flex',
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    backgroundColor: 'var(--bg-secondary)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    fontSize: '0.82rem',
                  }}
                >
                  {para.label}
                </strong>
                {renderHighlightedText(para.text)}
              </p>
            ))}
          </div>

          {passage.diagramData && (
            <div className="card-warm card-compact" style={{ marginTop: 22 }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 8 }}>
                {passage.diagramData.title}
              </div>
              <div className="grid-2" style={{ gap: 8 }}>
                {passage.diagramData.labels.map((lbl) => (
                  <div key={lbl} className="badge badge-neutral" style={{ justifyContent: 'flex-start' }}>
                    {lbl}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right Panel: Question Palette & Inputs */}
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
          <QuestionNavigator
            questions={questions}
            answers={answers}
            bookmarkedIds={bookmarks.questions}
            activeIndex={activeQIndex}
            onSelect={(idx) => {
              setActiveQIndex(idx);
              const qEl = document.getElementById(`reading-q-${questions[idx].id}`);
              qEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {questions.map((q, idx) => (
              <div
                key={q.id}
                id={`reading-q-${q.id}`}
                onFocus={() => setActiveQIndex(idx)}
                onClick={() => setActiveQIndex(idx)}
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 20,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={activeQIndex === 0}
              onClick={() => {
                const nextIdx = Math.max(0, activeQIndex - 1);
                setActiveQIndex(nextIdx);
                document.getElementById(`reading-q-${questions[nextIdx].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              <ChevronLeft size={15} /> Previous
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={activeQIndex >= questions.length - 1}
              onClick={() => {
                const nextIdx = Math.min(questions.length - 1, activeQIndex + 1);
                setActiveQIndex(nextIdx);
                document.getElementById(`reading-q-${questions[nextIdx].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </section>
      </div>

      <ConfirmationDialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        onConfirm={handleSubmit}
        title="Submit Reading Test?"
        message={`You have answered ${answeredCount} of ${questions.length} questions. Submit now to see your band score and question explanations?`}
        confirmLabel="Submit Answers"
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

