'use client';

import React from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import styles from '@/components/public/PublicLayout.module.css';

export function PublicShell({ children }) {
  return (
    <div className={styles.publicWrapper}>
      <PublicNavbar />
      <main className={styles.publicMain}>{children}</main>
      <PublicFooter />
    </div>
  );
}

