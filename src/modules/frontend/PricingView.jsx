'use client';
import styles from './PricingView.module.css';

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
    name: 'Pro Academic',
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
    q: 'Is IELTS Ultimate dedicated exclusively to IELTS Academic?',
    a: 'Yes. IELTS Ultimate is 100% dedicated to IELTS Academic preparation, featuring authentic Cambridge Academic reading suites, Academic Task 1 visual reports, and higher education essay simulations.',
  },
];

export function PricingView() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.pric_div_1}>
      {/* Header */}
      <div className={styles.pric_div_2}>
        <span
          className={`badge badge-purple ${styles.pric_span_3}`}
          
        >
          Pricing & Plans
        </span>
        <h1 className={styles.pric_h1_4}>
          Invest in Your Target <span className={styles.pric_span_5}>IELTS Band</span>
        </h1>
        <p className={styles.pric_p_6}>
          Transparent, straightforward pricing with no hidden charges. Practice under authentic exam conditions with instant AI feedback.
        </p>
      </div>

      {/* Pricing Cards */}
      <div
        className={styles.pric_div_7}
      >
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planCard} ${plan.featured ? styles.planCardFeatured : styles.planCardStandard}`}
          >
            {plan.featured && (
              <div
                className={styles.planFeaturedBadge}
              >
                {plan.badge}
              </div>
            )}
            <div className={styles.pric_div_8}>
              <h3 className={styles.pric_h3_9}>{plan.name}</h3>
              <p className={styles.pric_p_10}>
                {plan.desc}
              </p>
            </div>

            <div className={styles.pric_div_11}>
              <span className={styles.pric_span_12}>
                {plan.price}
              </span>
              <span className={styles.pric_span_13}>
                {plan.period}
              </span>
            </div>

            <ul className={styles.pric_ul_14}>
              {plan.features.map((feat) => (
                <li key={feat} className={styles.pric_li_15}>
                  <span
                    className={styles.pric_span_16}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaHref}
              className={`${plan.featured ? 'btn btn-primary' : 'btn btn-secondary'} ${styles.pric_link_17}`}
              
            >
              <span>{plan.cta}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div
        className={styles.pric_div_18}
      >
        <div className={styles.pric_div_19}>
          <span
            className={styles.pric_span_20}
          >
            <ShieldCheck size={24} />
          </span>
          <div>
            <h4 className={styles.pric_h4_21}>Band Score Guarantee</h4>
            <p className={styles.pric_p_22}>
              Follow our customized Smart Study Plan consistently for 30 days. If your predicted band does not improve, request a full refund.
            </p>
          </div>
        </div>
        <Link href="/contact" className={`btn btn-secondary ${styles.pric_link_23}`} >
          Questions? Talk to Mentor
        </Link>
      </div>

      {/* FAQ Section */}
      <div className={styles.pric_div_24}>
        <h3 className={styles.pric_h3_25}>
          Frequently Asked Questions
        </h3>
        <div className={styles.pric_div_26}>
          {FAQS.map((faq, i) => (
            <div
              key={faq.q}
              className={styles.pric_div_27}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={styles.pric_button_28}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`${styles.faqChevronIcon} ${openFaq === i ? styles.faqChevronIconOpen : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className={styles.pric_div_29}>
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

