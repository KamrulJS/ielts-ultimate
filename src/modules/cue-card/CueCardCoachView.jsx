'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shuffle,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import { RecordingControls } from '@/components/examination/RecordingControls';
import cueCards from '@/data/speaking/cue-cards.json';

export function CueCardCoachView() {
  const rootRef = useGsapEntrance('cue-card-coach');
  const [catFilter, setCatFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [activeCard, setActiveCard] = useState(cueCards[0]);
  const [prepRunning, setPrepRunning] = useState(false);
  const [prepLeft, setPrepLeft] = useState(60);
  const [notes, setNotes] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [history, setHistory] = useState([
    { id: 'cc-01', topic: cueCards[0].topic, date: '2026-11-08', durationSec: 112 },
  ]);

  useEffect(() => {
    if (!prepRunning) return undefined;
    const timer = setInterval(() => {
      setPrepLeft((s) => {
        if (s <= 1) {
          setPrepRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [prepRunning]);

  const categories = useMemo(
    () => ['All', 'Recent', ...Array.from(new Set(cueCards.map((c) => c.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cueCards
      .filter((c) =>
        catFilter === 'All'
          ? true
          : catFilter === 'Recent'
          ? c.isRecent
          : c.category === catFilter
      )
      .filter((c) => (!q ? true : c.topic.toLowerCase().includes(q)));
  }, [catFilter, search]);

  const pickRandomCard = () => {
    const pick = cueCards[Math.floor(Math.random() * cueCards.length)];
    setActiveCard(pick);
    setPrepRunning(false);
    setPrepLeft(60);
    setShowSample(false);
  };

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="Speaking Part 2 Cue Card Coach"
        description="Randomised cue card generator, 60-second prep timer, live audio recording, vocabulary prompts, and Band 8.0 sample responses."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Cue Card Coach' }]}
        actions={
          <button type="button" className="btn btn-accent" onClick={pickRandomCard}>
            <Shuffle size={16} /> Random Cue Card
          </button>
        }
      />

      {/* Active Cue Card Studio */}
      <div className="grid-2" style={{ alignItems: 'start', gap: 18 }}>
        <div data-animate="card" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge variant="purple">{activeCard.category}</Badge>
              {activeCard.isRecent && <Badge variant="yellow">Recent Topic</Badge>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge variant="dark"><Clock size={12} /> Prep: {prepLeft}s</Badge>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setPrepLeft(60);
                  setPrepRunning((r) => !r);
                }}
              >
                {prepRunning ? 'Pause Prep' : 'Start 1m Prep'}
              </button>
            </div>
          </div>

          <h2 className="h2">{activeCard.topic}</h2>
          <div className="card-warm card-compact">
            <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 6 }}>YOU SHOULD SAY:</div>
            <ul style={{ paddingLeft: 18, fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {activeCard.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 6 }}>BAND 7.5+ VOCABULARY SUGGESTIONS</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {activeCard.vocabularySuggestions.map((v) => (
                <Badge key={v} variant="purple"><Sparkles size={11} /> {v}</Badge>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="coach-notes">1-Minute Keyword Scratchpad</label>
            <textarea
              id="coach-notes"
              className="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write 4-6 keyword cues while the 60-second prep timer runs..."
            />
          </div>
        </div>

        {/* Right: Recording + Sample Answer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <RecordingControls
            maxSeconds={120}
            onRecordingComplete={(rec) =>
              setHistory((prev) => [
                { id: activeCard.id, topic: activeCard.topic, date: 'Today', durationSec: rec.durationSec },
                ...prev,
              ])
            }
          />

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 className="h3">Sample Band 8.0 Answer</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowSample((s) => !s)}
              >
                {showSample ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showSample ? 'Hide Sample' : 'Reveal Sample'}</span>
              </button>
            </div>
            {showSample ? (
              <p className="text-sm" style={{ lineHeight: 1.7 }}>{activeCard.sampleAnswer}</p>
            ) : (
              <p className="text-xs text-muted">
                Record your own 2-minute answer first before revealing the model response to maximise natural fluency.
              </p>
            )}
          </div>

          <div className="card card-compact">
            <h3 className="h3" style={{ fontSize: '0.94rem', marginBottom: 8 }}>Recent Cue Card Practice</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {history.slice(0, 4).map((h, i) => (
                <div
                  key={`${h.id}-${i}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: 8,
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.81rem',
                  }}
                >
                  <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    {h.topic}
                  </span>
                  <Badge variant="success"><CheckCircle2 size={11} /> {h.durationSec}s</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cue Card Library */}
      <section>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div className="filter-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCatFilter(cat)}
                className={`filter-pill ${catFilter === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Search cue cards..." style={{ width: 220 }} />
        </div>

        <div className="grid-3">
          {filtered.map((card) => {
            const isSelected = activeCard.id === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setActiveCard(card);
                  setPrepRunning(false);
                  setPrepLeft(60);
                  setShowSample(false);
                }}
                className="card card-interactive"
                style={{
                  textAlign: 'left',
                  borderColor: isSelected ? 'var(--dark-section)' : 'var(--border)',
                  backgroundColor: isSelected ? 'var(--accent-yellow-soft)' : 'var(--surface)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Badge variant="purple">{card.category}</Badge>
                  {card.isRecent && <Badge variant="yellow">Recent</Badge>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{card.topic}</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

