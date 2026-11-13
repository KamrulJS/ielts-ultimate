'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  CalendarCheck,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Layers,
  Target,
  Video,
  FileText,
  GraduationCap,
  ArrowUpRight,
  ChevronDown,
  BookOpenText,
  PenTool,
  Headphones,
  Mic,
} from 'lucide-react';
import { Badge } from '@/components/common/UiPrimitives';

const PUBLIC_ICONS = {
  Compass,
  CalendarCheck,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Layers,
  Target,
  Video,
  FileText,
  GraduationCap,
  BookOpenText,
  PenTool,
  Headphones,
  Mic,
};

export function PublicIcon({ name, size = 16, strokeWidth = 1.85, style }) {
  const Icon = PUBLIC_ICONS[name] || Sparkles;
  return <Icon size={size} strokeWidth={strokeWidth} style={style} />;
}

export function PublicSectionHeader({ eyebrow, title, subtitle, align = 'left' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: align === 'center' ? 760 : 720,
        margin: align === 'center' ? '0 auto 32px' : '0 0 28px',
        textAlign: align,
        alignItems: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      {eyebrow && <Badge variant="purple">{eyebrow}</Badge>}
      <h2 className="section-heading">
        {title}
      </h2>
      {subtitle && (
        <p className="body-text">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PublicFaqAccordion({ items = [] }) {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={item.q} className="card card-compact">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                textAlign: 'left',
                fontWeight: 700,
                fontSize: '1.02rem',
                lineHeight: 1.4,
                color: 'var(--text-primary)',
              }}
            >
              <span>{item.q}</span>
              <ChevronDown
                size={18}
                style={{
                  flexShrink: 0,
                  color: 'var(--text-secondary)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.18s ease',
                }}
              />
            </button>
            {isOpen && (
              <p
                className="body-text"
                style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}
              >
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PublicCtaBanner({
  badge = 'Start Free Today',
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel = 'Browse Live Free Classes',
  secondaryHref = '/live-classes',
}) {
  return (
    <section
      data-animate="reveal"
      className="card-dark"
      style={{
        padding: 'clamp(24px, 3.2vw, 38px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 22,
      }}
    >
      <div style={{ maxWidth: 660, minWidth: 0 }}>
        <Badge variant="yellow">{badge}</Badge>
        <h2 className="subheading" style={{ color: '#FFFFFF', marginTop: 12, marginBottom: 8 }}>
          {title}
        </h2>
        <p className="body-text" style={{ color: '#C9C6BC' }}>
          {description}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link href={primaryHref} className="btn btn-accent">
          {primaryLabel} <ArrowUpRight size={16} />
        </Link>
        {secondaryLabel && (
          <Link
            href={secondaryHref}
            className="btn"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: '#FFFFFF',
              borderColor: 'var(--dark-border)',
            }}
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

export function HeroArtworkGraphic({ theme = 'light' }) {
  if (theme === 'light') {
    return (
      <svg viewBox="0 0 120 84" width="120" height="84" aria-hidden="true">
        <rect x="16" y="18" width="46" height="58" rx="6" fill="#FFFFFF" stroke="#202020" strokeWidth="1.8" />
        <line x1="25" y1="30" x2="53" y2="30" stroke="#8867B8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="25" y1="40" x2="50" y2="40" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="25" y1="49" x2="46" y2="49" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="84" cy="46" r="20" fill="#F6BD28" stroke="#202020" strokeWidth="1.8" />
        <path d="M76 46 L82 52 L93 40" fill="none" stroke="#202020" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (theme === 'yellow') {
    return (
      <svg viewBox="0 0 120 84" width="120" height="84" aria-hidden="true">
        <circle cx="62" cy="54" r="32" fill="none" stroke="#202020" strokeWidth="1.6" />
        <ellipse cx="62" cy="54" rx="14" ry="32" fill="none" stroke="#202020" strokeWidth="1.4" />
        <line x1="30" y1="54" x2="94" y2="54" stroke="#202020" strokeWidth="1.4" />
        <path d="M35 38 Q62 46 89 38" fill="none" stroke="#202020" strokeWidth="1.4" />
        <path d="M35 70 Q62 62 89 70" fill="none" stroke="#202020" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 84" width="120" height="84" aria-hidden="true">
      <rect x="44" y="16" width="32" height="62" rx="3" fill="#F6BD28" stroke="#202020" strokeWidth="1.6" />
      <polygon points="44,16 60,4 76,16" fill="#FAF9F5" stroke="#202020" strokeWidth="1.6" />
      <circle cx="60" cy="34" r="8" fill="#FFFFFF" stroke="#202020" strokeWidth="1.6" />
      <line x1="60" y1="34" x2="60" y2="29" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="60" y1="34" x2="64" y2="36" stroke="#202020" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="52" y1="52" x2="52" y2="72" stroke="#202020" strokeWidth="1.4" />
      <line x1="60" y1="52" x2="60" y2="72" stroke="#202020" strokeWidth="1.4" />
      <line x1="68" y1="52" x2="68" y2="72" stroke="#202020" strokeWidth="1.4" />
    </svg>
  );
}

