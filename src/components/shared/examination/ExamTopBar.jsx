'use client';
import styles from './ExamTopBar.module.css';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Maximize2, Minimize2, CheckCircle2, Save } from 'lucide-react';
import { formatDurationSeconds } from '@/lib/utils';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

function ExamTopBarInner({
  title,
  subtitle,
  totalSeconds,
  onTimeUp,
  answeredCount,
  totalCount,
  autosaveLabel,
  exitHref,
  onSubmitClick,
  submitLabel,
}) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp?.();
      return undefined;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const lowTime = secondsLeft < 300;

  return (
    <>
      <header
        className={styles.exam_header_1}
      >
        <div className={styles.exam_div_2}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setConfirmExit(true)}
          >
            <ArrowLeft size={15} /> Exit
          </button>
          <div className={styles.exam_div_3}>
            <div
              className={styles.exam_div_4}
            >
              {title}
            </div>
            {subtitle && (
              <div className={`text-xs text-muted ${styles.exam_div_5}`} >
                {subtitle}
              </div>
            )}
          </div>
        </div>

        <div className={styles.exam_div_6}>
          <span className={`text-xs text-muted ${styles.exam_span_7}`} >
            <Save size={13} className={styles.exam_save_8} /> {autosaveLabel}
          </span>

          {totalCount > 0 && (
            <span className="badge badge-neutral">
              {answeredCount} / {totalCount} answered
            </span>
          )}

          <div
            className={`badge ${lowTime ? 'badge-error' : 'badge-yellow'} ${styles.exam_div_9}`}
            
          >
            <Clock size={14} />
            <span>{formatDurationSeconds(secondsLeft)}</span>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {onSubmitClick && (
            <button type="button" className="btn btn-primary btn-sm" onClick={onSubmitClick}>
              <CheckCircle2 size={15} /> {submitLabel}
            </button>
          )}
        </div>
      </header>

      <ConfirmationDialog
        open={confirmExit}
        onClose={() => setConfirmExit(false)}
        onConfirm={() => router.push(exitHref)}
        title="Leave Examination Mode?"
        message="Your current answers are saved locally in this browser. You can resume later or exit back to the module library."
        confirmLabel="Exit Exam"
      />
    </>
  );
}

export function ExamTopBar(props) {
  return (
    <ExamTopBarInner
      key={props.totalSeconds || 3600}
      totalSeconds={3600}
      answeredCount={0}
      totalCount={0}
      autosaveLabel="Autosaved"
      exitHref="/dashboard"
      submitLabel="Submit Test"
      {...props}
    />
  );
}
