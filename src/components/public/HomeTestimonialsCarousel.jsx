'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const startXRef = useRef(0);
  const currentDragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const isHorizontalSwipeRef = useRef(null);

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

  const goPrev = useCallback(() => setActiveIndex((prev) => Math.max(0, prev - 1)), []);
  const goNext = useCallback(() => setActiveIndex((prev) => Math.min(maxIndex, prev + 1)), [maxIndex]);

  // Desktop Mouse Drag Handling
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // left click only
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    currentDragOffsetRef.current = 0;
    setIsDragging(true);
    setDragOffset(0);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const diff = e.clientX - startXRef.current;
      if (Math.abs(diff) > 5) {
        hasDraggedRef.current = true;
      }
      // Apply rubber-band dampening at extremes
      let boundedDiff = diff;
      if ((clampedIndex === 0 && diff > 0) || (clampedIndex >= maxIndex && diff < 0)) {
        boundedDiff = diff * 0.25;
      }
      currentDragOffsetRef.current = boundedDiff;
      setDragOffset(boundedDiff);
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      const offset = currentDragOffsetRef.current;
      currentDragOffsetRef.current = 0;
      setDragOffset(0);

      const threshold = 55; // minimum px to change slide
      if (offset < -threshold) {
        goNext();
      } else if (offset > threshold) {
        goPrev();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [clampedIndex, maxIndex, goNext, goPrev]);

  // Mobile Touch Handling with vertical scroll preservation
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
    currentDragOffsetRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (touchStartXRef.current === null || !e.touches || e.touches.length === 0) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const dx = currentX - touchStartXRef.current;
    const dy = currentY - (touchStartYRef.current ?? currentY);

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        isHorizontalSwipeRef.current = Math.abs(dx) > Math.abs(dy);
      }
    }

    if (isHorizontalSwipeRef.current) {
      let boundedDiff = dx;
      if ((clampedIndex === 0 && dx > 0) || (clampedIndex >= maxIndex && dx < 0)) {
        boundedDiff = dx * 0.25;
      }
      currentDragOffsetRef.current = boundedDiff;
      setDragOffset(boundedDiff);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null) return;
    const offset = currentDragOffsetRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isHorizontalSwipeRef.current = null;
    currentDragOffsetRef.current = 0;
    setDragOffset(0);

    const threshold = 40;
    if (offset < -threshold) {
      goNext();
    } else if (offset > threshold) {
      goPrev();
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
            title={
              <span>
                Consistent daily preparation beats <span style={{ color: '#8867B8' }}>last-minute cramming.</span>
              </span>
            }
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
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
          touchAction: 'pan-y',
        }}
      >
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(calc(-${clampedIndex} * ((100% + var(--carousel-gap)) / var(--carousel-cols)) + ${dragOffset}px))`,
            transition: isDragging || dragOffset !== 0 ? 'none' : 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {testimonials.map((item) => (
            <div key={item.name} className={styles.carouselSlide}>
              <article className={styles.testimonialCard} style={{ borderRadius: 0 }}>
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
                  <span
                    style={{
                      borderRadius: 0,
                      backgroundColor: '#FEF6DD',
                      color: '#8A6100',
                      border: '1px solid rgba(246, 189, 40, 0.4)',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.score}
                  </span>
                  <span
                    style={{
                      borderRadius: 0,
                      backgroundColor: '#F1E8FF',
                      color: '#8867B8',
                      border: '1px solid rgba(136, 103, 184, 0.25)',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.gain}
                  </span>
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
                style={{ borderRadius: 0 }}
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
