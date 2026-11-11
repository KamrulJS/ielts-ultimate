'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Radio } from 'lucide-react';
import { formatDurationSeconds } from '@/lib/utils';
import { Badge } from '@/components/common/UiPrimitives';

function AudioPlayerInner({
  partTitle,
  context,
  durationSec = 180,
  transcript = [],
  onCompletePart,
}) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [rate, setRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev + rate >= durationSec) {
          setPlaying(false);
          onCompletePart?.();
          return durationSec;
        }
        return prev + rate;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [playing, rate, durationSec, onCompletePart]);

  const togglePlayback = () => {
    const next = !playing;
    setPlaying(next);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (next && transcript.length > 0) {
        const utterance = new SpeechSynthesisUtterance(transcript.join(' '));
        utterance.rate = rate;
        utterance.lang = 'en-GB';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleRestart = () => {
    setElapsed(0);
    setPlaying(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const progressPct = Math.min(100, Math.round((elapsed / Math.max(1, durationSec)) * 100));

  return (
    <div className="card-dark" style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(246, 189, 40, 0.16)',
              color: 'var(--accent-yellow)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Volume2 size={18} />
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#FFFFFF' }}>{partTitle}</div>
            <div className="text-xs" style={{ color: '#B7B5AD' }}>{context}</div>
          </div>
        </div>
        <Badge variant="yellow">
          <Radio size={12} /> Demo Web Speech Audio
        </Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={togglePlayback}
          className="btn btn-accent btn-sm"
          style={{ minWidth: 96 }}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>

        <button
          type="button"
          onClick={handleRestart}
          className="btn btn-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          title="Restart section audio"
        >
          <RotateCcw size={14} />
        </button>

        <div style={{ flex: 1, minWidth: 160 }}>
          <input
            type="range"
            min={0}
            max={durationSec}
            value={elapsed}
            onChange={(e) => setElapsed(Number(e.target.value))}
            aria-label="Audio progress"
            style={{ width: '100%', accentColor: '#F6BD28', cursor: 'pointer' }}
          />
          <div
            className="text-xs"
            style={{ display: 'flex', justifyContent: 'space-between', color: '#B7B5AD', marginTop: 2 }}
          >
            <span>{formatDurationSeconds(elapsed)}</span>
            <span>{progressPct}% • {formatDurationSeconds(durationSec)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {[0.75, 1, 1.25].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => setRate(speed)}
              className="btn btn-sm"
              style={{
                padding: '5px 9px',
                backgroundColor: rate === speed ? 'var(--accent-purple)' : 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                fontSize: '0.74rem',
              }}
            >
              {speed}x
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowTranscript((v) => !v)}
          className="btn btn-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF' }}
        >
          {showTranscript ? 'Hide Script' : 'Demo Script'}
        </button>
      </div>

      {showTranscript && transcript.length > 0 && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--dark-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontSize: '0.83rem',
            color: '#ECE9DF',
          }}
        >
          {transcript.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export function AudioPlayer(props) {
  return <AudioPlayerInner key={props.partTitle} {...props} />;
}
