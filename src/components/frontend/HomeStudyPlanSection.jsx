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
import secStyles from './HomeStudyPlanSection.module.css';

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
    <section className={secStyles.sectionWrapper}>
      <div className={styles.container}>
        <div className={secStyles.headerContainer}>
          <span className={secStyles.eyebrowBadge}>
            Personalized Learning
          </span>
          <h2 className={secStyles.sectionHeading}>
            A Smarter Way to Plan Your <span className={secStyles.headingHighlight}>IELTS Preparation</span>
          </h2>
          <p className={secStyles.sectionDesc}>
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
                    <div className={secStyles.benefitContent}>
                      <h3 className={homeStyles.studyBenefitTitle}>{item.title}</h3>
                      <p className={homeStyles.studyBenefitDesc}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={secStyles.buttonWrapper}>
              <Link
                href="/resources/study-planner"
                className={`btn btn-primary ${secStyles.ctaButton}`}
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
            <div className={secStyles.sliderHeader}>
              <div className={secStyles.sliderHeaderLeft}>
                <span className={secStyles.calendarIconBox}>
                  <Calendar size={16} />
                </span>
                <div>
                  <div className={secStyles.sliderHeaderTitle}>Smart Study Planner</div>
                  <div className="text-xs text-muted">Daily Target: Band 7.5 Academic</div>
                </div>
              </div>
              <span className={`badge badge-yellow ${secStyles.pacingBadge}`}>
                Auto-Pacing 5s
              </span>
            </div>

            {/* Slide Body */}
            <div className={secStyles.slideBody}>
              {/* Slide 0: Weekly Study Calendar */}
              {currentSlide === 0 && (
                <div className={secStyles.slideStack}>
                  <div className={secStyles.slideTopRow}>
                    <span className={secStyles.slideTitle}>This Week’s Schedule</span>
                    <span className="text-xs text-muted">Nov 11 - Nov 17</span>
                  </div>
                  <div className={secStyles.daysGrid}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div
                        key={day}
                        className={`${secStyles.dayTile} ${i === 3 ? secStyles.dayTileActive : ''}`}
                      >
                        <div className={`text-xs text-muted ${secStyles.dayLabel}`}>{day}</div>
                        <div className={secStyles.dayNumber}>{10 + i}</div>
                        <div className={secStyles.dayStatus} style={{ color: i < 4 ? 'var(--success)' : 'var(--text-muted)' }}>
                          {i < 4 ? '✓ Done' : '50m'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={secStyles.todayTaskCard}>
                    <div className={secStyles.todayTaskHeader}>
                      <span>Today: Academic Reading Section 3</span>
                      <span className={`badge badge-purple ${secStyles.taskDurationBadge}`}>45 min</span>
                    </div>
                    <p className={`text-xs text-muted ${secStyles.todayTaskDesc}`}>
                      Topic: Marine Biodiversity & Climate Shift • Matching Headings & True/False/Not Given
                    </p>
                  </div>
                </div>
              )}

              {/* Slide 1: Daily Task Checklist */}
              {currentSlide === 1 && (
                <div className={secStyles.checklistStack}>
                  <div className={secStyles.slideTopRow}>
                    <span className={secStyles.slideTitle}>Today&apos;s Task Checklist</span>
                    <span className={`badge badge-yellow ${secStyles.xpBadge}`}>+120 XP Earned</span>
                  </div>
                  {[
                    { text: 'Complete Academic Reading Passage 2 (Albedo Effect)', done: true, time: '20 min' },
                    { text: 'Submit Task 2 Essay for instant AI Band Scoring', done: true, time: '40 min' },
                    { text: 'Review 15 Lexical Collocations in Vocabulary Lab', done: true, time: '15 min' },
                    { text: 'Speaking Part 2 Cue Card simulation drill', done: false, time: '12 min' },
                  ].map((task) => (
                    <div
                      key={task.text}
                      className={`${secStyles.checklistItem} ${task.done ? secStyles.checklistItemDone : secStyles.checklistItemPending}`}
                    >
                      <div className={secStyles.checklistLeft}>
                        <span className={`${secStyles.checkIconBox} ${task.done ? secStyles.checkIconBoxDone : secStyles.checkIconBoxPending}`}>
                          {task.done && <Check size={12} strokeWidth={3} />}
                        </span>
                        <span className={`${secStyles.checkItemText} ${task.done ? secStyles.checkItemTextDone : secStyles.checkItemTextPending}`}>
                          {task.text}
                        </span>
                      </div>
                      <span className={`text-xs text-muted ${secStyles.checkItemTime}`}>
                        {task.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Slide 2: Momentum Streak Tracker */}
              {currentSlide === 2 && (
                <div className={secStyles.streakCard}>
                  <div className={secStyles.flameBox}>
                    <Flame size={28} />
                  </div>
                  <div className={secStyles.streakTitle}>
                    12-Day Study Streak!
                  </div>
                  <p className={`text-xs text-muted ${secStyles.streakDesc}`}>
                    Keep the momentum going! Practice 25 minutes today to protect your streak.
                  </p>
                  <div className={secStyles.streakDaysRow}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                      <span
                        key={idx}
                        className={`${secStyles.streakDayTile} ${idx < 6 ? secStyles.streakDayActive : secStyles.streakDayInactive}`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide 3: Real-Time Section Timer */}
              {currentSlide === 3 && (
                <div className={secStyles.timerCard}>
                  <span className={`badge badge-purple ${secStyles.timerBadge}`}>
                    Writing Task 2 Timer
                  </span>
                  <div className={secStyles.timerDigits}>
                    24:58
                  </div>
                  <p className={`text-xs text-muted ${secStyles.timerDesc}`}>
                    Recommended pacing: 5m plan • 30m write • 5m proofread
                  </p>
                  <div className={secStyles.timerButtons}>
                    <button
                      type="button"
                      className={`btn btn-primary btn-sm ${secStyles.timerButton}`}
                    >
                      <Play size={14} /> Resume Drill
                    </button>
                    <button
                      type="button"
                      className={`btn btn-secondary btn-sm ${secStyles.timerButton}`}
                    >
                      <RotateCcw size={14} /> Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Slide 4: Target Band Forecast */}
              {currentSlide === 4 && (
                <div className={secStyles.slideStack}>
                  <div className={secStyles.slideTopRow}>
                    <span className={secStyles.slideTitle}>Target Band Forecast</span>
                    <span className={`badge badge-purple ${secStyles.forecastBadge}`}>
                      Predicted Band 7.5
                    </span>
                  </div>
                  <div className={secStyles.forecastScoresGrid}>
                    {[
                      { mod: 'Reading', score: '8.0', color: 'var(--accent-purple)' },
                      { mod: 'Listening', score: '8.5', color: 'var(--accent-purple)' },
                      { mod: 'Writing', score: '7.0', color: 'var(--accent-yellow-hover)' },
                      { mod: 'Speaking', score: '7.0', color: 'var(--accent-yellow-hover)' },
                    ].map((m) => (
                      <div key={m.mod} className={secStyles.forecastScoreBox}>
                        <div className={`text-xs text-muted ${secStyles.forecastScoreLabel}`}>{m.mod}</div>
                        <div className={secStyles.forecastScoreValue} style={{ color: m.color }}>{m.score}</div>
                      </div>
                    ))}
                  </div>
                  <div className={secStyles.milestoneBox}>
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

              <div className={secStyles.sliderNavControls}>
                <button
                  type="button"
                  onClick={prevSlide}
                  className={`btn btn-secondary btn-icon ${secStyles.sliderArrowBtn}`}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className={`btn btn-secondary btn-icon ${secStyles.sliderArrowBtn}`}
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

