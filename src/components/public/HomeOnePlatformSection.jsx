'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  Zap,
  PenTool,
  Mic,
  BookOpen,
  BarChart3,
  Calendar,
  Bookmark,
  MessageCircle,
  Dumbbell,
  Headphones,
  MessageSquareHeart,
  GraduationCap,
  Video,
  Sparkles,
  Target,
} from 'lucide-react';
import homeStyles from '@/modules/public/PublicHome.module.css';
import styles from './PublicLayout.module.css';

const PLATFORM_FEATURES = [
  { id: '1', title: 'Full Simulation Test', icon: Award, href: '/mock-test' },
  { id: '2', title: 'Instant Band Score', icon: Zap, href: '/services/prediction-test' },
  { id: '3', title: 'AI Writing Examiner', icon: PenTool, href: '/writing' },
  { id: '4', title: 'AI Speaking Examiner', icon: Mic, href: '/speaking' },
  { id: '5', title: 'Self-Paced Courses', icon: BookOpen, href: '/resources/self-paced-courses' },
  { id: '6', title: 'Progress Dashboard', icon: BarChart3, href: '/dashboard' },
  { id: '7', title: 'Study Plan', icon: Calendar, href: '/resources/study-planner' },
  { id: '8', title: 'IELTS Vocabulary', icon: Bookmark, href: '/resources/vocabulary' },
  { id: '9', title: 'IELTS Forums', icon: MessageCircle, href: '/community' },
  { id: '10', title: 'Vocabulary Drill', icon: Dumbbell, href: '/vocabulary' },
  { id: '11', title: 'Transcription Challenge', icon: Headphones, href: '/listening' },
  { id: '12', title: 'Ask WIST', icon: MessageSquareHeart, href: '/resources/ai-coach' },
  { id: '13', title: 'IELTS Online Class', icon: GraduationCap, href: '/live-classes' },
  { id: '14', title: 'Live Classes', icon: Video, href: '/live-classes' },
  { id: '15', title: 'AI Coach', icon: Sparkles, href: '/resources/ai-coach' },
  { id: '16', title: 'IELTS Prediction Test', icon: Target, href: '/services/prediction-test' },
];

export function HomeOnePlatformSection() {
  return (
    <section className={styles.sectionWarmBand} style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className={styles.container}>
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 16px' }}>
          <span
            className="badge badge-purple"
            style={{ borderRadius: 0, padding: '4px 10px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 10, display: 'inline-flex' }}
          >
            Everything You Need
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, margin: '8px 0 14px', lineHeight: 1.2 }}>
            One platform. All your <span style={{ color: 'var(--accent-purple)' }}>IELTS needs.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            From full mock tests to AI feedback to structured courses, IELTS WIST covers every corner of your IELTS preparation.
          </p>
        </div>

        {/* 16 Cards Balanced Grid */}
        <div className={homeStyles.onePlatformGrid}>
          {PLATFORM_FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={homeStyles.platformFeatureCard}
              >
                <div className={homeStyles.platformFeatureIconWrap}>
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className={homeStyles.platformFeatureTitle}>
                  {item.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

