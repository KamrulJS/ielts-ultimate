'use client';
import styles from './AudioPlayer.module.css';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Radio } from 'lucide-react';
import { formatDurationSeconds } from '@/lib/utils';
import { Badge } from '@/components/common/UiPrimitives';

function AudioPlayerInner({
  partTitle,
  context,
  durationSec = 180,
  transcript = [],
  onCompletePart,
  audioUrl,
}) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [rate, setRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef(null);
  const [audioSourceType, setAudioSourceType] = useState('synth'); // 'file' | 'synth'

  // Initialize or clean up audio
  useEffect(() => {
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audio.addEventListener('canplaythrough', () => setAudioSourceType('file'));
        audio.addEventListener('error', () => setAudioSourceType('synth'));
        audio.addEventListener('timeupdate', () => {
          setElapsed(Math.round(audio.currentTime));
        });
        audio.addEventListener('ended', () => {
          setPlaying(false);
          onCompletePart?.();
        });
        audioRef.current = audio;
      } catch {
        // Fallback default is already synth
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioUrl, onCompletePart]);

  // Timer loop for synthesized playback
  useEffect(() => {
    if (!playing || audioSourceType === 'file') return undefined;
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
  }, [playing, rate, durationSec, onCompletePart, audioSourceType]);

  const togglePlayback = () => {
    const next = !playing;
    setPlaying(next);

    if (audioSourceType === 'file' && audioRef.current) {
      if (next) {
        audioRef.current.playbackRate = rate;
        audioRef.current.play().catch(() => {
          // If playback blocked or file missing, fallback to synth
          setAudioSourceType('synth');
        });
      } else {
        audioRef.current.pause();
      }
      return;
    }

    // Web Speech synthesis fallback with British RP
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
    if (audioSourceType === 'file' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleRateChange = (speed) => {
    setRate(speed);
    if (audioSourceType === 'file' && audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const progressPct = Math.min(100, Math.round((elapsed / Math.max(1, durationSec)) * 100));

  return (
    <div className={`card-dark ${styles.audi_div_1}`} >
      <div
        className={styles.audi_div_2}
      >
        <div className={styles.audi_div_3}>
          <span
            className={styles.audi_span_4}
          >
            <Volume2 size={18} />
          </span>
          <div>
            <div className={styles.audi_div_5}>{partTitle}</div>
            <div className={`text-xs ${styles.audi_div_6}`} >{context}</div>
          </div>
        </div>
        <Badge variant="yellow">
          <Radio size={12} /> {audioSourceType === 'file' ? 'Direct Audio Stream' : 'British Speech Audio'}
        </Badge>
      </div>

      <div className={styles.audi_div_7}>
        <button
          type="button"
          onClick={togglePlayback}
          className={`btn btn-accent btn-sm ${styles.audi_button_8}`}
          
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>

        <button
          type="button"
          onClick={handleRestart}
          className={`btn btn-sm ${styles.audi_button_9}`}
          
          title="Restart section audio"
        >
          <RotateCcw size={14} />
        </button>

        <div className={styles.audi_div_10}>
          <input
            type="range"
            min={0}
            max={durationSec}
            value={elapsed}
            onChange={(e) => {
              const val = Number(e.target.value);
              setElapsed(val);
              if (audioSourceType === 'file' && audioRef.current) {
                audioRef.current.currentTime = val;
              }
            }}
            aria-label="Audio progress"
            className={styles.audi_input_11}
          />
          <div
            className={`text-xs ${styles.audi_div_12}`}
            
          >
            <span>{formatDurationSeconds(elapsed)}</span>
            <span>{progressPct}% • {formatDurationSeconds(durationSec)}</span>
          </div>
        </div>

        <div className={styles.audi_div_13}>
          {[0.75, 1, 1.25].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => handleRateChange(speed)}
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
          className={`btn btn-sm ${styles.audi_button_14}`}
          
        >
          {showTranscript ? 'Hide Script' : 'Section Script'}
        </button>
      </div>

      {showTranscript && transcript.length > 0 && (
        <div
          className={styles.audi_div_15}
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
