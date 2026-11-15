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
import secStyles from './HomeOnePlatformSection.module.css';

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
      className={`${styles.sectionWarmBand} ${styles.home_section_1}`}
      
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.home_div_2}>
          <span
            className={styles.home_span_3}
          >
            Everything You Need
          </span>
          <h2
            className={styles.home_h2_4}
          >
            One platform. All your <span className={styles.home_span_5}>IELTS needs.</span>
          </h2>
          <p className={styles.home_p_6}>
            From full mock tests to AI feedback to structured courses, IELTS Ultimate covers every corner of your IELTS preparation.
          </p>
        </div>

        {/* 5-Column Desktop Grid with Square Borders & Larger Icons */}
        <div className={secStyles.platformGrid}>
          {PLATFORM_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.id}
                href={feat.href}
                className={secStyles.platformCard}
              >
                {/* Square-bordered Larger Icon Container */}
                <div className={secStyles.iconWrap}>
                  <Icon size={26} strokeWidth={1.8} />
                </div>
                {/* Slightly larger, bold readable text */}
                <span className={secStyles.cardTitle}>
                  {feat.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
