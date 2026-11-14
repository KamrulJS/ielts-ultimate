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
  Sparkles,
  GraduationCap,
  BookOpenText,
  Target,
} from 'lucide-react';
import styles from './PublicLayout.module.css';

const PLATFORM_FEATURES = [
  // Row 1 (5 items)
  { id: '1', title: 'Full Simulation Test', icon: ClipboardCheck, href: '/mock-test' },
  { id: '2', title: 'Instant Band Score', icon: Zap, href: '/services/prediction-test' },
  { id: '3', title: 'AI Writing Examiner', icon: PenTool, href: '/writing' },
  { id: '4', title: 'AI Speaking Examiner', icon: Mic, href: '/speaking' },
  { id: '5', title: 'Self-Paced Courses', icon: BookOpen, href: '/resources/self-paced-courses' },

  // Row 2 (5 items)
  { id: '6', title: 'Progress Dashboard', icon: BarChart3, href: '/dashboard' },
  { id: '7', title: 'Study Plan', icon: Calendar, href: '/resources/study-planner' },
  { id: '8', title: 'IELTS Vocabulary', icon: Smartphone, href: '/resources/vocabulary' },
  { id: '9', title: 'IELTS Forums', icon: MessageCircle, href: '/community' },
  { id: '10', title: 'Vocabulary Drill', icon: Dumbbell, href: '/vocabulary' },

  // Row 3 (5 items)
  { id: '11', title: 'Transcription Challenge', icon: Headphones, href: '/listening' },
  { id: '12', title: 'Ask Wistie AI Coach', icon: Sparkles, href: '/resources/ai-coach' },
  { id: '13', title: 'Live Classes', icon: GraduationCap, href: '/live-classes' },
  { id: '14', title: 'Academic Reading Bank', icon: BookOpenText, href: '/practice/reading' },
  { id: '15', title: 'Target Band Analytics', icon: Target, href: '/services/prediction-test' },
];

export function HomeOnePlatformSection() {
  return (
    <section
      className={styles.sectionWarmBand}
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '64px 0 76px',
        backgroundColor: '#FAF9F5',
      }}
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 36px' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#F1E8FF',
              color: '#8867B8',
              borderRadius: 0,
              padding: '6px 16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: 12,
              border: '1px solid rgba(136, 103, 184, 0.25)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
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
            From full mock tests to AI feedback to structured courses, IELTS Ultimate covers every corner of your IELTS preparation.
          </p>
        </div>

        {/* 5-Column Desktop Grid with Square Borders & Larger Icons */}
        <div className="five-column-platform-grid">
          {PLATFORM_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.id}
                href={feat.href}
                className="one-platform-card"
              >
                {/* Square-bordered Larger Icon Container */}
                <div className="one-platform-icon-wrap">
                  <Icon size={26} strokeWidth={1.8} />
                </div>
                {/* Slightly larger, bold readable text */}
                <span className="one-platform-title">
                  {feat.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .five-column-platform-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          max-width: 1240px;
          margin: 0 auto;
        }

        :global(.one-platform-card) {
          background-color: #FFFFFF;
          border: 1px solid var(--border, #E2DDD1);
          border-radius: 0px !important;
          padding: 24px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-decoration: none;
          text-align: center;
          min-height: 120px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        :global(.one-platform-card:hover) {
          background-color: #FEF6DD !important;
          border-color: #F6BD28 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(246, 189, 40, 0.15) !important;
        }

        .one-platform-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 0px !important;
          background-color: #FEF6DD;
          border: 1px solid rgba(246, 189, 40, 0.4);
          color: #202020;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        :global(.one-platform-card:hover) .one-platform-icon-wrap {
          background-color: #F6BD28 !important;
          border-color: #F6BD28 !important;
          color: #202020 !important;
        }

        .one-platform-title {
          font-size: 0.94rem;
          font-weight: 700;
          color: #202020;
          line-height: 1.35;
        }

        @media (max-width: 1100px) {
          .five-column-platform-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 680px) {
          .five-column-platform-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
