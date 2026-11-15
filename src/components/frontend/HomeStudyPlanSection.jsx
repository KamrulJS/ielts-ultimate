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
import homeStyles from '@/modules/frontend/PublicHome.module.css';
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
    <section
      className={`${styles.sectionWarmBand} ${styles.home_section_1}`}
      
    >
      <div className={styles.container}>
        <div className={styles.home_div_2}>
          <span
            className={styles.home_span_3}
          >
            Personalized Learning
          </span>
          <h2 className={styles.home_h2_4}>
            A Smarter Way to Plan Your <span className={styles.home_span_5}>IELTS Preparation</span>
          </h2>
          <p className={styles.home_p_6}>
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
                    <div className={styles.home_div_7}>
                      <h3 className={homeStyles.studyBenefitTitle}>{item.title}</h3>
                      <p className={homeStyles.studyBenefitDesc}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.home_div_8}>
              <Link
                href="/resources/study-planner"
                className={`btn btn-primary ${styles.home_link_9}`}
                
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
            <div className={styles.home_div_10}>
              <div className={styles.home_div_11}>
                <span
                  className={styles.home_span_12}
                >
                  <Calendar size={16} />
                </span>
                <div>
                  <div className={styles.home_div_13}>Smart Study Planner</div>
                  <div className="text-xs text-muted">Daily Target: Band 7.5 Academic</div>
                </div>
              </div>
              <span className={`badge badge-yellow ${styles.home_span_14}`} >
                Auto-Pacing 5s
              </span>
            </div>

            {/* Slide Body */}
            <div className={styles.home_div_15}>
              {/* Slide 0: Weekly Study Calendar */}
              {currentSlide === 0 && (
                <div className={styles.home_div_16}>
                  <div className={styles.home_div_17}>
                    <span className={styles.home_span_18}>This Week’s Schedule</span>
                    <span className="text-xs text-muted">Nov 11 - Nov 17</span>
                  </div>
                  <div className={styles.home_div_19}>
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
                        <div className={`text-xs text-muted ${styles.home_div_20}`} >{day}</div>
                        <div className={styles.home_div_21}>{10 + i}</div>
                        <div style={{ fontSize: '0.62rem', color: i < 4 ? 'var(--success)' : 'var(--text-muted)', marginTop: 4 }}>
                          {i < 4 ? '✓ Done' : '50m'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.home_div_22}>
                    <div className={styles.home_div_23}>
                      <span>Today: Academic Reading Section 3</span>
                      <span className={`badge badge-purple ${styles.home_span_24}`} >45 min</span>
                    </div>
                    <p className={`text-xs text-muted ${styles.home_p_25}`} >
                      Topic: Marine Biodiversity & Climate Shift • Matching Headings & True/False/Not Given
                    </p>
                  </div>
                </div>
              )}

              {/* Slide 1: Daily Task Checklist */}
              {currentSlide === 1 && (
                <div className={styles.home_div_26}>
                  <div className={styles.home_div_17}>
                    <span className={styles.home_span_18}>Today&apos;s Task Checklist</span>
                    <span className={`badge badge-yellow ${styles.home_span_27}`} >+120 XP Earned</span>
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
                      <div className={styles.home_div_11}>
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
                      <span className={`text-xs text-muted ${styles.home_span_28}`} >
                        {task.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Slide 2: Momentum Streak Tracker */}
              {currentSlide === 2 && (
                <div className={styles.home_div_29}>
                  <div
                    className={styles.home_div_30}
                  >
                    <Flame size={28} />
                  </div>
                  <div className={styles.home_div_31}>
                    12-Day Study Streak!
                  </div>
                  <p className={`text-xs text-muted ${styles.home_p_32}`} >
                    Keep the momentum going! Practice 25 minutes today to protect your streak.
                  </p>
                  <div className={styles.home_div_33}>
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
                <div className={styles.home_div_34}>
                  <span className={`badge badge-purple ${styles.home_span_35}`} >
                    Writing Task 2 Timer
                  </span>
                  <div
                    className={styles.home_div_36}
                  >
                    24:58
                  </div>
                  <p className={`text-xs text-muted ${styles.home_p_37}`} >
                    Recommended pacing: 5m plan • 30m write • 5m proofread
                  </p>
                  <div className={styles.home_div_38}>
                    <button
                      type="button"
                      className={`btn btn-primary btn-sm ${styles.home_button_39}`}
                      
                    >
                      <Play size={14} /> Resume Drill
                    </button>
                    <button
                      type="button"
                      className={`btn btn-secondary btn-sm ${styles.home_button_39}`}
                      
                    >
                      <RotateCcw size={14} /> Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Slide 4: Target Band Forecast */}
              {currentSlide === 4 && (
                <div className={styles.home_div_16}>
                  <div className={styles.home_div_17}>
                    <span className={styles.home_span_18}>Target Band Forecast</span>
                    <span className={`badge badge-purple ${styles.home_span_40}`} >
                      Predicted Band 7.5
                    </span>
                  </div>
                  <div className={styles.home_div_41}>
                    {[
                      { mod: 'Reading', score: '8.0', color: 'var(--accent-purple)' },
                      { mod: 'Listening', score: '8.5', color: 'var(--accent-purple)' },
                      { mod: 'Writing', score: '7.0', color: 'var(--accent-yellow-hover)' },
                      { mod: 'Speaking', score: '7.0', color: 'var(--accent-yellow-hover)' },
                    ].map((m) => (
                      <div key={m.mod} className={styles.home_div_42}>
                        <div className={`text-xs text-muted ${styles.home_div_43}`} >{m.mod}</div>
                        <div style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: 4, color: m.color }}>{m.score}</div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.home_div_44}>
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

              <div className={styles.home_div_45}>
                <button
                  type="button"
                  onClick={prevSlide}
                  className={`btn btn-secondary btn-icon ${styles.home_button_46}`}
                  
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className={`btn btn-secondary btn-icon ${styles.home_button_46}`}
                  
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

