'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';

export function QuestionNavigator({
  questions = [],
  answers = {},
  bookmarkedIds = [],
  activeIndex = 0,
  onSelect,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        padding: '12px 14px',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {questions.map((q, idx) => {
        const answered = Boolean(answers[q.id] && String(answers[q.id]).trim());
        const isCurrent = idx === activeIndex;
        const isFlagged = bookmarkedIds.includes(q.id);

        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelect?.(idx)}
            title={`Question ${q.number} (${q.typeLabel})`}
            style={{
              position: 'relative',
              width: 34,
              height: 34,
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 700,
              border: isCurrent
                ? '2px solid var(--dark-section)'
                : answered
                ? '1px solid var(--success)'
                : '1px solid var(--border)',
              backgroundColor: isCurrent
                ? 'var(--dark-section)'
                : answered
                ? 'var(--success-soft)'
                : 'var(--surface)',
              color: isCurrent
                ? '#FFFFFF'
                : answered
                ? 'var(--success)'
                : 'var(--text-primary)',
            }}
          >
            {q.number}
            {isFlagged && (
              <Bookmark
                size={9}
                fill="var(--accent-yellow)"
                color="var(--accent-yellow)"
                style={{ position: 'absolute', top: 2, right: 2 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

