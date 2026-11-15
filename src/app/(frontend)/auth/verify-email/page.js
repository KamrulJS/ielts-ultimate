'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { resendVerificationEmail } from '@/lib/auth';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [resending, setResending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setFeedback({ ok: false, message: 'Please enter a valid email address.' });
      return;
    }
    setResending(true);
    setFeedback(null);
    try {
      const res = await resendVerificationEmail(email.trim());
      setFeedback({
        ok: res.ok,
        message: res.ok
          ? 'A fresh verification link has been dispatched to your email.'
          : res.error || 'Failed to dispatch email. Please try again later.',
      });
    } catch (err) {
      setFeedback({ ok: false, message: err.message || 'An unexpected error occurred.' });
    } finally {
      setResending(false);
    }
  };

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
          maxWidth: 480,
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
              width: 56,
              height: 56,
              backgroundColor: '#FEF6DD',
              border: '1px solid rgba(246, 189, 40, 0.5)',
              color: '#8867B8',
              borderRadius: 0,
              marginBottom: 16,
            }}
          >
            <Mail size={28} />
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
              marginBottom: 10,
              borderRadius: 0,
            }}
          >
            <Sparkles size={12} />
            Verification Link Dispatched
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#202020',
              margin: '0 0 8px 0',
            }}
          >
            Check Your Email
          </h1>

          <p
            style={{
              fontSize: '0.86rem',
              color: '#5C584E',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {email ? (
              <>
                We sent a secure activation link to <strong>{email}</strong>.
              </>
            ) : (
              'We sent a secure activation link to your registered email address.'
            )}
            {' '}Click the link to verify your account and set your password.
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#FAF9F5',
            border: '1px solid #E2DDD1',
            padding: '14px 16px',
            fontSize: '0.78rem',
            color: '#7A756B',
            lineHeight: 1.45,
            marginBottom: 20,
            borderRadius: 0,
          }}
        >
          <strong>Notice:</strong> If the link does not appear in your inbox within 60 seconds, check your spam or junk folder. The verification link remains valid for 24 hours.
        </div>

        {feedback && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '10px 14px',
              marginBottom: 18,
              fontSize: '0.8rem',
              backgroundColor: feedback.ok ? '#FEF6DD' : '#FDE8E8',
              border: `1px solid ${feedback.ok ? '#F6BD28' : '#F87171'}`,
              color: feedback.ok ? '#202020' : '#B91C1C',
              borderRadius: 0,
            }}
          >
            {feedback.ok ? (
              <CheckCircle2 size={16} color="#15803D" style={{ flexShrink: 0, marginTop: 1 }} />
            ) : (
              <AlertCircle size={16} color="#B91C1C" style={{ flexShrink: 0, marginTop: 1 }} />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!emailParam && (
            <div>
              <label
                htmlFor="resend-email"
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
                Account Email
              </label>
              <input
                id="resend-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. learner@domain.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.88rem',
                  border: '1px solid #D6D0C4',
                  borderRadius: 0,
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={resending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: '#FEF6DD',
              border: '1px solid #F6BD28',
              color: '#202020',
              fontWeight: 700,
              fontSize: '0.88rem',
              padding: '11px 18px',
              borderRadius: 0,
              cursor: resending ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            <span>{resending ? 'Dispatching New Link...' : 'Resend Verification Link'}</span>
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid #E2DDD1', paddingTop: 18 }}>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#8867B8',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading verification details...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

