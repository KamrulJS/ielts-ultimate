'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Badge({ children, variant = 'neutral', className = '' }) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}

export function ProgressBar({ value = 0, variant = 'purple', small = false, showLabel = false }) {
  const safeVal = Math.max(0, Math.min(100, Number(value) || 0));
  const fillClass =
    variant === 'yellow'
      ? 'progress-fill-yellow'
      : variant === 'success'
      ? 'progress-fill-success'
      : variant === 'error'
      ? 'progress-fill-error'
      : '';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
      <div className={`progress-track ${small ? 'progress-track-sm' : ''}`}>
        <div
          data-progress="bar"
          className={`progress-fill ${fillClass}`}
          style={{ width: `${safeVal}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs" style={{ fontWeight: 600, minWidth: 34, textAlign: 'right' }}>
          {safeVal}%
        </span>
      )}
    </div>
  );
}

export function PageHeader({ title, description, breadcrumbs = [], actions = null, badge = null }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 4,
      }}
    >
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <ChevronRight size={13} />}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1 className="h1">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-muted" style={{ marginTop: 4, maxWidth: 680 }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon, dark = false, accentColor }) {
  return (
    <div
      data-animate="card"
      className={dark ? 'card-dark' : 'card'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span
          className="text-xs"
          style={{
            fontWeight: 600,
            color: dark ? '#C7C5BE' : 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
        {Icon && (
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: dark ? 'rgba(255,255,255,0.08)' : accentColor || 'var(--bg-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: dark ? 'var(--accent-yellow)' : 'var(--text-primary)',
            }}
          >
            <Icon size={16} />
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.65rem',
          fontWeight: 700,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {hint && (
        <div className="text-xs" style={{ color: dark ? '#A4A29A' : 'var(--text-secondary)' }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action = null }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <Icon size={20} />
        </div>
      )}
      <h3 className="h3">{title}</h3>
      {description && (
        <p className="text-sm text-muted" style={{ maxWidth: 420 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 6 }}>{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ rows = 3, height = 64 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height, width: '100%' }} />
      ))}
    </div>
  );
}

