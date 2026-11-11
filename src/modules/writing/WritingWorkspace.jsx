'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { countWords } from '@/lib/utils';
import { ExamTopBar } from '@/components/examination/ExamTopBar';
import { WritingVisualPrompt } from '@/components/examination/WritingVisualPrompt';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { Badge } from '@/components/common/UiPrimitives';

import writingTasks from '@/data/writing/tasks.json';

export function WritingWorkspace({ taskId }) {
  const router = useRouter();
  const { addWritingSubmission, addTestResult } = useApp();

  const [task, setTask] = useState(() => writingTasks.find((t) => t.id === taskId) || writingTasks[0]);
  const draftKey = `ieltswist_writing_draft_${taskId}`;

  const [text, setText] = useState('');
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (taskId === 'custom') {
        try {
          const raw = window.localStorage.getItem('ieltswist_custom_writing_prompt');
          if (raw) setTask(JSON.parse(raw));
        } catch {
          // ignore
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [taskId]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(draftKey);
        if (saved) setText(saved);
      } catch {
        // ignore
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [draftKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(draftKey, text);
    } catch {
      // ignore
    }
  }, [draftKey, text]);

  const wordCount = countWords(text);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const meetsMinimum = wordCount >= (task.minWords || 150);

  const handleConfirmEvaluate = () => {
    setEvaluating(true);
    setTimeout(() => {
      const computedBand = wordCount >= (task.minWords || 150) ? 7.0 : wordCount >= 90 ? 6.0 : 5.0;
      const subId = `sub-wr-${Date.now()}`;

      addWritingSubmission({
        id: subId,
        taskId: task.id,
        title: task.title,
        taskNumber: task.taskNumber,
        submittedAt: new Date().toISOString().slice(0, 10),
        wordCount,
        bandScore: computedBand,
        content: text,
      });

      addTestResult({
        id: subId,
        type: 'writing',
        title: `Task ${task.taskNumber}: ${task.title}`,
        partLabel: `Task ${task.taskNumber} (${task.category})`,
        date: new Date().toISOString().slice(0, 10),
        timeLabel: 'Just now',
        bandScore: computedBand,
        wordCount,
        durationUsed: 'Completed',
        testId: task.id,
        essayExcerpt: text,
        criteria: [
          { name: 'Task Achievement / Response', band: computedBand, comment: 'Demo rubric feedback: addresses key features of the prompt.' },
          { name: 'Coherence & Cohesion', band: computedBand, comment: 'Clear paragraph separation and progression.' },
          { name: 'Lexical Resource', band: Math.max(5.5, computedBand - 0.5), comment: 'Consider incorporating additional academic collocations.' },
          { name: 'Grammatical Range & Accuracy', band: Math.max(5.5, computedBand - 0.5), comment: 'Mix complex subordinate clauses carefully.' },
        ],
      });

      try {
        window.localStorage.removeItem(draftKey);
      } catch {
        // ignore
      }

      router.push(`/writing/result/${subId}`);
    }, 1100);
  };

  if (evaluating) {
    return (
      <div
        className="exam-shell"
        style={{ alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}
      >
        <div className="card" style={{ maxWidth: 440, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '999px',
              backgroundColor: 'var(--accent-purple-soft)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={24} />
          </div>
          <h2 className="h2">Generating Demo Rubric Feedback...</h2>
          <p className="text-sm text-muted">
            Evaluating word count ({wordCount} words), paragraph cohesion, and local IELTS evaluation templates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-shell">
      <ExamTopBar
        title={`Task ${task.taskNumber}: ${task.title}`}
        subtitle={`${task.category} • Recommended minimum ${task.minWords} words`}
        totalSeconds={(task.recommendedMinutes || 40) * 60}
        exitHref="/writing"
        onSubmitClick={() => setConfirmSubmit(true)}
        submitLabel="Submit for Demo Review"
      />

      <main
        className="grid-2"
        style={{
          flex: 1,
          maxWidth: 1380,
          width: '100%',
          margin: '0 auto',
          padding: 20,
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Left: Task Instructions & Chart/Diagram */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge variant={task.taskNumber === 1 ? 'yellow' : 'purple'}>Task {task.taskNumber}</Badge>
            <Badge variant="neutral">{task.category}</Badge>
            <Badge variant="neutral">Min {task.minWords} words</Badge>
          </div>

          <h1 className="h2">{task.title}</h1>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.65 }}>{task.prompt}</p>

          <WritingVisualPrompt task={task} />

          {task.keyTips && (
            <div className="card-warm card-compact">
              <div className="text-xs" style={{ fontWeight: 700, marginBottom: 6 }}>WRITING STRATEGY CHECKLIST</div>
              <ul style={{ paddingLeft: 18, fontSize: '0.83rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {task.keyTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Right: Distraction-free Essay Workspace */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              paddingBottom: 10,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge variant={meetsMinimum ? 'success' : 'yellow'}>
                {meetsMinimum ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {wordCount} / {task.minWords}+ words
              </Badge>
              <span className="text-xs text-muted">{paragraphs} paragraphs</span>
            </div>
            <span className="text-xs text-muted">Draft saved locally as you type</span>
          </div>

          <textarea
            className="textarea"
            rows={18}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              task.taskNumber === 1
                ? 'Start with a clear paraphrase of the visual and a high-level overview paragraph...'
                : 'Begin with a clear introduction paraphrasing the issue and stating your thesis...'
            }
            style={{
              minHeight: 420,
              fontSize: '0.96rem',
              lineHeight: 1.75,
              padding: 16,
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span className="text-xs text-muted">
              Note: Evaluation uses local JSON demo templates (no live AI API connected).
            </span>
            <button
              type="button"
              className="btn btn-primary"
              disabled={wordCount < 15}
              onClick={() => setConfirmSubmit(true)}
            >
              Submit Response →
            </button>
          </div>
        </section>
      </main>

      <ConfirmationDialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        onConfirm={handleConfirmEvaluate}
        title="Submit Writing Response?"
        message={`Current word count: ${wordCount} words (recommended ${task.minWords}+). Submit to inspect demo rubric feedback and vocabulary upgrades?`}
        confirmLabel="Generate Demo Feedback"
      />
    </div>
  );
}

