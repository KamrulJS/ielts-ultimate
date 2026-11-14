'use client';

import React from 'react';
import Link from 'next/link';
import {
  ClipboardCheck,
  Zap,
  PenTool,
  Mic,
  BookOpen,
  BarChart3,
  Calendar,
  Smartphone,
  MessageCircle,
  Dumbbell,
  Headphones,
  MessageSquareHeart,
  GraduationCap,
} from 'lucide-react';
import styles from './PublicLayout.module.css';

const ROW1_FEATURES = [
  { id: '1', title: 'Full Simulation Test', icon: ClipboardCheck, href: '/mock-test' },
  { id: '2', title: 'Instant Band Score', icon: Zap, href: '/services/prediction-test' },
  { id: '3', title: 'AI Writing Examiner', icon: PenTool, href: '/writing' },
  { id: '4', title: 'AI Speaking Examiner', icon: Mic, href: '/speaking', highlighted: true },
  { id: '5', title: 'Self-Paced Courses', icon: BookOpen, href: '/resources/self-paced-courses' },
  { id: '6', title: 'Progress Dashboard', icon: BarChart3, href: '/dashboard' },
];

const ROW2_FEATURES = [
  { id: '7', title: 'Study Plan', icon: Calendar, href: '/resources/study-planner' },
  { id: '8', title: 'IELTS Vocabulary', icon: Smartphone, href: '/resources/vocabulary' },
  { id: '9', title: 'IELTS Forums', icon: MessageCircle, href: '/community' },
  { id: '10', title: 'Vocabulary Drill', icon: Dumbbell, href: '/vocabulary' },
  { id: '11', title: 'Transcription Challenge', icon: Headphones, href: '/listening' },
  { id: '12', title: 'Ask Wistie', icon: MessageSquareHeart, href: '/resources/ai-coach' },
];

const ROW3_FEATURES = [
  { id: '13', title: 'Live Classes', icon: GraduationCap, href: '/live-classes' },
];

export function HomeOnePlatformSection() {
  const renderCard = (feat) => {
    const Icon = feat.icon;
    return (
      <Link
        key={feat.id}
        href={feat.href}
        className="platform-feature-card"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: feat.highlighted
            ? '0 6px 20px rgba(136, 103, 184, 0.18)'
            : '0 3px 12px rgba(0, 0, 0, 0.04)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          textDecoration: 'none',
          textAlign: 'center',
          transition: 'all 0.25s ease',
          minHeight: 110,
        }}
      >
        <div
          style={{
            color: '#8867B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} strokeWidth={1.8} />
        </div>
        <span
          style={{
            fontSize: '0.86rem',
            fontWeight: 700,
            color: '#202020',
            lineHeight: 1.3,
          }}
        >
          {feat.title}
        </span>
      </Link>
    );
  };

  return (
    <section className={styles.sectionWarmBand} style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '70px 0 80px', backgroundColor: '#FFFFFF' }}>
      <div className={styles.container}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 40px' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(136, 103, 184, 0.12)',
              color: '#8867B8',
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Everything You Need
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              margin: '0 0 14px',
              lineHeight: 1.2,
              color: '#202020',
            }}
          >
            One platform. All your <span style={{ color: '#8867B8' }}>IELTS needs.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary, #5F5E5B)', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
            From full mock tests to AI feedback to structured courses, IELTS WIST covers every corner of your IELTS preparation.
          </p>
        </div>

        {/* 13-Card Grid Matching Screenshot 3 */}
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row 1: 6 Cards */}
          <div className="platform-grid-row">
            {ROW1_FEATURES.map(renderCard)}
          </div>

          {/* Row 2: 6 Cards */}
          <div className="platform-grid-row">
            {ROW2_FEATURES.map(renderCard)}
          </div>

          {/* Row 3: 1 Centered Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 175 }}>
              {ROW3_FEATURES.map(renderCard)}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .platform-grid-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        :global(.platform-feature-card:hover) {
          transform: translateY(-4px);
          border-color: #8867B8 !important;
          box-shadow: 0 10px 24px rgba(136, 103, 184, 0.18) !important;
        }

        @media (max-width: 1024px) {
          .platform-grid-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .platform-grid-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
