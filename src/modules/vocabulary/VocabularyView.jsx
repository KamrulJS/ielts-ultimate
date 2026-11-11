'use client';

import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Star,
  CheckCircle2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  BookOpen,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { PageHeader, Badge, ProgressBar, StatCard } from '@/components/common/UiPrimitives';
import { SearchBar } from '@/components/common/DataControls';
import { Modal } from '@/components/common/Modal';

import categories from '@/data/vocabulary/categories.json';
import words from '@/data/vocabulary/words.json';
import quizzes from '@/data/vocabulary/quizzes.json';

function speakWord(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-GB';
  utter.rate = 0.92;
  window.speechSynthesis.speak(utter);
}

export function VocabularyView() {
  const { bookmarks, toggleBookmark, masteredWords, toggleMasteredWord } = useApp();
  const rootRef = useGsapEntrance('vocabulary');

  const [tab, setTab] = useState('library'); // library | flashcards | quiz | saved | progress
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [detailWord, setDetailWord] = useState(null);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredWords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return words
      .filter((w) => (tab === 'saved' ? bookmarks.vocabulary.includes(w.id) : true))
      .filter((w) => (catFilter === 'all' ? true : w.category === catFilter))
      .filter(
        (w) =>
          !q ||
          w.word.toLowerCase().includes(q) ||
          w.definition.toLowerCase().includes(q) ||
          w.synonyms.some((s) => s.toLowerCase().includes(q))
      );
  }, [tab, catFilter, search, bookmarks.vocabulary]);

  const deck = filteredWords.length ? filteredWords : words;
  const activeCard = deck[cardIndex % deck.length] || words[0];

  const quizScore = quizzes.filter((q) => quizAnswers[q.id] === q.answer).length;
  const masteryPct = Math.round((masteredWords.length / words.length) * 100);

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <PageHeader
        title="Academic Vocabulary Studio"
        description="Band 7.5–8.5 academic lexis with IPA phonetics, audio pronunciation, interactive flip flashcards, and quizzes."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Vocabulary' }]}
        badge={<Badge variant="purple">{masteredWords.length} / {words.length} Mastered</Badge>}
      />

      {/* Mode Tabs */}
      <div className="tabs-list">
        {[
          { id: 'library', label: 'Word Library', count: words.length },
          { id: 'flashcards', label: 'Flashcards' },
          { id: 'quiz', label: 'Vocabulary Quiz' },
          { id: 'saved', label: 'Saved Words', count: bookmarks.vocabulary.length },
          { id: 'progress', label: 'Progress' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab-trigger ${tab === t.id ? 'active' : ''}`}
            onClick={() => {
              setTab(t.id);
              setFlipped(false);
            }}
          >
            <span>{t.label}</span>
            {t.count !== undefined && <span className="text-xs text-muted">({t.count})</span>}
          </button>
        ))}
      </div>

      {/* Filters for Library & Saved */}
      {(tab === 'library' || tab === 'saved') && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div className="filter-pills">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`filter-pill ${catFilter === c.id ? 'active' : ''}`}
                  onClick={() => setCatFilter(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <SearchBar value={search} onChange={setSearch} placeholder="Search words or synonyms..." style={{ width: 240 }} />
          </div>

          <div className="grid-3">
            {filteredWords.map((w) => {
              const isFav = bookmarks.vocabulary.includes(w.id);
              const isMastered = masteredWords.includes(w.id);
              return (
                <div key={w.id} data-animate="card" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 className="h3" style={{ fontSize: '1.1rem' }}>{w.word}</h3>
                        <button
                          type="button"
                          onClick={() => speakWord(w.word)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: 4 }}
                          title="Pronounce word"
                          aria-label={`Pronounce ${w.word}`}
                        >
                          <Volume2 size={15} />
                        </button>
                      </div>
                      <div className="text-xs text-muted">
                        {w.pos} • {w.ipa}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark('vocabulary', w.id, 'Saved Vocabulary')}
                      aria-label="Favourite word"
                    >
                      <Star
                        size={17}
                        fill={isFav ? 'var(--accent-yellow)' : 'none'}
                        color={isFav ? '#B48200' : 'var(--text-secondary)'}
                      />
                    </button>
                  </div>

                  <p className="text-sm" style={{ lineHeight: 1.5 }}>{w.definition}</p>
                  <p className="text-xs text-muted" style={{ fontStyle: 'italic' }}>&ldquo;{w.example}&rdquo;</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 6 }}>
                    <Badge variant="purple">Band {w.band}</Badge>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${isMastered ? 'btn-accent' : 'btn-secondary'}`}
                        onClick={() => toggleMasteredWord(w.id)}
                      >
                        <CheckCircle2 size={13} /> {isMastered ? 'Mastered' : 'Learn'}
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDetailWord(w)}>
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Interactive Flashcards */}
      {tab === 'flashcards' && activeCard && (
        <div style={{ maxWidth: 640, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm text-muted">
              Card {(cardIndex % deck.length) + 1} of {deck.length}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setCardIndex(Math.floor(Math.random() * deck.length));
                setFlipped(false);
              }}
            >
              <Shuffle size={14} /> Random Card
            </button>
          </div>

          <div
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f);
            }}
            className="card"
            style={{
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 32,
              cursor: 'pointer',
              backgroundColor: flipped ? 'var(--bg-secondary)' : 'var(--surface)',
              transition: 'background-color 0.25s ease',
            }}
          >
            {!flipped ? (
              <>
                <Badge variant="purple">{activeCard.category} • Band {activeCard.band}</Badge>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, marginTop: 14 }}>
                  {activeCard.word}
                </h2>
                <div className="text-sm text-muted" style={{ marginTop: 4 }}>
                  {activeCard.pos} • {activeCard.ipa}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(activeCard.word);
                    }}
                  >
                    <Volume2 size={14} /> Pronounce
                  </button>
                  <span className="btn btn-ghost btn-sm">
                    <RotateCw size={14} /> Click card to flip
                  </span>
                </div>
              </>
            ) : (
              <>
                <Badge variant="yellow">Definition & Usage</Badge>
                <p style={{ fontSize: '1.15rem', fontWeight: 600, marginTop: 14, maxWidth: 480 }}>
                  {activeCard.definition}
                </p>
                <p className="text-sm text-muted" style={{ marginTop: 10, fontStyle: 'italic' }}>
                  &ldquo;{activeCard.example}&rdquo;
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 14 }}>
                  {activeCard.synonyms.map((s) => (
                    <Badge key={s} variant="neutral">≈ {s}</Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setCardIndex((i) => (i - 1 + deck.length) % deck.length);
                setFlipped(false);
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              type="button"
              className={`btn ${masteredWords.includes(activeCard.id) ? 'btn-accent' : 'btn-secondary'}`}
              onClick={() => toggleMasteredWord(activeCard.id)}
            >
              <CheckCircle2 size={16} /> {masteredWords.includes(activeCard.id) ? 'Mastered' : 'Mark Mastered'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setCardIndex((i) => (i + 1) % deck.length);
                setFlipped(false);
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Vocabulary Quiz */}
      {tab === 'quiz' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="section-header">
            <div>
              <h2 className="h2">Academic Vocabulary Quick Quiz</h2>
              <p className="text-xs text-muted">Test meaning, synonyms, and academic register</p>
            </div>
            {quizSubmitted && (
              <Badge variant={quizScore >= 4 ? 'success' : 'yellow'}>
                Score: {quizScore} / {quizzes.length}
              </Badge>
            )}
          </div>

          {quizzes.map((q, idx) => (
            <div key={q.id} className="card-warm card-compact">
              <p style={{ fontWeight: 600, marginBottom: 10 }}>
                {idx + 1}. {q.question}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`filter-pill ${quizAnswers[q.id] === opt ? 'active' : ''}`}
                    onClick={() => setQuizAnswers((p) => ({ ...p, [q.id]: opt }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {quizSubmitted && (
                <p
                  className="text-xs"
                  style={{
                    marginTop: 8,
                    color: quizAnswers[q.id] === q.answer ? 'var(--success)' : 'var(--error)',
                    fontWeight: 600,
                  }}
                >
                  {quizAnswers[q.id] === q.answer ? 'Correct! ' : `Answer: ${q.answer}. `}
                  {q.explanation}
                </p>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-primary" onClick={() => setQuizSubmitted(true)}>
              Check Quiz Score
            </button>
            {quizSubmitted && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
              >
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {tab === 'progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid-3">
            <StatCard label="Words Mastered" value={`${masteredWords.length} / ${words.length}`} icon={CheckCircle2} dark />
            <StatCard label="Favourites Saved" value={bookmarks.vocabulary.length} icon={Star} />
            <StatCard label="Mastery Rate" value={`${masteryPct}%`} icon={BookOpen} />
          </div>
          <div className="card">
            <h3 className="h3" style={{ marginBottom: 10 }}>Academic Word List Progress</h3>
            <ProgressBar value={masteryPct} variant="purple" showLabel />
          </div>
        </div>
      )}

      {/* Word Details Modal */}
      <Modal
        open={Boolean(detailWord)}
        onClose={() => setDetailWord(null)}
        title={detailWord?.word}
        subtitle={detailWord ? `${detailWord.pos} • ${detailWord.ipa} • ${detailWord.category}` : ''}
      >
        {detailWord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="text-sm">{detailWord.definition}</p>
            <div className="card-warm card-compact">
              <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 4 }}>EXAMPLE SENTENCE</div>
              <p className="text-sm">&ldquo;{detailWord.example}&rdquo;</p>
            </div>
            <div>
              <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 6 }}>SYNONYMS</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {detailWord.synonyms.map((s) => (
                  <Badge key={s} variant="purple">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 6 }}>ANTONYMS</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {detailWord.antonyms.map((a) => (
                  <Badge key={a} variant="neutral">{a}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

