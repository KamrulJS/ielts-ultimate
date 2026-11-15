'use client';

import React from 'react';
import { PublicNavbar } from '@/components/frontend/PublicNavbar';
import { PublicFooter } from '@/components/frontend/PublicFooter';
import styles from '@/components/frontend/PublicLayout.module.css';

export function PublicShell({ children }) {
  return (
    <div className={styles.publicWrapper}>
      <PublicNavbar />
      <main className={styles.publicMain}>{children}</main>
      <PublicFooter />
    </div>
  );
}

