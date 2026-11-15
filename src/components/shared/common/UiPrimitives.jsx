'use client';
import styles from './UiPrimitives.module.css';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Badge({ children, variant = 'neutral', className = '', ...props }) {
  return <span className={`badge badge-${variant} ${className}`} {...props}>{children}</span>;
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
    <div className={styles.uipr_div_1}>
      <div className={`progress-track ${small ? 'progress-track-sm' : ''}`}>
        <div
          data-progress="bar"
          className={`progress-fill ${fillClass}`}
          style={{ width: `${safeVal}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs ${styles.uipr_span_2}`} >
          {safeVal}%
        </span>
      )}
    </div>
  );
}

export function PageHeader({ title, description, breadcrumbs = [], actions = null, badge = null }) {
  return (
    <div
      className={styles.uipr_div_3}
    >
      <div className={styles.uipr_div_4}>
        {breadcrumbs.length > 0 && (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <ChevronRight size={13} />}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span className={styles.uipr_span_5}>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className={styles.uipr_div_6}>
          <h1 className="h1">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className={`text-sm text-muted ${styles.uipr_p_7}`} >
            {description}
          </p>
        )}
      </div>
      {actions && <div className={styles.uipr_div_8}>{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon, dark = false, accentColor }) {
  return (
    <div
      data-animate="card"
      className={`${dark ? 'card-dark' : 'card'} ${styles.uipr_div_9}`}
      
    >
      <div className={styles.uipr_div_10}>
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
        className={styles.uipr_div_11}
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
          className={styles.uipr_div_12}
        >
          <Icon size={20} />
        </div>
      )}
      <h3 className="h3">{title}</h3>
      {description && (
        <p className={`text-sm text-muted ${styles.uipr_p_13}`} >
          {description}
        </p>
      )}
      {action && <div className={styles.uipr_div_14}>{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ rows = 3, height = 64 }) {
  return (
    <div className={styles.uipr_div_15}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height, width: '100%' }} />
      ))}
    </div>
  );
}

