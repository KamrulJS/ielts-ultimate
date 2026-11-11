'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { isRoleAuthorized } from '@/lib/auth';

export function AuthGuard({ requiredRole = 'student', children }) {
  const { hydrated, auth } = useApp();
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
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: 28,
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: 'var(--dark-section)',
              color: 'var(--accent-yellow)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {hydrated ? <Lock size={20} /> : <Sparkles size={20} />}
          </span>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>
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

