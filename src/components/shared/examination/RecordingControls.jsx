'use client';
import styles from './RecordingControls.module.css';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, Square, Play, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDurationSeconds } from '@/lib/utils';
import { Badge } from '@/components/common/UiPrimitives';

export function RecordingControls({
  maxSeconds = 120,
  onRecordingComplete,
  compact = false,
}) {
  const [micStatus, setMicStatus] = useState('idle'); // idle | ready | fallback
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const secondsRef = useRef(0);

  const stopRecording = useCallback(() => {
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      onRecordingComplete?.({ url: null, durationSec: secondsRef.current, mode: 'demo-timer' });
    }
  }, [onRecordingComplete]);

  useEffect(() => {
    if (!recording) return undefined;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        secondsRef.current = next;
        if (next >= maxSeconds) {
          stopRecording();
          return maxSeconds;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [recording, maxSeconds, stopRecording]);

  const startRecording = async () => {
    setAudioUrl(null);
    setSeconds(0);
    secondsRef.current = 0;
    chunksRef.current = [];

    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          onRecordingComplete?.({ url, durationSec: secondsRef.current, mode: 'browser-mic' });
        };

        recorder.start();
        setMicStatus('ready');
        setRecording(true);
        return;
      } catch {
        setMicStatus('fallback');
      }
    } else {
      setMicStatus('fallback');
    }

    setRecording(true);
  };

  const reset = () => {
    setRecording(false);
    setAudioUrl(null);
    setSeconds(0);
    secondsRef.current = 0;
  };

  return (
    <div
      className="card"
      style={{
        padding: compact ? 14 : 18,
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div className={styles.reco_div_1}>
        <div className={styles.reco_div_2}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: '999px',
              backgroundColor: recording ? 'var(--error-soft)' : 'var(--accent-purple-soft)',
              color: recording ? 'var(--error)' : 'var(--accent-purple)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Mic size={16} />
          </span>
          <div>
            <div className={styles.reco_div_3}>
              {recording ? 'Recording in progress...' : audioUrl ? 'Recording ready for review' : 'Voice Response Recorder'}
            </div>
            <div className="text-xs text-muted">
              {formatDurationSeconds(seconds)} / {formatDurationSeconds(maxSeconds)}
            </div>
          </div>
        </div>

        {micStatus === 'fallback' && (
          <Badge variant="yellow">
            <AlertCircle size={12} /> Demo Timer Fallback (No Mic Permission)
          </Badge>
        )}
        {micStatus === 'ready' && (
          <Badge variant="success">
            <CheckCircle2 size={12} /> Browser Mic Connected
          </Badge>
        )}
      </div>

      <div className={styles.reco_div_4}>
        {!recording ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={startRecording}>
            <Mic size={15} /> {seconds > 0 ? 'Re-record Answer' : 'Start Recording'}
          </button>
        ) : (
          <button type="button" className="btn btn-danger btn-sm" onClick={stopRecording}>
            <Square size={14} /> Stop Recording
          </button>
        )}

        {(audioUrl || (seconds > 0 && !recording)) && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      {audioUrl && (
        <div className={styles.reco_div_5}>
          <audio controls src={audioUrl} className={styles.reco_audio_6} />
        </div>
      )}

      {!audioUrl && seconds > 0 && !recording && micStatus === 'fallback' && (
        <div className={`text-xs text-muted ${styles.reco_div_7}`} >
          <Play size={13} /> Simulated speaking session logged ({seconds}s). Real audio playback requires browser microphone permission.
        </div>
      )}
    </div>
  );
}
