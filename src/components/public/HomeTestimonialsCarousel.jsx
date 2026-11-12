'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Badge } from '@/components/common/UiPrimitives';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import { PublicSectionHeader } from '@/components/public/PublicPrimitives';
import styles from '@/modules/public/PublicHome.module.css';

function getVisibleSlidesCount(viewportWidth) {
  if (viewportWidth <= 640) return 1;
  if (viewportWidth <= 1024) return 2;
  return 3;
}

export function HomeTestimonialsCarousel({ testimonials = [] }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  useEffect(() => {
    const syncBreakpoint = () => {
      const nextCount = getVisibleSlidesCount(window.innerWidth);
      setVisibleCount(nextCount);
      setActiveIndex((prev) => Math.min(prev, Math.max(0, testimonials.length - nextCount)));
    };

    syncBreakpoint();
    window.addEventListener('resize', syncBreakpoint);
    return () => window.removeEventListener('resize', syncBreakpoint);
  }, [testimonials.length]);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);
  const clampedIndex = Math.min(activeIndex, maxIndex);
  const totalStops = maxIndex + 1;

  const goPrev = () => setActiveIndex((prev) => Math.max(0, prev - 1));
  const goNext = () => setActiveIndex((prev) => Math.min(maxIndex, prev + 1));

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || !e.changedTouches || e.changedTouches.length === 0) return;
    const dx = touchStartXRef.current - e.changedTouches[0].clientX;
    const dy = (touchStartYRef.current ?? e.changedTouches[0].clientY) - e.changedTouches[0].clientY;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) goNext();
      else goPrev();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
  };

  if (!testimonials.length) return null;

  return (
    <div
      className={styles.carouselShell}
      role="region"
      aria-roledescription="carousel"
      aria-label="Student testimonials"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.carouselHeaderRow}>
        <div className={styles.carouselHeadingWrap}>
          <PublicSectionHeader
            eyebrow="Learner Stories"
            title="Consistent daily preparation beats last-minute cramming."
            subtitle="Verified candidate journeys from learners who built their target score with IELTS Ultimate."
          />
        </div>

        <div className={styles.carouselControls}>
          <button
            type="button"
            className={styles.carouselNavBtn}
            onClick={goPrev}
            disabled={clampedIndex === 0}
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={18} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className={styles.carouselNavBtn}
            onClick={goNext}
            disabled={clampedIndex >= maxIndex}
            aria-label="Next testimonials"
          >
            <ChevronRight size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div
        className={styles.carouselViewport}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(calc(-${clampedIndex} * ((100% + var(--carousel-gap)) / var(--carousel-cols))))`,
          }}
        >
          {testimonials.map((item) => (
            <div key={item.name} className={styles.carouselSlide}>
              <article className={styles.testimonialCard}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <SafeAvatar src={item.avatar} name={item.name} size={48} />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                            lineHeight: 1.25,
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.35,
                            marginTop: 2,
                          }}
                        >
                          {item.designation || item.role}
                        </div>
                      </div>
                    </div>
                    <Quote
                      size={20}
                      strokeWidth={1.65}
                      aria-hidden="true"
                      style={{ color: 'var(--border-strong)', flexShrink: 0 }}
                    />
                  </div>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.62,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 8,
                    paddingTop: 14,
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <Badge variant="yellow">{item.score}</Badge>
                  <Badge variant="purple">{item.gain}</Badge>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {totalStops > 1 && (
        <div className={styles.carouselFooter}>
          <div className={styles.carouselDots} role="tablist" aria-label="Testimonial slides">
            {Array.from({ length: totalStops }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={clampedIndex === idx}
                aria-label={`Show testimonial set ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={`${styles.carouselDot} ${clampedIndex === idx ? styles.carouselDotActive : ''}`}
              />
            ))}
          </div>

          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Showing {clampedIndex + 1}–{Math.min(testimonials.length, clampedIndex + visibleCount)} of {testimonials.length} stories
          </span>
        </div>
      )}
    </div>
  );
}
