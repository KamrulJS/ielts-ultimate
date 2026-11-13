'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
  Check,
  Play,
  RotateCcw,
} from 'lucide-react';
import homeStyles from '@/modules/public/PublicHome.module.css';
import styles from './PublicLayout.module.css';

const BENEFITS = [
  {
    icon: Calendar,
    title: 'Personalized Study Schedule',
    desc: 'Adaptive daily lesson tracks built around your official exam date and diagnostic baseline.',
  },
  {
    icon: CheckCircle2,
    title: 'Daily Learning Tasks',
    desc: 'Bite-sized practice sessions covering Reading, Writing, Listening & Speaking drills.',
  },
  {
    icon: TrendingUp,
    title: 'Weekly Progress Tracking',
    desc: 'Visual score trajectories and predicted band velocity updated after every practice mock.',
  },
  {
    icon: Clock,
    title: 'Time Management',
    desc: 'Section-specific timers and pacing indicators train you to complete full exams without rushing.',
  },
  {
    icon: Target,
    title: 'Target Band Planning',
    desc: 'Milestone checkpoints verify your readiness before you commit to official test registration fees.',
  },
  {
    icon: Sparkles,
    title: 'Practice Recommendations',
    desc: 'Rubric-aware weakness detection surfaces targeted grammar, lexical, and audio drills.',
  },
];

export function HomeStudyPlanSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = 5;
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, slideCount]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slideCount);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);

  return (
    <section className={styles.sectionWarmBand} style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className={styles.container}>
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 24px' }}>
          <span
            className="badge badge-purple"
            style={{ borderRadius: 0, padding: '4px 10px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 10, display: 'inline-flex' }}
          >
            Personalized Learning
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, margin: '8px 0 14px', lineHeight: 1.2 }}>
            A Smarter Way to Plan Your <span style={{ color: 'var(--accent-purple)' }}>IELTS Preparation</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Stay organized, manage your study time, and follow a structured preparation routine designed to help you reach your target band.
          </p>
        </div>

        <div className={homeStyles.studyPlanGrid}>
          {/* Left Column: Key Benefits */}
          <div>
            <div className={homeStyles.studyBenefitList}>
              {BENEFITS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className={homeStyles.studyBenefitItem}>
                    <div className={homeStyles.studyBenefitIcon}>
                      <Icon size={20} />
                    </div>
                    <h3 className={homeStyles.studyBenefitTitle}>{item.title}</h3>
                    <p className={homeStyles.studyBenefitDesc}>{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 28 }}>
              <Link
                href="/resources/study-planner"
                className="btn btn-primary"
                style={{ borderRadius: 0, padding: '12px 24px' }}
              >
                <span>Generate Your Free Study Plan</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right Column: Automated Interactive Slider */}
          <div
            className={homeStyles.studySliderCard}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 0,
                    backgroundColor: 'var(--accent-purple)',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Calendar size={16} />
                </span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Smart Study Planner</div>
                  <div className="text-xs text-muted">Daily Target: Band 7.5 Academic</div>
                </div>
              </div>
              <span className="badge badge-yellow" style={{ borderRadius: 0, padding: '3px 8px', fontSize: '0.72rem' }}>
                Auto-Pacing 5s
              </span>
            </div>

            {/* Slide Body */}
            <div style={{ flex: 1, minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Slide 0: Weekly Study Calendar */}
              {currentSlide === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>This Week’s Schedule</span>
                    <span className="text-xs text-muted">Nov 11 - Nov 17</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center' }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div
                        key={day}
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: 0,
                          padding: '8px 4px',
                          backgroundColor: i === 3 ? 'var(--accent-purple-soft)' : 'var(--surface)',
                          borderColor: i === 3 ? 'var(--accent-purple)' : 'var(--border)',
                        }}
                      >
                        <div className="text-xs text-muted" style={{ fontSize: '0.68rem' }}>{day}</div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: 2 }}>{10 + i}</div>
                        <div style={{ fontSize: '0.62rem', color: i < 4 ? 'var(--success)' : 'var(--text-muted)', marginTop: 4 }}>
                          {i < 4 ? '✓ Done' : '50m'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ border: '1px solid var(--border)', padding: '12px 14px', backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span>Today: Academic Reading Section 3</span>
                      <span className="badge badge-purple" style={{ borderRadius: 0, fontSize: '0.7rem' }}>45 min</span>
                    </div>
                    <p className="text-xs text-muted" style={{ margin: '4px 0 0' }}>
                      Topic: Marine Biodiversity & Climate Shift • Matching Headings & True/False/Not Given
                    </p>
                  </div>
                </div>
              )}

              {/* Slide 1: Daily Task Checklist */}
              {currentSlide === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Today&apos;s Task Checklist</span>
                    <span className="badge badge-yellow" style={{ borderRadius: 0, fontSize: '0.72rem' }}>+120 XP Earned</span>
                  </div>
                  {[
                    { text: 'Complete Academic Reading Passage 2 (Albedo Effect)', done: true, time: '20 min' },
                    { text: 'Submit Task 2 Essay for instant AI Band Scoring', done: true, time: '40 min' },
                    { text: 'Review 15 Lexical Collocations in Vocabulary Lab', done: true, time: '15 min' },
                    { text: 'Speaking Part 2 Cue Card simulation drill', done: false, time: '12 min' },
                  ].map((task) => (
                    <div
                      key={task.text}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 0,
                        backgroundColor: task.done ? 'var(--bg-primary)' : 'var(--surface)',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 0,
                            backgroundColor: task.done ? 'var(--success)' : 'transparent',
                            border: `1.5px solid ${task.done ? 'var(--success)' : 'var(--border-strong)'}`,
                            color: '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            flexShrink: 0,
                          }}
                        >
                          {task.done && <Check size={12} strokeWidth={3} />}
                        </span>
                        <span
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: task.done ? 500 : 700,
                            textDecoration: task.done ? 'line-through' : 'none',
                            color: task.done ? 'var(--text-muted)' : 'var(--text-primary)',
                          }}
                        >
                          {task.text}
                        </span>
                      </div>
                      <span className="text-xs text-muted" style={{ fontSize: '0.72rem', flexShrink: 0 }}>
                        {task.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Slide 2: Momentum Streak Tracker */}
              {currentSlide === 2 && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 0,
                      backgroundColor: 'var(--accent-yellow-soft)',
                      color: 'var(--accent-yellow-hover)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--accent-yellow)',
                      marginBottom: 12,
                    }}
                  >
                    <Flame size={28} />
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    12-Day Study Streak!
                  </div>
                  <p className="text-xs text-muted" style={{ margin: '6px 0 16px' }}>
                    Keep the momentum going! Practice 25 minutes today to protect your streak.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                      <span
                        key={idx}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 0,
                          backgroundColor: idx < 6 ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                          color: idx < 6 ? '#202020' : 'var(--text-muted)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide 3: Real-Time Section Timer */}
              {currentSlide === 3 && (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <span className="badge badge-purple" style={{ borderRadius: 0, marginBottom: 12, display: 'inline-block' }}>
                    Writing Task 2 Timer
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '3.2rem',
                      fontWeight: 800,
                      color: 'var(--accent-purple)',
                      letterSpacing: '0.05em',
                      lineHeight: 1,
                      margin: '12px 0',
                    }}
                  >
                    24:58
                  </div>
                  <p className="text-xs text-muted" style={{ margin: '0 0 18px' }}>
                    Recommended pacing: 5m plan • 30m write • 5m proofread
                  </p>
                  <div style={{ display: 'inline-flex', gap: 10 }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: 0, padding: '8px 16px' }}
                    >
                      <Play size={14} /> Resume Drill
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: 0, padding: '8px 16px' }}
                    >
                      <RotateCcw size={14} /> Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Slide 4: Target Band Forecast */}
              {currentSlide === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Target Band Forecast</span>
                    <span className="badge badge-purple" style={{ borderRadius: 0, fontSize: '0.75rem', fontWeight: 800 }}>
                      Predicted Band 7.5
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
                    {[
                      { mod: 'Reading', score: '8.0', color: 'var(--accent-purple)' },
                      { mod: 'Listening', score: '8.5', color: 'var(--accent-purple)' },
                      { mod: 'Writing', score: '7.0', color: 'var(--accent-yellow-hover)' },
                      { mod: 'Speaking', score: '7.0', color: 'var(--accent-yellow-hover)' },
                    ].map((m) => (
                      <div key={m.mod} style={{ border: '1px solid var(--border)', borderRadius: 0, padding: '10px 4px', backgroundColor: 'var(--bg-primary)' }}>
                        <div className="text-xs text-muted" style={{ fontSize: '0.72rem' }}>{m.mod}</div>
                        <div style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: 4, color: m.color }}>{m.score}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ border: '1px solid var(--border)', padding: '10px 14px', backgroundColor: 'var(--surface)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    🎯 <strong>Next milestone:</strong> Push Writing Task 2 Lexical Resource from 6.5 to 7.0 by mastering academic collocations.
                  </div>
                </div>
              )}
            </div>

            {/* Slider Navigation Row */}
            <div className={homeStyles.sliderNavRow}>
              <div className={homeStyles.sliderDots}>
                {Array.from({ length: slideCount }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`${homeStyles.sliderDot} ${currentSlide === idx ? homeStyles.sliderDotActive : ''}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="btn btn-secondary btn-icon"
                  style={{ width: 32, height: 32, borderRadius: 0, padding: 0 }}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="btn btn-secondary btn-icon"
                  style={{ width: 32, height: 32, borderRadius: 0, padding: 0 }}
                  aria-label="Next slide"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

