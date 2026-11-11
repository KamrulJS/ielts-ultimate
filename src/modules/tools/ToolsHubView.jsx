'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  FileText,
  Sparkles,
  CheckCheck,
  Keyboard,
  Search,
  ClipboardCheck,
  Gauge,
  Headphones,
  Timer,
  Copy,
  Play,
  Square,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { rawScoreToBand, roundIeltsBand, countWords, formatDurationSeconds } from '@/lib/utils';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { AudioPlayer } from '@/components/examination/AudioPlayer';
import toolsData from '@/data/tools/tools-data.json';
import wordsData from '@/data/vocabulary/words.json';

const TOOLS_LIST = [
  { id: 'band-calculator', title: 'Band Score Calculator', icon: Calculator, badge: 'Live' },
  { id: 'templates', title: 'Writing Templates', icon: FileText, badge: 'Library' },
  { id: 'paraphraser', title: 'Paraphraser', icon: Sparkles, badge: 'Demo' },
  { id: 'grammar-checker', title: 'Grammar Checker', icon: CheckCheck, badge: 'Demo' },
  { id: 'typing-practice', title: 'Typing Practice', icon: Keyboard, badge: 'Live' },
  { id: 'word-finder', title: 'Academic Word Finder', icon: Search, badge: 'Live' },
  { id: 'essay-checker', title: 'Essay Checker', icon: ClipboardCheck, badge: 'Demo' },
  { id: 'reading-speed', title: 'Reading Speed Tracker', icon: Gauge, badge: 'Live' },
  { id: 'listening-player', title: 'Listening Practice Player', icon: Headphones, badge: 'Demo Audio' },
  { id: 'study-timer', title: 'Study Time Tracker', icon: Timer, badge: 'Live' },
];

export function ToolsHubView({ initialTool = 'band-calculator' }) {
  const { showToast } = useApp();
  const [activeTool, setActiveTool] = useState(
    TOOLS_LIST.some((t) => t.id === initialTool) ? initialTool : 'band-calculator'
  );

  // 1. Band Score Calculator
  const [rawR, setRawR] = useState(31);
  const [rawL, setRawL] = useState(30);
  const [bandW, setBandW] = useState(6.5);
  const [bandS, setBandS] = useState(6.5);
  const calcR = rawScoreToBand(rawR, 40);
  const calcL = rawScoreToBand(rawL, 40);
  const overallCalc = roundIeltsBand((calcR + calcL + Number(bandW) + Number(bandS)) / 4);

  // 3. Paraphraser Demo
  const [paraInput, setParaInput] = useState(toolsData.paraphraseExamples[0].input);
  const [paraOutput, setParaOutput] = useState('');

  // 4. Grammar Checker Demo
  const [grammarText, setGrammarText] = useState(
    'Although public transport is cheap, but many people prefer cars. The number of commuters have increased a lot.'
  );
  const [grammarFindings, setGrammarFindings] = useState([]);

  // 5. Typing Practice
  const typingTarget = toolsData.typingPassages[0].text;
  const [typingInput, setTypingInput] = useState('');
  const [typingStart, setTypingStart] = useState(null);
  const [typingWpm, setTypingWpm] = useState(0);

  // 6. Academic Word Finder
  const [wordQuery, setWordQuery] = useState('');
  const foundWords = useMemo(() => {
    const q = wordQuery.trim().toLowerCase();
    return wordsData.filter(
      (w) => !q || w.word.toLowerCase().includes(q) || w.definition.toLowerCase().includes(q) || w.category.toLowerCase().includes(q)
    );
  }, [wordQuery]);

  // 7. Essay Checker
  const [essayInput, setEssayInput] = useState('');
  const [essayReport, setEssayReport] = useState(null);

  // 8. Reading Speed Tracker
  const speedPassage = toolsData.readingSpeedPassages[0];
  const [speedRunning, setSpeedRunning] = useState(false);
  const [speedSec, setSpeedSec] = useState(0);
  const [speedWpm, setSpeedWpm] = useState(null);
  const [speedQuizAns, setSpeedQuizAns] = useState('');

  useEffect(() => {
    if (!speedRunning) return undefined;
    const t = setInterval(() => setSpeedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [speedRunning]);

  // 10. Study Time Tracker
  const [studyRunning, setStudyRunning] = useState(false);
  const [studySec, setStudySec] = useState(0);
  const [studyLabel, setStudyLabel] = useState('Academic Writing Task 2');
  const [studyLogs, setStudyLogs] = useState([
    { id: 1, label: 'Reading Set 02 Timed', minutes: 45, date: 'Today' },
    { id: 2, label: 'Vocabulary Flashcards', minutes: 20, date: 'Yesterday' },
  ]);

  useEffect(() => {
    if (!studyRunning) return undefined;
    const t = setInterval(() => setStudySec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [studyRunning]);

  const handleCopy = (val) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(val).catch(() => {});
    }
    showToast('Copied to clipboard', 'success');
  };

  const runDemoParaphrase = () => {
    const match = toolsData.paraphraseExamples.find(
      (e) => e.input.toLowerCase() === paraInput.trim().toLowerCase()
    );
    if (match) {
      setParaOutput(`${match.academic}\n\nNotes: ${match.notes}`);
      return;
    }
    // Clean deterministic lexical demo transform
    const upgraded = paraInput
      .replace(/\bmany people think\b/gi, 'a widely held view suggests')
      .replace(/\bvery important\b/gi, 'paramount')
      .replace(/\bbig problem\b/gi, 'acute challenge')
      .replace(/\ba lot\b/gi, 'substantially')
      .replace(/\bgood\b/gi, 'beneficial');
    setParaOutput(
      `${upgraded}\n\n[Demo Note: Rule-based academic register preview. Connect an NLP API in production for full sentence restructuring.]`
    );
  };

  const runDemoGrammar = () => {
    const issues = [];
    if (/although.+,\s*but/i.test(grammarText)) {
      issues.push('Avoid pairing "Although" and "but" in the same sentence.');
    }
    if (/the number of .+ have\b/i.test(grammarText)) {
      issues.push('"The number of + plural noun" requires singular verb "has".');
    }
    if (/\ba lot\b/i.test(grammarText)) {
      issues.push('Replace informal "a lot" with "substantially" or "markedly".');
    }
    if (issues.length === 0) {
      issues.push('No common IELTS template traps detected in this sample check.');
    }
    setGrammarFindings(issues);
  };

  const handleTypingChange = (val) => {
    if (!typingStart && val.length > 0) setTypingStart(Date.now());
    setTypingInput(val);
    if (typingStart) {
      const mins = Math.max(0.05, (Date.now() - typingStart) / 60000);
      setTypingWpm(Math.round(countWords(val) / mins));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="More IELTS Learning Tools"
        description="Ten focused utilities for score calculation, typing fluency, reading WPM, writing structure, and study time logging."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'More Tools' }]}
      />

      {/* 10-Tool Grid Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: 10 }}>
        {TOOLS_LIST.map((tool) => {
          const Icon = tool.icon;
          const active = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool.id)}
              className="card card-compact"
              style={{
                textAlign: 'left',
                borderColor: active ? 'var(--dark-section)' : 'var(--border)',
                backgroundColor: active ? 'var(--dark-section)' : 'var(--surface)',
                color: active ? '#FFFFFF' : 'var(--text-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Icon size={17} style={{ color: active ? 'var(--accent-yellow)' : 'var(--accent-purple)' }} />
                <Badge variant={tool.badge === 'Live' ? 'success' : 'yellow'}>{tool.badge}</Badge>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{tool.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Tool Workspace */}
      <div className="card">
        {activeTool === 'band-calculator' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="section-header">
              <div>
                <h2 className="h2">Official IELTS Band Score Calculator</h2>
                <p className="text-xs text-muted">Converts raw Reading & Listening scores out of 40 and computes nearest 0.5 average</p>
              </div>
              <Badge variant="dark">Overall: Band {overallCalc.toFixed(1)}</Badge>
            </div>
            <div className="grid-2">
              <div className="field-group">
                <label className="field-label">Reading Correct ({rawR} / 40 → Band {calcR})</label>
                <input type="range" min={0} max={40} value={rawR} onChange={(e) => setRawR(Number(e.target.value))} />
              </div>
              <div className="field-group">
                <label className="field-label">Listening Correct ({rawL} / 40 → Band {calcL})</label>
                <input type="range" min={0} max={40} value={rawL} onChange={(e) => setRawL(Number(e.target.value))} />
              </div>
              <div className="field-group">
                <label className="field-label">Writing Band</label>
                <select className="select" value={bandW} onChange={(e) => setBandW(Number(e.target.value))}>
                  {[4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Speaking Band</label>
                <select className="select" value={bandS} onChange={(e) => setBandS(Number(e.target.value))}>
                  {[4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'templates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="h2">IELTS Writing Blueprint Templates</h2>
            {toolsData.writingTemplates.map((tpl) => (
              <div key={tpl.id} className="card-warm card-compact">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{tpl.title}</div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleCopy(tpl.sections.join('\n'))}
                  >
                    <Copy size={13} /> Copy Outline
                  </button>
                </div>
                <ul style={{ paddingLeft: 18, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {tpl.sections.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTool === 'paraphraser' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="section-header">
              <h2 className="h2">Academic Paraphraser (Demo)</h2>
              <Badge variant="yellow">Frontend Demo</Badge>
            </div>
            <textarea className="textarea" rows={3} value={paraInput} onChange={(e) => setParaInput(e.target.value)} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary" onClick={runDemoParaphrase}>Upgrade Register →</button>
              {toolsData.paraphraseExamples.map((ex, i) => (
                <button key={i} type="button" className="btn btn-secondary btn-sm" onClick={() => setParaInput(ex.input)}>
                  Sample {i + 1}
                </button>
              ))}
            </div>
            {paraOutput && (
              <div className="card-warm card-compact">
                <p className="text-sm" style={{ whiteSpace: 'pre-line' }}>{paraOutput}</p>
                <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={() => handleCopy(paraOutput)}>
                  <Copy size={13} /> Copy Output
                </button>
              </div>
            )}
          </div>
        )}

        {activeTool === 'grammar-checker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="section-header">
              <h2 className="h2">IELTS Grammar Trap Scanner (Demo)</h2>
              <Badge variant="yellow">Rule-Based Demo</Badge>
            </div>
            <textarea className="textarea" rows={4} value={grammarText} onChange={(e) => setGrammarText(e.target.value)} />
            <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={runDemoGrammar}>
              Scan Sentence Traps
            </button>
            {grammarFindings.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {grammarFindings.map((f, i) => (
                  <div key={i} className="badge badge-yellow" style={{ justifyContent: 'flex-start', padding: '8px 12px' }}>
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTool === 'typing-practice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="section-header">
              <h2 className="h2">Computer-Delivered IELTS Typing Drill</h2>
              <Badge variant="dark">{typingWpm} WPM</Badge>
            </div>
            <div className="card-warm card-compact text-sm" style={{ lineHeight: 1.65 }}>{typingTarget}</div>
            <textarea
              className="textarea"
              rows={4}
              value={typingInput}
              onChange={(e) => handleTypingChange(e.target.value)}
              placeholder="Start typing the academic paragraph above to measure WPM..."
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => {
                setTypingInput('');
                setTypingStart(null);
                setTypingWpm(0);
              }}
            >
              <RotateCcw size={14} /> Reset Drill
            </button>
          </div>
        )}

        {activeTool === 'word-finder' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="h2">Academic Word Finder (36+ Curated Terms)</h2>
            <input
              className="input"
              value={wordQuery}
              onChange={(e) => setWordQuery(e.target.value)}
              placeholder="Filter by keyword, topic, or definition (e.g. urban, mitigate, cognitive)..."
            />
            <div className="grid-3">
              {foundWords.slice(0, 9).map((w) => (
                <div key={w.id} className="card-warm card-compact">
                  <div style={{ fontWeight: 700 }}>{w.word} <span className="text-xs text-muted">({w.pos})</span></div>
                  <p className="text-xs text-muted" style={{ marginTop: 4 }}>{w.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTool === 'essay-checker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="section-header">
              <h2 className="h2">Essay Structure & Length Checker (Demo)</h2>
              <Badge variant="yellow">Local Analysis Demo</Badge>
            </div>
            <textarea
              className="textarea"
              rows={6}
              value={essayInput}
              onChange={(e) => setEssayInput(e.target.value)}
              placeholder="Paste your Task 2 essay to check word target, paragraph count, and linking coverage..."
            />
            <button
              type="button"
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => {
                const wc = countWords(essayInput);
                const paras = essayInput.split(/\n\s*\n/).filter((x) => x.trim()).length;
                setEssayReport({
                  words: wc,
                  paragraphs: paras,
                  status: wc >= 250 && paras >= 4 ? 'Meets Task 2 length & 4-paragraph target' : 'Expand toward 250+ words across 4 clear paragraphs',
                });
              }}
            >
              Inspect Essay Metrics
            </button>
            {essayReport && (
              <div className="card-warm card-compact">
                <div><strong>Word Count:</strong> {essayReport.words} • <strong>Paragraphs:</strong> {essayReport.paragraphs}</div>
                <div className="text-xs text-muted" style={{ marginTop: 4 }}>{essayReport.status}</div>
              </div>
            )}
          </div>
        )}

        {activeTool === 'reading-speed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="section-header">
              <h2 className="h2">Reading Speed Tracker ({speedPassage.wordCount} words)</h2>
              <Badge variant="dark">{speedWpm ? `${speedWpm} WPM` : `${speedSec}s elapsed`}</Badge>
            </div>
            <p className="text-sm" style={{ lineHeight: 1.7 }}>{speedPassage.text}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {!speedRunning ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSpeedSec(0);
                    setSpeedWpm(null);
                    setSpeedRunning(true);
                  }}
                >
                  <Play size={14} /> Start Reading Timer
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-accent btn-sm"
                  onClick={() => {
                    setSpeedRunning(false);
                    setSpeedWpm(Math.round((speedPassage.wordCount / Math.max(1, speedSec)) * 60));
                  }}
                >
                  <Square size={14} /> Finish & Calculate WPM
                </button>
              )}
            </div>
            <div className="card-warm card-compact">
              <div style={{ fontWeight: 600, fontSize: '0.86rem', marginBottom: 8 }}>Comprehension Check: {speedPassage.question}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {speedPassage.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`filter-pill ${speedQuizAns === opt ? 'active' : ''}`}
                    onClick={() => setSpeedQuizAns(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {speedQuizAns && (
                <div className="text-xs" style={{ marginTop: 6, color: speedQuizAns === speedPassage.answer ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                  {speedQuizAns === speedPassage.answer ? 'Correct comprehension!' : 'Review the paragraph and try again.'}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTool === 'listening-player' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="h2">Listening Speed & Shadowing Player</h2>
            <AudioPlayer
              partTitle="Connected Speech Shadowing Drill"
              context="Adjust speed between 0.75x and 1.25x to practise shadowing British academic intonation."
              durationSec={90}
              transcript={[
                'Lecturer: Passive ventilation draws cool night air across structural thermal mass slabs.',
                'Student: Does this eliminate the need for backup chillers during heatwaves?',
              ]}
            />
          </div>
        )}

        {activeTool === 'study-timer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="section-header">
              <h2 className="h2">Focus Study Time Tracker</h2>
              <Badge variant="dark">{formatDurationSeconds(studySec)}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                className="input"
                style={{ maxWidth: 280 }}
                value={studyLabel}
                onChange={(e) => setStudyLabel(e.target.value)}
              />
              {!studyRunning ? (
                <button type="button" className="btn btn-primary" onClick={() => setStudyRunning(true)}>
                  <Play size={15} /> Start Session
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={() => {
                    setStudyRunning(false);
                    const mins = Math.max(1, Math.round(studySec / 60));
                    setStudyLogs((prev) => [{ id: Date.now(), label: studyLabel, minutes: mins, date: 'Just now' }, ...prev]);
                    setStudySec(0);
                    showToast(`Logged ${mins} study minutes`, 'success');
                  }}
                >
                  <Square size={15} /> Log & Stop
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {studyLogs.map((l) => (
                <div key={l.id} className="card-warm card-compact" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.86rem' }}>{l.label}</span>
                  <span className="text-xs text-muted">{l.minutes} min • {l.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

