'use client';

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
        style={{
          minHeight: 64,
          height: 'auto',
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '8px clamp(12px, 2vw, 20px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px 12px',
          position: 'sticky',
          top: 0,
          zIndex: 60,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: '1 1 200px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setConfirmExit(true)}
          >
            <ArrowLeft size={15} /> Exit
          </button>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.94rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div className="text-xs text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Save size={13} style={{ color: 'var(--success)' }} /> {autosaveLabel}
          </span>

          {totalCount > 0 && (
            <span className="badge badge-neutral">
              {answeredCount} / {totalCount} answered
            </span>
          )}

          <div
            className={`badge ${lowTime ? 'badge-error' : 'badge-yellow'}`}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', padding: '6px 12px' }}
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
