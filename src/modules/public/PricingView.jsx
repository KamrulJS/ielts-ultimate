'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter Practice',
    badge: 'Free Forever',
    price: '$0',
    period: 'forever',
    desc: 'Essential diagnostic tests and basic practice to gauge your baseline.',
    cta: 'Start Free',
    ctaHref: '/login?mode=signup',
    featured: false,
    features: [
      '1 Full IELTS Diagnostic Simulation',
      '5 AI Writing Evaluator submissions',
      'Daily Vocabulary Flashcard deck',
      'General Community Forum access',
      'Standard Band Score prediction',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Academic / GT',
    badge: 'Most Popular',
    price: '$29',
    period: '/ month',
    desc: 'The complete AI-powered preparation suite for students targeting Band 7.0+.',
    cta: 'Get Pro Access',
    ctaHref: '/login?mode=signup&plan=pro',
    featured: true,
    features: [
      'Unlimited Full Simulation Mocks',
      'Unlimited AI Writing Examiner (Task 1 & 2)',
      'Unlimited AI Speaking Examiner with Audio',
      'Adaptive Smart Study Plan & Streak Tracker',
      'Topic-by-topic Lexical Lab & Collocations',
      'Detailed 4-Criteria Rubric Breakdown',
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate AI + Live',
    badge: 'All-Inclusive',
    price: '$69',
    period: '/ month',
    desc: 'Full platform access plus live mentor workshops and personalized 1-on-1 reviews.',
    cta: 'Join Ultimate Cohort',
    ctaHref: '/login?mode=signup&plan=ultimate',
    featured: false,
    features: [
      'Everything in Pro Suite',
      '2 Monthly Live Mentor Cohort Workshops',
      '24/7 AI Coach Conversational Drills',
      'Human-certified SOP & Essay Proofreading',
      'Study Abroad Readiness Guidance',
      'Target Band Guarantee Policy',
    ],
  },
];

const FAQS = [
  {
    q: 'Can I cancel or switch my plan at any time?',
    a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings with zero cancellation penalties.',
  },
  {
    q: 'How accurate is the AI Writing and Speaking evaluation?',
    a: 'Our AI Examiner runs on GPT-4o calibrated specifically against the public IELTS band descriptors. Internal evaluations maintain an average error margin of under 0.25 band.',
  },
  {
    q: 'Does IELTS WIST cater to both Academic and General Training?',
    a: 'Yes. All simulation tests, reading passages, and writing task 1 prompts have dedicated tracks for both Academic and General Training formats.',
  },
];

export function PricingView() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 20px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
        <span
          className="badge badge-purple"
          style={{ borderRadius: 0, padding: '4px 10px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, display: 'inline-flex' }}
        >
          Pricing & Plans
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, lineHeight: 1.15, margin: '8px 0 16px' }}>
          Invest in Your Target <span style={{ color: 'var(--accent-purple)' }}>IELTS Band</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Transparent, straightforward pricing with no hidden charges. Practice under authentic exam conditions with instant AI feedback.
        </p>
      </div>

      {/* Pricing Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          marginBottom: 72,
        }}
      >
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              backgroundColor: plan.featured ? 'var(--surface)' : 'var(--bg-primary)',
              border: plan.featured ? '2px solid var(--accent-purple)' : '1px solid var(--border)',
              borderRadius: 0,
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.featured ? 'var(--shadow-md)' : 'none',
            }}
          >
            {plan.featured && (
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  right: 24,
                  backgroundColor: 'var(--accent-purple)',
                  color: '#FFFFFF',
                  padding: '3px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: 0,
                }}
              >
                {plan.badge}
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{plan.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 6, minHeight: 40 }}>
                {plan.desc}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {plan.price}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                {plan.period}
              </span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {plan.features.map((feat) => (
                <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 0,
                      backgroundColor: 'var(--accent-purple-soft)',
                      color: 'var(--accent-purple)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaHref}
              className={plan.featured ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ width: '100%', borderRadius: 0, padding: '12px 18px', textAlign: 'center', justifyContent: 'center' }}
            >
              <span>{plan.cta}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 0,
          backgroundColor: 'var(--bg-secondary)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          marginBottom: 64,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 0,
              backgroundColor: 'var(--accent-yellow-soft)',
              color: 'var(--accent-yellow-hover)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid var(--accent-yellow)',
            }}
          >
            <ShieldCheck size={24} />
          </span>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Band Score Guarantee</h4>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Follow our customized Smart Study Plan consistently for 30 days. If your predicted band does not improve, request a full refund.
            </p>
          </div>
        </div>
        <Link href="/contact" className="btn btn-secondary" style={{ borderRadius: 0 }}>
          Questions? Talk to Mentor
        </Link>
      </div>

      {/* FAQ Section */}
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <h3 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 800, marginBottom: 28 }}>
          Frequently Asked Questions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((faq, i) => (
            <div
              key={faq.q}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 0,
                backgroundColor: 'var(--surface)',
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.16s ease',
                  }}
                />
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

