'use client';
import styles from './CueCardCoachView.module.css';

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
    <div ref={rootRef} className={styles.cuec_div_1}>
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
      <div className={`grid-2 ${styles.cuec_div_2}`} >
        <div data-animate="card" className={`card ${styles.cuec_div_3}`} >
          <div className={styles.cuec_div_4}>
            <div className={styles.cuec_div_5}>
              <Badge variant="purple">{activeCard.category}</Badge>
              {activeCard.isRecent && <Badge variant="yellow">Recent Topic</Badge>}
            </div>
            <div className={styles.cuec_div_6}>
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
            <div className={`text-xs text-muted ${styles.cuec_div_7}`} >YOU SHOULD SAY:</div>
            <ul className={styles.cuec_ul_8}>
              {activeCard.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className={`text-xs text-muted ${styles.cuec_div_7}`} >BAND 7.5+ VOCABULARY SUGGESTIONS</div>
            <div className={styles.cuec_div_9}>
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
        <div className={styles.cuec_div_10}>
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
            <div className={styles.cuec_div_11}>
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
              <p className={`text-sm ${styles.cuec_p_12}`} >{activeCard.sampleAnswer}</p>
            ) : (
              <p className="text-xs text-muted">
                Record your own 2-minute answer first before revealing the model response to maximise natural fluency.
              </p>
            )}
          </div>

          <div className={`card card-compact ${styles.cuec_div_13}`} >
            <h3 className={`h3 ${styles.cuec_h3_14}`} >Recent Cue Card Practice</h3>
            <div className={styles.cuec_div_15}>
              {history.slice(0, 4).map((h, i) => (
                <div
                  key={`${h.id}-${i}`}
                  className={styles.cuec_div_16}
                >
                  <span className={styles.cuec_span_17}>
                    {h.topic}
                  </span>
                  <span className={styles.cuec_span_18}>
                    <Badge variant="success"><CheckCircle2 size={11} /> {h.durationSec}s</Badge>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cue Card Library */}
      <section>
        <div className={styles.cuec_div_19}>
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
          <SearchBar value={search} onChange={setSearch} placeholder="Search cue cards..." className={styles.cuec_searchbar_20} />
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
                <div className={styles.cuec_div_21}>
                  <Badge variant="purple">{card.category}</Badge>
                  {card.isRecent && <Badge variant="yellow">Recent</Badge>}
                </div>
                <div className={styles.cuec_div_22}>{card.topic}</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

