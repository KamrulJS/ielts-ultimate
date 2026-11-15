import React from 'react';

const SHARED_STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.65,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/**
 * Thin-line SVG icons for Section 01 Platform Statistics.
 * Mapped cleanly by stat label for uniform 1.65 stroke geometry.
 */
export function StatSvgIcon({ label, size = 30 }) {
  const key = String(label || '').toLowerCase();

  if (key.includes('learner')) {
    // Active Learners — dual candidate silhouette
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <circle cx="9" cy="7.5" r="3.2" />
        <path d="M3.5 19.5c0-2.9 2.46-5.2 5.5-5.2s5.5 2.3 5.5 5.2" />
        <circle cx="16.5" cy="8.5" r="2.5" />
        <path d="M16.2 14.5c2.3.3 4.3 2.1 4.3 4.7" />
      </svg>
    );
  }

  if (key.includes('mock') || key.includes('session')) {
    // Timed Mock Sessions — stopwatch & timing hand
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M9.5 3h5" />
        <path d="M12 3v3" />
        <circle cx="12" cy="13.5" r="7.5" />
        <path d="M12 13.5V9.5" />
        <path d="M12 13.5l2.8 1.9" />
        <path d="M17.8 7.8l1.4-1.4" />
      </svg>
    );
  }

  if (key.includes('module')) {
    // Structured Modules — stacked isometric curriculum layers
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M12 3.5L3.5 7.8 12 12l8.5-4.2L12 3.5z" />
        <path d="M3.5 12.2L12 16.4l8.5-4.2" />
        <path d="M3.5 16.6L12 20.8l8.5-4.2" />
      </svg>
    );
  }

  // Average Rating — faceted rating star with benchmark halo
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
      <path d="M12 3.4l2.55 5.18 5.72.83-4.14 4.03.98 5.7L12 16.45 6.89 19.14l.98-5.7-4.14-4.03 5.72-.83L12 3.4z" />
    </svg>
  );
}

/**
 * Thin-line SVG icons for Section 04 Inside the Platform Metric Tiles.
 * Handles every metric card across all 4 tabs (Simulation, AI Examiner, Planner, Vocabulary).
 */
export function MetricSvgIcon({ label, size = 26 }) {
  const key = String(label || '').toLowerCase();

  if (key.includes('listening')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M4.5 13.5v-1.5a7.5 7.5 0 0 1 15 0v1.5" />
        <rect x="3.5" y="13.5" width="3.5" height="6" rx="1.4" />
        <rect x="17" y="13.5" width="3.5" height="6" rx="1.4" />
      </svg>
    );
  }

  if (key.includes('reading')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M12 6.5c-2.2-1.4-5-1.9-7.8-1.5v13c2.8-.4 5.6.1 7.8 1.5" />
        <path d="M12 6.5c2.2-1.4 5-1.9 7.8-1.5v13c-2.8-.4-5.6.1-7.8 1.5" />
        <path d="M12 6.5v13" />
      </svg>
    );
  }

  if (key.includes('writing')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M14.5 4.5l5 5-9.5 9.5H5v-5l9.5-9.5z" />
        <path d="M12.5 6.5l5 5" />
        <path d="M4.5 20.5h15" />
      </svg>
    );
  }

  if (key.includes('speaking')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <rect x="9" y="3.5" width="6" height="10" rx="3" />
        <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
        <path d="M12 18v3" />
        <path d="M8.5 21h7" />
      </svg>
    );
  }

  if (key.includes('task response')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <circle cx="12" cy="12" r="8.2" />
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 12l5.5-5.5" />
      </svg>
    );
  }

  if (key.includes('coherence')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M10 13.5a4 4 0 0 0 5.66 0l2.83-2.83a4 4 0 0 0-5.66-5.66L11.2 6.6" />
        <path d="M14 10.5a4 4 0 0 0-5.66 0L5.51 13.3a4 4 0 0 0 5.66 5.66l1.6-1.6" />
      </svg>
    );
  }

  if (key.includes('lexical')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M12 3.5l1.9 4.5 4.6 1.9-4.6 1.9-1.9 4.5-1.9-4.5-4.6-1.9 4.6-1.9L12 3.5z" />
        <path d="M5 17.5l.8 1.7 1.7.8-1.7.8L5 22.5l-.8-1.7-1.7-.8 1.7-.8L5 17.5z" />
      </svg>
    );
  }

  if (key.includes('grammar')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <rect x="4" y="4.5" width="16" height="15" rx="2.5" />
        <path d="M8 9.5h8" />
        <path d="M8 13.5h4.5" />
        <path d="M14 14.5l1.5 1.5 3-3" />
      </svg>
    );
  }

  if (key.includes('completed')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8.5 12.2l2.3 2.4 4.8-4.9" />
      </svg>
    );
  }

  if (key.includes('daily target') || key.includes('target')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 7.5V12l3.2 2" />
      </svg>
    );
  }

  if (key.includes('readiness')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M4.5 16.5L9.5 11.5l3.5 3.5 6.5-7" />
        <path d="M15.5 8h4v4" />
      </svg>
    );
  }

  if (key.includes('week')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <rect x="4" y="5.5" width="16" height="14.5" rx="2.2" />
        <path d="M8 3.5v4" />
        <path d="M16 3.5v4" />
        <path d="M4 10h16" />
      </svg>
    );
  }

  if (key.includes('word')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <rect x="4.5" y="4.5" width="11" height="14.5" rx="2" />
        <path d="M15.5 7.5h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8" />
        <path d="M8 9.5h4" />
        <path d="M8 13h4" />
      </svg>
    );
  }

  if (key.includes('retention')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M20 12a8 8 0 1 1-2.34-5.66" />
        <path d="M20 4.5v3.8h-3.8" />
        <path d="M9.5 12.2l1.8 1.8 3.5-3.6" />
      </svg>
    );
  }

  if (key.includes('streak')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M12.6 3.5c.8 3.2-1.8 5-1.8 7.5 0 1.4.9 2.4 2 2.4 1.4 0 2.5-1.5 2.4-3.7 2.2 1.6 3.3 3.9 3.3 6.2a6.5 6.5 0 1 1-13 0c0-3.7 2.5-6.7 7.1-12.4z" />
      </svg>
    );
  }

  // Topic Packs fallback
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
      <path d="M4.5 7.5A2.5 2.5 0 0 1 7 5h3.2l1.8 2h5a2.5 2.5 0 0 1 2.5 2.5v7.5A2.5 2.5 0 0 1 17 19.5H7A2.5 2.5 0 0 1 4.5 17V7.5z" />
    </svg>
  );
}

/**
 * Thin-line SVG icons for Section 06 Expert Services cards.
 */
export function ServiceSvgIcon({ slug, size = 28 }) {
  const key = String(slug || '').toLowerCase();

  if (key.includes('prediction')) {
    // IELTS Prediction Test — calibrated band gauge & target reticle
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.5" />
        <path d="M12 19v2.5" />
        <path d="M2.5 12H5" />
        <path d="M19 12h2.5" />
      </svg>
    );
  }

  if (key.includes('online-classes')) {
    // IELTS Online Classes — live classroom display & presenter
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <rect x="3.5" y="5" width="17" height="11.5" rx="2.2" />
        <path d="M10.2 8.7l4.3 2.3-4.3 2.3V8.7z" />
        <path d="M8.5 19.5h7" />
        <path d="M12 16.5v3" />
      </svg>
    );
  }

  if (key.includes('proofreading') || key.includes('translation')) {
    // Proofreading & Translation — reviewed manuscript & pen stroke
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
        <path d="M6.5 3.8h7.8L18.5 8v11.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19.5V5.3a1.5 1.5 0 0 1 1.5-1.5z" />
        <path d="M14 3.8V8h4.2" />
        <path d="M8.5 12h7" />
        <path d="M8.5 15.5l1.6 1.5 3.4-3.3" />
      </svg>
    );
  }

  // Study Abroad Preparation — academic cap & global path
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...SHARED_STROKE}>
      <path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5z" />
      <path d="M6.5 11.7v4.8c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.8" />
      <path d="M20.5 10v5.5" />
    </svg>
  );
}

