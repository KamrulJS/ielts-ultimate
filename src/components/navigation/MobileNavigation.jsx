'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Zap, ArrowUpRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BrandLogo, SidebarNavContent } from './AppSidebar';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import styles from './Sidebar.module.css';

export function MobileNavigation() {
  const { mobileNavOpen, setMobileNavOpen, profile } = useApp();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    if (mobileNavOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [mobileNavOpen, setMobileNavOpen]);

  if (!mobileNavOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      <div
        onClick={() => setMobileNavOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(24, 24, 22, 0.45)',
          backdropFilter: 'blur(2px)',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: 280,
          maxWidth: '85vw',
          height: '100%',
          backgroundColor: 'var(--bg-primary)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        <div className={styles.brandRow}>
          <BrandLogo />
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <SidebarNavContent onNavigate={() => setMobileNavOpen(false)} />

        <div className={styles.sidebarFooter}>
          <div className={styles.upgradeCard}>
            <span className={styles.upgradeIconBadge}>
              <Zap size={14} strokeWidth={2.5} />
            </span>
            <div className={styles.upgradeTitle}>Level up your Band with Plus</div>
            <Link
              href="/subscription"
              onClick={() => setMobileNavOpen(false)}
              className={styles.upgradeBtn}
            >
              <span>Upgrade Now</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <Link
            href="/profile"
            onClick={() => setMobileNavOpen(false)}
            className={styles.profileChip}
          >
            <SafeAvatar src={profile.avatar} name={profile.name} size={34} />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{profile.name}</div>
              <div className="text-xs text-muted">Target Band {profile.targetBand}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

