'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { saveUserPassword } from '@/lib/auth-supabase';

function ResetPasswordContent() {
  const router = useRouter();

  const [sessionChecking, setSessionChecking] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuthSession() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        if (mounted) {
          setHasValidSession(true);
          setSessionChecking(false);
        }
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (accessToken) {
              const { data: setSessionData, error: setSessionErr } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });

              if (!setSessionErr && setSessionData?.session) {
                if (mounted) {
                  setHasValidSession(true);
                  setUserEmail(setSessionData.session.user?.email || '');
                  setSessionChecking(false);
                }
                return;
              }
            }
          }

          if (mounted) {
            setHasValidSession(false);
            setSessionChecking(false);
          }
          return;
        }

        if (mounted) {
          setHasValidSession(true);
          setUserEmail(session.user?.email || '');
          setSessionChecking(false);
        }
      } catch (err) {
        if (mounted) {
          setHasValidSession(false);
          setSessionChecking(false);
        }
      }
    }

    checkAuthSession();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setSaving(true);
    try {
      const res = await saveUserPassword(password);
      if (!res.ok) {
        setErrorMsg(res.error || 'Failed to update password. Your recovery link may have expired.');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.replace('/dashboard');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred while updating your password.');
      setSaving(false);
    }
  };

  if (sessionChecking) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF9F5' }}>
        <div style={{ fontSize: '0.88rem', color: '#5C584E' }}>Verifying your password recovery link...</div>
      </div>
    );
  }

  if (!hasValidSession) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#FAF9F5' }}>
        <div style={{ width: '100%', maxWidth: 460, backgroundColor: '#FFFFFF', border: '1px solid #E2DDD1', padding: '36px 30px', textAlign: 'center', borderRadius: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, backgroundColor: '#FDE8E8', color: '#B91C1C', marginBottom: 14 }}>
            <AlertCircle size={28} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '1.35rem', fontWeight: 700, margin: '0 0 10px 0', color: '#202020' }}>
            Recovery Link Expired
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#5C584E', lineHeight: 1.5, margin: '0 0 20px 0' }}>
            This password recovery link is either invalid or has expired. Please request a fresh password recovery link.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link
              href="/login"
              style={{ display: 'inline-flex', alignItems: 'center', padding: '9px 16px', backgroundColor: '#FEF6DD', border: '1px solid #F6BD28', color: '#202020', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}
            >
              Request Password Reset
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: '#FAF9F5',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2DDD1',
          padding: '36px 32px',
          borderRadius: 0,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              backgroundColor: '#FEF6DD',
              border: '1px solid rgba(246, 189, 40, 0.5)',
              color: '#8867B8',
              borderRadius: 0,
              marginBottom: 14,
            }}
          >
            <KeyRound size={26} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#F1E8FF',
              color: '#8867B8',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
              borderRadius: 0,
            }}
          >
            <ShieldCheck size={13} />
            Secure Password Recovery
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#202020',
              margin: '0 0 6px 0',
            }}
          >
            Reset Your Password
          </h1>

          <p style={{ fontSize: '0.84rem', color: '#5C584E', margin: 0, lineHeight: 1.45 }}>
            {userEmail ? (
              <>
                Create a new password for <strong>{userEmail}</strong>.
              </>
            ) : (
              'Enter and confirm your new secure password.'
            )}
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              backgroundColor: '#FDE8E8',
              border: '1px solid #F87171',
              color: '#B91C1C',
              fontSize: '0.8rem',
              marginBottom: 18,
              borderRadius: 0,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div
            style={{
              backgroundColor: '#FEF6DD',
              border: '1px solid #F6BD28',
              padding: '24px 20px',
              textAlign: 'center',
              borderRadius: 0,
            }}
          >
            <CheckCircle2 size={36} color="#15803D" style={{ margin: '0 auto 10px auto' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#202020', margin: '0 0 6px 0' }}>
              Password Reset Complete!
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#5C584E', margin: 0 }}>
              Your password has been successfully updated. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label
                htmlFor="new-password"
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#202020',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                New Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="new-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    fontSize: '0.88rem',
                    border: '1px solid #D6D0C4',
                    borderRadius: 0,
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                <button
                  type="button"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#7A756B',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#202020',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Confirm New Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    fontSize: '0.88rem',
                    border: '1px solid #D6D0C4',
                    borderRadius: 0,
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                <button
                  type="button"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirm((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#7A756B',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: '#F6BD28',
                border: '1px solid #F6BD28',
                color: '#202020',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '12px 18px',
                borderRadius: 0,
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s ease',
                marginTop: 6,
              }}
            >
              <span>{saving ? 'Updating Password...' : 'Reset Password & Enter Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading password recovery...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

