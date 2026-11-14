'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  User,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  DEMO_ADMIN_CREDENTIALS,
  DEMO_STUDENT_CREDENTIALS,
  REMEMBERED_IDENTIFIER_KEY,
  isRoleAuthorized,
  sanitizeNextPath,
  requestPasswordReset,
} from '@/lib/auth';
import { Badge } from '@/components/common/UiPrimitives';
import { Modal } from '@/components/common/Modal';

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

  // Sign-in form (Supports Username OR Email in the same field)
  const [identifier, setIdentifier] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return window.localStorage.getItem(REMEMBERED_IDENTIFIER_KEY) || '';
      } catch {}
    }
    return '';
  });
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign-up form (Name, Username, Email, Password, ConfirmPassword, Track, TargetBand)
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regTarget, setRegTarget] = useState('7.5');
  const [regTrack, setRegTrack] = useState('Academic');

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotFeedback, setForgotFeedback] = useState(null);

  // Redirect cleanly if user already holds valid role for destination
  useEffect(() => {
    if (!hydrated || !auth?.isAuthenticated) return;
    // If user is intentionally creating a new account, do not auto-redirect away from signup
    if (tab === 'signup' || initialModeParam === 'signup') return;
    const expectedRole = tab === 'admin' || initialRoleParam === 'admin' ? 'admin' : 'student';
    if (isRoleAuthorized(auth, expectedRole)) {
      const safeNext = sanitizeNextPath(rawNext, expectedRole === 'admin' ? '/admin' : '/dashboard');
      const dest = expectedRole === 'admin' ? (safeNext.startsWith('/admin') ? safeNext : '/admin') : safeNext;
      router.replace(dest);
    }
  }, [hydrated, auth, tab, initialRoleParam, initialModeParam, rawNext, router]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const expectedRole = tab === 'admin' ? 'admin' : 'student';
      const result = await loginWithCredentials({
        identifier: identifier.trim(),
        password,
        expectedRole,
      });

      if (!result.ok && !result.success) {
        setErrorMsg(result.error || 'Authentication failed. Please verify your credentials.');
        setLoading(false);
        return;
      }

      // Handle Remember Me
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          window.localStorage.setItem(REMEMBERED_IDENTIFIER_KEY, identifier.trim());
        } else {
          window.localStorage.removeItem(REMEMBERED_IDENTIFIER_KEY);
        }
      }

      const userRole = result.role || expectedRole;
      const defaultDest = userRole === 'admin' ? '/admin' : '/dashboard';
      const safeNext = sanitizeNextPath(rawNext, defaultDest);
      const dest = userRole === 'admin' ? (safeNext.startsWith('/admin') ? safeNext : '/admin') : safeNext;
      router.replace(dest);
    } catch {
      setErrorMsg('An unexpected authentication error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await registerStudent({
        name: regName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
        confirmPassword: regConfirmPassword,
        targetBand: regTarget,
        track: regTrack,
      });

      if (!result.ok && !result.success) {
        setErrorMsg(result.error || 'Failed to create account. Please check your information.');
        setLoading(false);
        return;
      }

      const safeNext = sanitizeNextPath(rawNext, '/dashboard');
      router.replace(safeNext);
    } catch {
      setErrorMsg('An error occurred during account registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role, useUsername = false) => {
    setErrorMsg('');
    if (role === 'admin') {
      setIdentifier(useUsername ? DEMO_ADMIN_CREDENTIALS.username : DEMO_ADMIN_CREDENTIALS.email);
      setPassword(DEMO_ADMIN_CREDENTIALS.password);
    } else {
      setIdentifier(useUsername ? DEMO_STUDENT_CREDENTIALS.username : DEMO_STUDENT_CREDENTIALS.email);
      setPassword(DEMO_STUDENT_CREDENTIALS.password);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotFeedback(null);
    try {
      const res = await requestPasswordReset({ identifier: forgotIdentifier });
      setForgotFeedback(res);
    } finally {
      setForgotLoading(false);
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
      {/* Top Header */}
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
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 0,
              backgroundColor: 'var(--dark-section)',
              color: 'var(--accent-yellow)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} strokeWidth={2.4} />
          </span>
          <span>IELTS WIST</span>
        </Link>

        <Link href="/" className="btn btn-secondary btn-sm" style={{ borderRadius: 0 }}>
          <ArrowLeft size={14} /> Back to Website
        </Link>
      </div>

      {/* Centered Auth Card */}
      <div style={{ maxWidth: 500, width: '100%', margin: '32px auto' }}>
        <div
          className="card"
          style={{
            padding: 'clamp(20px, 3.5vw, 32px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            borderRadius: 0,
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <Badge variant={tab === 'admin' ? 'dark' : 'yellow'}>
                {tab === 'admin' ? 'Restricted Admin Access' : tab === 'signup' ? 'New Student Registration' : 'Student Workspace Access'}
              </Badge>
              {rawNext && (
                <span className="text-xs text-muted">Destination: <code>{sanitizeNextPath(rawNext)}</code></span>
              )}
            </div>
            <h1 className="h2" style={{ fontSize: '1.45rem', margin: 0 }}>
              {tab === 'admin'
                ? 'Admin Console Sign In'
                : tab === 'signup'
                ? 'Create Your IELTS Account'
                : 'Sign In to Your Workspace'}
            </h1>
            <p className="text-xs text-muted" style={{ marginTop: 6, lineHeight: 1.5 }}>
              {tab === 'admin'
                ? 'Administrative credentials are required to access management consoles and test review harnesses.'
                : 'Enter your registered username or email address and password to access the IELTS preparation modules.'}
            </p>
          </div>

          {/* Auth Mode Tabs */}
          <div className="tabs-list" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <button
              type="button"
              onClick={() => { setTab('student'); setErrorMsg(''); }}
              className={`tab-trigger ${tab === 'student' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '8px 8px', fontSize: '0.8rem', borderRadius: 0 }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setErrorMsg(''); }}
              className={`tab-trigger ${tab === 'signup' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '8px 8px', fontSize: '0.8rem', borderRadius: 0 }}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => { setTab('admin'); setErrorMsg(''); }}
              className={`tab-trigger ${tab === 'admin' ? 'active' : ''}`}
              style={{ justifyContent: 'center', padding: '8px 8px', fontSize: '0.8rem', borderRadius: 0 }}
            >
              Admin
            </button>
          </div>

          {hydrated && auth?.isAuthenticated && (
            <div className="card-warm card-compact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', borderRadius: 0 }}>
              <div className="text-xs">
                Currently signed in as <strong>{auth.name || auth.username || auth.email}</strong> ({auth.role})
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={logout} style={{ borderRadius: 0 }}>
                Sign Out
              </button>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="text-xs"
              style={{
                padding: '12px 14px',
                borderRadius: 0,
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#DC2626',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN UP FORM */}
          {tab === 'signup' ? (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field-group">
                <label className="field-label" htmlFor="reg-name">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-name"
                    required
                    className="input"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Emily Watson"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="reg-username">
                  Username * <span className="text-muted" style={{ fontWeight: 400 }}>(3–20 letters, numbers, or _)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-username"
                    required
                    className="input"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. emily_watson"
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="reg-email">Email Address *</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  className="input"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. emily@domain.com"
                  style={{ borderRadius: 0 }}
                />
              </div>

              <div className="grid-2" style={{ gap: 10 }}>
                <div className="field-group">
                  <label className="field-label" htmlFor="reg-pass">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="reg-pass"
                      type={showRegPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="input"
                      style={{ paddingRight: 38, borderRadius: 0 }}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars (letters + numbers)"
                    />
                    <button
                      type="button"
                      aria-label={showRegPass ? 'Hide password' : 'Show password'}
                      onClick={() => setShowRegPass((v) => !v)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                    >
                      {showRegPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="reg-confirm">Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="reg-confirm"
                      type={showRegConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="input"
                      style={{ paddingRight: 38, borderRadius: 0 }}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                    />
                    <button
                      type="button"
                      aria-label={showRegConfirm ? 'Hide password' : 'Show password'}
                      onClick={() => setShowRegConfirm((v) => !v)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                    >
                      {showRegConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid-2" style={{ gap: 10 }}>
                <div className="field-group">
                  <label className="field-label" htmlFor="reg-track">Examination Stream</label>
                  <select
                    id="reg-track"
                    className="select"
                    value="Academic"
                    disabled
                    style={{ borderRadius: 0, backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                  >
                    <option value="Academic">IELTS Academic (Dedicated)</option>
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="reg-target">Target Band Score</label>
                  <select
                    id="reg-target"
                    className="select"
                    value={regTarget}
                    onChange={(e) => setRegTarget(e.target.value)}
                    style={{ borderRadius: 0 }}
                  >
                    {['6.5', '7.0', '7.5', '8.0', '8.5', '9.0'].map((b) => (
                      <option key={b} value={b}>Band {b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ marginTop: 6, borderRadius: 0, justifyContent: 'center' }}
              >
                <UserCheck size={16} />
                <span>{loading ? 'Creating Secure Account...' : 'Create Free Account & Start Learning'}</span>
              </button>
            </form>
          ) : (
            /* SIGN IN FORM (Username OR Email in single field) */
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field-group">
                <label className="field-label" htmlFor="login-identifier">
                  {tab === 'admin' ? 'Admin Username or Email' : 'Username or Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    className="input"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      tab === 'admin'
                        ? 'e.g. admin or admin@ieltsultimate.edu'
                        : 'e.g. emily or emily.johnson@ieltsultimate.edu'
                    }
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              <div className="field-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="field-label" htmlFor="login-pass" style={{ margin: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotIdentifier(identifier);
                      setForgotFeedback(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-purple)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    id="login-pass"
                    type={showPass ? 'text' : 'password'}
                    required
                    className="input"
                    style={{ paddingRight: 40, borderRadius: 0 }}
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
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
                />
                <label htmlFor="remember-me" className="text-xs text-muted" style={{ cursor: 'pointer', margin: 0 }}>
                  Remember my username/email on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ borderRadius: 0, justifyContent: 'center' }}
              >
                <Lock size={15} />
                <span>
                  {loading
                    ? 'Authenticating...'
                    : tab === 'admin'
                    ? 'Enter Admin Console'
                    : 'Sign In to Workspace'}
                </span>
                <ArrowRight size={15} />
              </button>

              {/* Verified Demo Credentials Box for Testing */}
              <div className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span className="text-xs" style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {tab === 'admin' ? <ShieldCheck size={14} color="#B45309" /> : <Sparkles size={14} color="var(--accent-purple)" />}
                    {tab === 'admin' ? 'Verified Admin Access' : 'Verified Student Access'}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: 0 }}
                      onClick={() => fillDemo(tab, true)}
                      title="Fill with Username"
                    >
                      Fill via Username
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: 0 }}
                      onClick={() => fillDemo(tab, false)}
                      title="Fill with Email"
                    >
                      Fill via Email
                    </button>
                  </div>
                </div>

                <div className="text-xs text-muted" style={{ fontFamily: 'var(--font-mono)', lineHeight: 1.5, wordBreak: 'break-all' }}>
                  <strong>Username:</strong> {tab === 'admin' ? DEMO_ADMIN_CREDENTIALS.username : DEMO_STUDENT_CREDENTIALS.username}
                  <br />
                  <strong>Email:</strong> {tab === 'admin' ? DEMO_ADMIN_CREDENTIALS.email : DEMO_STUDENT_CREDENTIALS.email}
                  <br />
                  <strong>Password:</strong> {tab === 'admin' ? DEMO_ADMIN_CREDENTIALS.password : DEMO_STUDENT_CREDENTIALS.password}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        open={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
        subtitle="Enter your username or email address to recover your account"
      >
        <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field-group">
            <label className="field-label" htmlFor="forgot-id">Username or Email</label>
            <input
              id="forgot-id"
              required
              className="input"
              value={forgotIdentifier}
              onChange={(e) => setForgotIdentifier(e.target.value)}
              placeholder="e.g. emily or emily.johnson@ieltsultimate.edu"
              style={{ borderRadius: 0 }}
            />
          </div>

          {forgotFeedback && (
            <div
              className="text-xs"
              style={{
                padding: '10px 12px',
                backgroundColor: forgotFeedback.ok ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                color: forgotFeedback.ok ? '#047857' : '#DC2626',
                border: `1px solid ${forgotFeedback.ok ? '#A7F3D0' : '#FECACA'}`,
                borderRadius: 0,
                lineHeight: 1.5,
              }}
            >
              {forgotFeedback.message || forgotFeedback.error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: 0 }}
              onClick={() => setForgotModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={forgotLoading}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: 0 }}
            >
              {forgotLoading ? 'Processing...' : 'Send Recovery Instructions'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="text-xs text-muted" style={{ textAlign: 'center' }}>
        IELTS WIST • Secure Authentication, PBKDF2 Password Hashing &amp; Role-Based Access Control
      </div>
    </div>
  );
}
