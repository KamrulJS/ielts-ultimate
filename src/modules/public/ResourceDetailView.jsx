'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  RotateCw,
  Volume2,
} from 'lucide-react';
import { RESOURCE_NAV_ITEMS } from '@/lib/public-navigation';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { Badge, ProgressBar } from '@/components/common/UiPrimitives';
import {
  PublicIcon,
  PublicSectionHeader,
  PublicCtaBanner,
} from '@/components/public/PublicPrimitives';
import { ResourceHeroVisual } from '@/components/public/HeroVisuals';
import resourcesData from '@/data/public/resources-pages.json';
import wordsData from '@/data/vocabulary/words.json';
import styles from '@/components/public/PublicLayout.module.css';

function InteractiveResourcePreview({ slug, data }) {
  // Hook state for each tailored preview widget cleanly at top-level
  const [selectedStageIdx, setSelectedStageIdx] = useState(2);
  const [goalBand, setGoalBand] = useState('7.5');
  const [dailyMins, setDailyMins] = useState(60);
  const [simAnswer, setSimAnswer] = useState('');
  const [vocabIdx, setVocabIdx] = useState(0);
  const [vocabFlipped, setVocabFlipped] = useState(false);
  const [coachIdx, setCoachIdx] = useState(0);
  const [examinerIdx, setExaminerIdx] = useState(1);
  const [trackId, setTrackId] = useState('intermediate');

  if (slug === 'roadmap') {
    const stages = data.sampleStages || [];
    const cur = stages[selectedStageIdx] || stages[0];
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <Badge variant="yellow">Interactive Preview</Badge>
            <h3 className="h3" style={{ marginTop: 6 }}>Stage-by-Stage IELTS Progression</h3>
          </div>
          <Link href={data.dashboardHref} className="btn btn-primary btn-sm">
            {data.ctaLabel} →
          </Link>
        </div>

        <div className="filter-pills">
          {stages.map((st, idx) => (
            <button
              key={st.stage}
              type="button"
              onClick={() => setSelectedStageIdx(idx)}
              className={`filter-pill ${selectedStageIdx === idx ? 'active' : ''}`}
            >
              {st.stage}
            </button>
          ))}
        </div>

        {cur && (
          <div className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <strong style={{ fontSize: '0.96rem' }}>{cur.stage}: {cur.name}</strong>
              <Badge variant={cur.status === 'Completed' ? 'success' : cur.status === 'Active' ? 'yellow' : 'neutral'}>
                {cur.status}
              </Badge>
            </div>
            <p className="text-sm text-muted">Primary milestone focus: {cur.focus}</p>
            <ProgressBar value={cur.progress} variant="purple" showLabel />
          </div>
        )}
      </div>
    );
  }

  if (slug === 'study-planner') {
    const weeklyHours = ((dailyMins * 7) / 60).toFixed(1);
    const estWeeks = goalBand === '8.0' ? 9 : goalBand === '7.5' ? 6 : 4;
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <Badge variant="yellow">Interactive Schedule Simulator</Badge>
            <h3 className="h3" style={{ marginTop: 6 }}>Preview Your Personalized Study Cadence</h3>
          </div>
          <Link href={data.dashboardHref} className="btn btn-primary btn-sm">
            {data.ctaLabel} →
          </Link>
        </div>

        <div className="grid-2" style={{ gap: 14 }}>
          <div className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div className="field-label" style={{ marginBottom: 6 }}>Target Band Score</div>
              <div className="filter-pills">
                {['6.5', '7.0', '7.5', '8.0'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setGoalBand(b)}
                    className={`filter-pill ${goalBand === b ? 'active' : ''}`}
                  >
                    Band {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="field-label" style={{ marginBottom: 6 }}>Daily Study Commitment</div>
              <div className="filter-pills">
                {[30, 45, 60, 90].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDailyMins(m)}
                    className={`filter-pill ${dailyMins === m ? 'active' : ''}`}
                  >
                    {m} min/day
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card-dark card-compact" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
            <Badge variant="yellow" style={{ alignSelf: 'flex-start' }}>Generated Sample Plan</Badge>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#FFFFFF' }}>
              Goal: Band {goalBand} • {weeklyHours} hrs/week ({estWeeks}-week sprint)
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, color: '#C9C6BC', fontSize: '0.82rem' }}>
              <li>• Reading &amp; Listening Precision: {Math.round(dailyMins * 0.4)} min</li>
              <li>• Writing Structure &amp; Coherence: {Math.round(dailyMins * 0.35)} min</li>
              <li>• Speaking Cue Card + Lexical Recall: {Math.round(dailyMins * 0.25)} min</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (slug === 'simulation') {
    const isCorrect = simAnswer === 'Not Given';
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <Badge variant="yellow">Interactive Question Preview</Badge>
            <h3 className="h3" style={{ marginTop: 6 }}>Academic Reading: True / False / Not Given</h3>
          </div>
          <Badge variant="dark"><Clock size={12} /> 60:00 Section Timer</Badge>
        </div>

        <div className="grid-2" style={{ gap: 16 }}>
          <div className="card-warm card-compact" style={{ fontSize: '0.88rem', lineHeight: 1.65 }}>
            <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 6 }}>EXCERPT — PASSAGE 2</div>
            &ldquo;Municipal pilots introducing porous asphalt and shaded bioswales recorded a 3.2°C drop in peak afternoon surface temperatures across pilot districts compared with adjacent conventional avenues.&rdquo;
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              Statement: The city spent less money maintaining porous asphalt than traditional road surfaces.
            </div>
            <div className="filter-pills">
              {['True', 'False', 'Not Given'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSimAnswer(opt)}
                  className={`filter-pill ${simAnswer === opt ? 'active' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {simAnswer && (
              <div
                className="text-xs"
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  backgroundColor: isCorrect ? 'var(--success-soft)' : 'var(--error-soft)',
                  color: isCorrect ? 'var(--success)' : 'var(--error)',
                  fontWeight: 600,
                }}
              >
                {isCorrect
                  ? 'Correct: Not Given — The excerpt compares surface heat reductions, not maintenance budgets.'
                  : 'Try Not Given — The passage mentions temperature effects, without stating any maintenance cost figures.'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (slug === 'vocabulary') {
    const sampleWords = wordsData.slice(0, 6);
    const word = sampleWords[vocabIdx] || sampleWords[0];
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <Badge variant="yellow">Live JSON Vocabulary Sample</Badge>
            <h3 className="h3" style={{ marginTop: 6 }}>Interactive Flashcard Deck Preview</h3>
          </div>
          <Link href={data.dashboardHref} className="btn btn-primary btn-sm">
            {data.ctaLabel} →
          </Link>
        </div>

        <div className="filter-pills">
          {sampleWords.map((w, idx) => (
            <button
              key={w.id}
              type="button"
              onClick={() => {
                setVocabIdx(idx);
                setVocabFlipped(false);
              }}
              className={`filter-pill ${vocabIdx === idx ? 'active' : ''}`}
            >
              {w.word}
            </button>
          ))}
        </div>

        <div className="card-warm" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.35rem' }}>{word.word}</span>
              <span className="text-xs text-muted">{word.ipa} • {word.pos}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge variant="purple">Band {word.band}</Badge>
              <Badge variant="neutral">{word.category}</Badge>
            </div>
          </div>

          <p className="text-sm" style={{ lineHeight: 1.6 }}>
            {vocabFlipped ? (
              <><strong>Band 7.5+ Example:</strong> &ldquo;{word.example}&rdquo;</>
            ) : (
              <><strong>Definition:</strong> {word.definition}</>
            )}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="text-xs text-muted" style={{ fontWeight: 600 }}>Synonyms:</span>
              {word.synonyms.map((s) => (
                <Badge key={s} variant="neutral">{s}</Badge>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setVocabFlipped((v) => !v)}
            >
              <RotateCw size={14} /> {vocabFlipped ? 'Show Definition' : 'Flip for Example Sentence'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (slug === 'ai-coach') {
    const dialogs = data.sampleDialogs || [];
    const active = dialogs[coachIdx] || dialogs[0];
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <Badge variant="purple"><Sparkles size={12} /> Interactive Coaching Scenarios</Badge>
            <h3 className="h3" style={{ marginTop: 6 }}>Ask a Question &amp; Get Targeted Drill Direction</h3>
          </div>
          <Link href={data.dashboardHref} className="btn btn-primary btn-sm">
            {data.ctaLabel} →
          </Link>
        </div>

        <div className="filter-pills">
          {dialogs.map((d, idx) => (
            <button
              key={d.topic}
              type="button"
              onClick={() => setCoachIdx(idx)}
              className={`filter-pill ${coachIdx === idx ? 'active' : ''}`}
            >
              {d.topic}
            </button>
          ))}
        </div>

        {active && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card-warm card-compact">
              <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 4 }}>LEARNER QUESTION</div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>&ldquo;{active.studentQuestion}&rdquo;</div>
            </div>
            <div className="card-dark card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <Badge variant="yellow">AI Coach Diagnosis</Badge>
                <span className="text-xs" style={{ color: '#B7B5AD' }}>Suggested Next: {active.recommendedDrill}</span>
              </div>
              <p className="text-sm" style={{ color: '#EAE8E1', lineHeight: 1.65 }}>{active.coachReply}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (slug === 'ai-examiner') {
    const bands = data.bandSamples || [];
    const active = bands[examinerIdx] || bands[0];
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <Badge variant="purple">Rubric Comparison</Badge>
            <h3 className="h3" style={{ marginTop: 6 }}>Inspect 4-Criterion Marking Across Band Levels</h3>
          </div>
          <Link href={data.dashboardHref} className="btn btn-primary btn-sm">
            {data.ctaLabel} →
          </Link>
        </div>

        <div className="filter-pills">
          {bands.map((b, idx) => (
            <button
              key={b.band}
              type="button"
              onClick={() => setExaminerIdx(idx)}
              className={`filter-pill ${examinerIdx === idx ? 'active' : ''}`}
            >
              {b.band}
            </button>
          ))}
        </div>

        {active && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="grid-2" style={{ gap: 10 }}>
              {active.criteria.map((c) => (
                <div key={c.name} className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.88rem' }}>{c.name}</strong>
                    <Badge variant="dark">{c.score.toFixed(1)}</Badge>
                  </div>
                  <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>{c.note}</p>
                </div>
              ))}
            </div>
            <div className="card-dark card-compact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <span className="text-xs" style={{ color: '#EAE8E1' }}>
                <strong style={{ color: 'var(--accent-yellow)' }}>Actionable Next Step:</strong> {active.upgradeTip}
              </span>
              <Link href="/speaking" className="btn btn-accent btn-sm">
                <Volume2 size={14} /> Try Speaking Examiner
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // self-paced-courses
  const tracks = data.tracks || [];
  const activeTrack = tracks.find((t) => t.id === trackId) || tracks[0];
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="section-header" style={{ marginBottom: 0 }}>
        <div>
          <Badge variant="yellow">Course Curriculum Explorer</Badge>
          <h3 className="h3" style={{ marginTop: 6 }}>Choose a Learning Path by Target Band</h3>
        </div>
        <Link href={data.dashboardHref} className="btn btn-primary btn-sm">
          {data.ctaLabel} →
        </Link>
      </div>

      <div className="filter-pills">
        {tracks.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTrackId(t.id)}
            className={`filter-pill ${trackId === t.id ? 'active' : ''}`}
          >
            {t.level}
          </button>
        ))}
      </div>

      {activeTrack && (
        <div className="card-warm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h4 className="h3">{activeTrack.level}</h4>
              <div className="text-xs" style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>{activeTrack.targetBand}</div>
            </div>
            <Badge variant="dark">{activeTrack.moduleCount}</Badge>
          </div>
          <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>{activeTrack.summary}</p>
          <div className="grid-3" style={{ gap: 8 }}>
            {activeTrack.subjects.map((sub) => (
              <div key={sub} className="card card-compact" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={14} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
                <span className="text-xs" style={{ fontWeight: 600 }}>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ResourceDetailView({ slug }) {
  const rootRef = useGsapEntrance(`resource-${slug}`);
  const data = resourcesData[slug];

  if (!data) return null;

  const related = RESOURCE_NAV_ITEMS.filter((r) => r.slug !== slug).slice(0, 3);

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className={styles.sectionSpace} style={{ paddingTop: 32, paddingBottom: 36 }}>
        <div className={styles.container}>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Resources</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{data.title}</span>
          </nav>

          <div className={`card-warm ${styles.publicHeroGrid}`} data-animate="card" style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge variant="yellow">{data.badge}</Badge>
                {data.highlights.map((h) => (
                  <Badge key={h} variant="neutral">{h}</Badge>
                ))}
              </div>
              <h1 className="hero-heading">{data.headline}</h1>
              <p className="hero-desc">{data.subheadline}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                <Link href={data.dashboardHref} className="btn btn-primary btn-lg">
                  {data.ctaLabel} <ArrowRight size={16} />
                </Link>
                <a href="#how-it-works" className="btn btn-secondary btn-lg">
                  See How It Works
                </a>
              </div>
            </div>

            <ResourceHeroVisual slug={slug} />
          </div>
        </div>
      </section>

      {/* Why Learners Need It + Interactive Demo */}
      <section className={styles.sectionWarmBand}>
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <PublicSectionHeader
              eyebrow="Purpose & Value"
              title={data.purposeTitle}
              subtitle={data.purposeBody}
            />
            <div className="grid-3">
              {data.whyLearnersNeed.map((item) => (
                <div key={item.title} data-animate="reveal" className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                  <h3 className="card-heading">{item.title}</h3>
                  <p className="body-text">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <InteractiveResourcePreview slug={slug} data={data} />
        </div>
      </section>

      {/* Step-by-Step How It Works + Key Features */}
      <section id="how-it-works" className={styles.sectionSpace}>
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: 42 }}>
          <div>
            <PublicSectionHeader
              eyebrow="Workflow"
              title={`How ${data.title} works step by step`}
              subtitle="Integrated smoothly into your student study portal with saved history."
            />
            <div className="grid-4">
              {data.howItWorks.map((step) => (
                <div key={step.step} className="card card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Badge variant="dark" style={{ alignSelf: 'flex-start' }}>Step {step.step}</Badge>
                  <h3 className="card-heading">{step.title}</h3>
                  <p className="supporting-text">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <PublicSectionHeader
              eyebrow="Capabilities"
              title="Key features & learning benefits"
              subtitle="Designed to keep preparation transparent, measurable, and calm."
            />
            <div className="grid-3">
              {data.keyFeatures.map((feat) => (
                <div key={feat.title} className="card card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="card-heading">{feat.title}</div>
                  <p className="body-text">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <PublicSectionHeader
              eyebrow="Example Use Cases"
              title="How different IELTS candidates apply this tool"
            />
            <div className="grid-3">
              {data.useCases.map((uc) => (
                <div key={uc.persona} className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Badge variant="purple" style={{ alignSelf: 'flex-start' }}>{uc.persona}</Badge>
                  <p className="body-text">{uc.plan}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources & CTA */}
      <section className={styles.sectionWarmBand}>
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <PublicSectionHeader
              eyebrow="Explore More"
              title="Pair with other IELTS Ultimate tools"
            />
            <div className="grid-3">
              {related.map((rel) => (
                <Link key={rel.slug} href={rel.href} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <PublicIcon name={rel.icon} size={18} style={{ color: 'var(--accent-purple)' }} />
                      <Badge variant="neutral">{rel.badge}</Badge>
                    </div>
                    <h3 className="h3">{rel.title}</h3>
                    <p className="text-xs text-muted" style={{ marginTop: 4 }}>{rel.shortDesc}</p>
                  </div>
                  <span className="text-xs" style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>
                    View Feature <ArrowUpRight size={13} style={{ display: 'inline' }} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <PublicCtaBanner
            badge="Ready to Practise?"
            title={`Launch ${data.title} inside your IELTS Ultimate workspace`}
            description="Sign in with your student account or create a free profile in moments to save progress, exam timing, and study streaks."
            primaryLabel={data.ctaLabel}
            primaryHref={data.dashboardHref}
            secondaryLabel="Create Free Account"
            secondaryHref="/login?mode=signup"
          />
        </div>
      </section>
    </div>
  );
}

