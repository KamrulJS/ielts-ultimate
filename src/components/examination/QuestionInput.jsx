'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { Badge } from '@/components/common/UiPrimitives';

const CHOICE_TYPES = ['MCQ', 'TFNG', 'YNNG', 'MAP_LABELLING', 'MATCHING'];
const DROPDOWN_TYPES = ['MATCHING_HEADINGS', 'MATCHING_INFO', 'MATCHING_FEATURES', 'MATCHING_ENDINGS'];

export function QuestionInput({
  question,
  value = '',
  onChange,
  isBookmarked = false,
  onToggleBookmark,
}) {
  const isChoice = CHOICE_TYPES.includes(question.type);
  const isDropdown = DROPDOWN_TYPES.includes(question.type);

  return (
    <div
      className="card"
      style={{
        padding: 16,
        borderColor: value ? 'rgba(57, 150, 107, 0.35)' : 'var(--border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              backgroundColor: 'var(--bg-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {question.number}
          </span>
          <Badge variant="purple">{question.typeLabel}</Badge>
        </div>
        {onToggleBookmark && (
          <button
            type="button"
            onClick={() => onToggleBookmark(question.id)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 8px' }}
            aria-label="Bookmark question"
          >
            <Bookmark
              size={15}
              fill={isBookmarked ? 'var(--accent-yellow)' : 'none'}
              color={isBookmarked ? '#B48200' : 'var(--text-secondary)'}
            />
          </button>
        )}
      </div>

      <p style={{ fontWeight: 500, fontSize: '0.92rem', marginBottom: 12, lineHeight: 1.5 }}>
        {question.prompt}
      </p>

      {/* Choice cards (MCQ, TFNG, YNNG, Map) */}
      {isChoice && question.options && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {question.options.map((opt) => {
            const optionValue = opt.includes('.') ? opt.split('.')[0].trim() : opt;
            const selected = value === optionValue || value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(optionValue)}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: selected ? '1.5px solid var(--dark-section)' : '1px solid var(--border)',
                  backgroundColor: selected ? 'var(--accent-yellow-soft)' : 'var(--bg-primary)',
                  fontWeight: selected ? 600 : 400,
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '999px',
                    border: selected ? '5px solid var(--dark-section)' : '1.5px solid var(--text-muted)',
                    backgroundColor: '#FFFFFF',
                    flexShrink: 0,
                  }}
                />
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Matching Dropdowns */}
      {isDropdown && question.options && (
        <select
          className="select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select matching option...</option>
          {question.options.map((opt) => {
            const optVal = opt.includes('.') ? opt.split('.')[0].trim() : opt;
            return (
              <option key={opt} value={optVal}>
                {opt}
              </option>
            );
          })}
        </select>
      )}

      {/* Completion / Labelling / Short Answer Inputs */}
      {!isChoice && !isDropdown && (
        <div>
          <input
            type="text"
            className="input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your exact answer..."
          />
          <div className="text-xs text-muted" style={{ marginTop: 5 }}>
            Check word limit in the prompt above (spelling counts).
          </div>
        </div>
      )}
    </div>
  );
}

