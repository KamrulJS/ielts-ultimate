'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Lock,
  UserCheck,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  DEMO_ADMIN_CREDENTIALS,
  DEMO_STUDENT_CREDENTIALS,
  isRoleAuthorized,
  sanitizeNextPath,
} from '@/lib/auth';
import { Badge } from '@/components/common/UiPrimitives';

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const app = useApp?.() || {};
  const hydrated = app.hydrated ?? false;
  const auth = useMemo(
    () => app.auth || { isAuthenticated: false, role: null },
    [app.auth]
  );
  const loginWithCredentials = app.loginWithCredentials || (() => ({ success: false }));
  const registerStudent = app.registerStudent || (() => ({ success: false }));
  const logout = app.logout || (() => {});

  const initialModeParam = searchParams?.get('mode');
  const initialRoleParam = searchParams?.get('role');
  const rawNext = searchParams?.get('next');

  const [tab, setTab] = useState(
    initialRoleParam === 'admin'
      ? 'admin'
      : initialModeParam === 'signup'
      ? 'signup'
      : 'student'
  );

  // Sign-in form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Sign-up form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTarget, setRegTarget] = useState('7.5');
  const [regTrack, setRegTrack] = useState('Academic');

  const [errorMsg, setErrorMsg] = useState('');

  // Redirect cleanly if user already holds valid role for destination
  useEffect(() => {
    if (!hydrated || !auth?.isAuthenticated) return;
    const expectedRole = tab === 'admin' || initialRoleParam === 'admin' ? 'admin' : 'student';
    if (isRoleAuthorized(auth, expectedRole)) {
      const safeNext = sanitizeNextPath(rawNext, expectedRole === 'admin' ? '/admin' : '/dashboard');
      const dest = expectedRole === 'admin' ? (safeNext.startsWith('/admin') ? safeNext : '/admin') : safeNext;
      router.replace(dest);
    }
  }, [hydrated, auth, tab, initialRoleParam, rawNext, router]);

  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const expectedRole = tab === 'admin' ? 'admin' : 'student';
    const result = loginWithCredentials({ email, password, expectedRole });
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    const defaultDest = expectedRole === 'admin' ? '/admin' : '/dashboard';
    const safeNext = sanitizeNextPath(rawNext, defaultDest);
    const dest = expectedRole === 'admin' ? (safeNext.startsWith('/admin') ? safeNext : '/admin') : safeNext;
    router.replace(dest);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const result = registerStudent({
      name: regName,
      email: regEmail,
      password: regPassword,
      targetBand: regTarget,
      track: regTrack,
    });
    if (!result.ok) {
      setErrorMsg(result.error);
      return;
    }
    router.replace(sanitizeNextPath(rawNext, '/dashboard'));
  };

  const fillDemo = (role) => {
    setErrorMsg('');
    if (role === 'admin') {
      setEmail(DEMO_ADMIN_CREDENTIALS.email);
      setPassword(DEMO_ADMIN_CREDENTIALS.password);
    } else {
      setEmail(DEMO_STUDENT_CREDENTIALS.email);
      setPassword(DEMO_STUDENT_CREDENTIALS.password);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px clamp(14px, 3vw, 28px)',
      }}
    >
      {/* Top Minimal Header */}
      <div
        style={{
          maxWidth: 1080,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.08rem',
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              backgroundColor: 'var(--dark-section)',
              color: 'var(--accent-yellow)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} strokeWidth={2.4} />
          </span>
          <span>IELTS Ultimate</span>
        </Link>

        <Link href="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to Website
        </Link>
      </div>

      {/* Centered Auth Card */}
      <div style={{ maxWidth: 480, width: '100%', margin: '32px auto' }}>
        <div className="card" style={{ padding: 'clamp(20px, 3.5vw, 30px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <Badge variant={tab === 'admin' ? 'dark' : 'yellow'}>
                {tab === 'admin' ? 'Restricted Admin Access' : tab === 'signup' ? 'Free Student Account' : 'Student Workspace Login'}
              </Badge>
              {rawNext && (
                <span className="text-xs text-muted">Destination: <code>{sanitizeNextPath(rawNext)}</code></span>
              )}
            </div>
            <h1 className="h2" style={{ fontSize: '1.45rem' }}>
              {tab === 'admin'
                ? 'Sign in to Admin Console'
                : tab === 'signup'
                ? 'Create your free study account'
                : 'Sign in to continue studying'}
            </h1>
            <p className="text-xs text-muted" style={{ marginTop: 4 }}>
              {tab === 'admin'
                ? 'Separate administrator credentials are required to open platform management tools.'
                : 'Access your Study Planner, Mock Simulations, Vocabulary decks, Writing & Speaking tools.'}
            </p>
          </div>

          {/* Auth Mode Tabs */}
          <div className="tabs-list" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <button
              type="button"
              onClick={() => { setTab('student'); setErrorMsg(''); }}
              className={`tab-trigger ${tab === 'student' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '7px 8px', fontSize: '0.78rem' }}
            >
              Student Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setErrorMsg(''); }}
              className={`tab-trigger ${tab === 'signup' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '7px 8px', fontSize: '0.78rem' }}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => { setTab('admin'); setErrorMsg(''); }}
              className={`tab-trigger ${tab === 'admin' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '7px 8px', fontSize: '0.78rem' }}
            >
              Admin Login
            </button>
          </div>

          {hydrated && auth?.isAuthenticated && (
            <div className="card-warm card-compact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="text-xs">
                Signed in as <strong>{auth.name || auth.email}</strong> ({auth.role})
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>
                Switch Account
              </button>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="text-xs"
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--error-soft)',
                color: 'var(--error)',
                border: '1px solid rgba(217, 91, 85, 0.25)',
                fontWeight: 600,
              }}
            >
              {errorMsg}
            </div>
          )}

          {tab === 'signup' ? (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field-group">
                <label className="field-label" htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  required
                  className="input"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Alex Mercer"
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  className="input"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alex@example.com"
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="reg-pass">Password (min 6 characters)</label>
                <input
                  id="reg-pass"
                  type="password"
                  required
                  minLength={6}
                  className="input"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a password"
                />
              </div>
              <div className="grid-2" style={{ gap: 10 }}>
                <div className="field-group">
                  <label className="field-label" htmlFor="reg-track">IELTS Module</label>
                  <select
                    id="reg-track"
                    className="select"
                    value={regTrack}
                    onChange={(e) => setRegTrack(e.target.value)}
                  >
                    <option value="Academic">Academic</option>
                    <option value="General Training">General Training</option>
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="reg-target">Target Band</label>
                  <select
                    id="reg-target"
                    className="select"
                    value={regTarget}
                    onChange={(e) => setRegTarget(e.target.value)}
                  >
                    {['6.5', '7.0', '7.5', '8.0', '8.5'].map((b) => (
                      <option key={b} value={b}>Band {b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
                <UserCheck size={16} /> Create Free Account &amp; Enter Dashboard
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field-group">
                <label className="field-label" htmlFor="login-email">
                  {tab === 'admin' ? 'Admin Email' : 'Student Email'}
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tab === 'admin' ? DEMO_ADMIN_CREDENTIALS.email : DEMO_STUDENT_CREDENTIALS.email}
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="login-pass">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-pass"
                    type={showPass ? 'text' : 'password'}
                    required
                    className="input"
                    style={{ paddingRight: 40 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPass((v) => !v)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-secondary)',
                      padding: 4,
                    }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                <Lock size={15} /> {tab === 'admin' ? 'Enter Admin Console' : 'Sign In to Dashboard'} <ArrowRight size={15} />
              </button>

              {/* Predefined Demo Credentials Box for Testing */}
              <div className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span className="text-xs" style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    {tab === 'admin' ? <ShieldCheck size={13} /> : <Sparkles size={13} />}
                    {tab === 'admin' ? 'Demo Admin Credentials' : 'Demo Student Credentials'}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                    onClick={() => fillDemo(tab)}
                  >
                    Fill Demo Credentials
                  </button>
                </div>
                <div className="text-xs text-muted" style={{ fontFamily: 'var(--font-mono)', lineHeight: 1.5, wordBreak: 'break-all' }}>
                  Email: {tab === 'admin' ? DEMO_ADMIN_CREDENTIALS.email : DEMO_STUDENT_CREDENTIALS.email}
                  <br />
                  Pass: {tab === 'admin' ? DEMO_ADMIN_CREDENTIALS.password : DEMO_STUDENT_CREDENTIALS.password}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="text-xs text-muted" style={{ textAlign: 'center' }}>
        IELTS Ultimate • Frontend Demo Authentication &amp; Role Access Control
      </div>
    </div>
  );
}

