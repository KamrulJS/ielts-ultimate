'use client';
import styles from './AuthGuard.module.css';

import React, { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { isRoleAuthorized } from '@/lib/auth';

export function AuthGuard({ requiredRole = 'student', children }) {
  const app = useApp?.() || {};
  const hydrated = app.hydrated ?? false;
  const auth = app.auth || { isAuthenticated: false, role: null };
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const authorized = isRoleAuthorized(auth, requiredRole);

  useEffect(() => {
    if (!hydrated || authorized) return;
    if (auth?.explicitLogout) {
      router.replace(requiredRole === 'admin' ? '/login?role=admin' : '/login');
      return;
    }
    const qs = searchParams?.toString();
    const fullTarget = qs ? `${pathname}?${qs}` : pathname;
    const roleParam = requiredRole === 'admin' ? '&role=admin' : '';
    router.replace(`/login?next=${encodeURIComponent(fullTarget || '/dashboard')}${roleParam}`);
  }, [hydrated, authorized, auth?.explicitLogout, pathname, searchParams, requiredRole, router]);

  if (!hydrated || !authorized) {
    return (
      <div
        className={styles.auth_div_1}
      >
        <div
          className={`card ${styles.auth_div_2}`}
          
        >
          <span
            className={styles.auth_span_3}
          >
            {hydrated ? <Lock size={20} /> : <Sparkles size={20} />}
          </span>
          <div className={styles.auth_div_4}>
            {hydrated
              ? requiredRole === 'admin'
                ? 'Administrator sign-in required'
                : 'Sign in to access your workspace'
              : 'Loading IELTS Ultimate...'}
          </div>
          <p className="text-xs text-muted">
            {hydrated
              ? 'Redirecting you to the secure login portal...'
              : 'Checking your session credentials.'}
          </p>
        </div>
      </div>
    );
  }

  return children;
}

