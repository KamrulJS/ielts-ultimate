'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  HelpCircle,
  Flag,
  Send,
  Clock,
  ArrowRight,
} from 'lucide-react';
import homeStyles from '@/modules/public/PublicHome.module.css';
import styles from './PublicLayout.module.css';

const TABS = [
  {
    id: 'simulation',
    label: 'Simulation Test',
    title: 'Full Computer-Delivered IELTS Simulation',
    image: '/images/platform/full-simulation.png',
    timer: '02:40:00',
    module: 'Full Mock Exam',
    link: '/mock-test',
  },
  {
    id: 'reading',
    label: 'Reading Simulation',
    title: 'Academic & GT Reading Passage Engine',
    image: '/images/platform/reading-simulation.png',
    timer: '59:45',
    module: 'Reading Passage 1',
    link: '/reading',
  },
  {
    id: 'listening',
    label: 'Listening Simulation',
    title: 'Audio Stream & Instant Answer Marking',
    image: '/images/platform/listening-simulation.png',
    timer: '31:20',
    module: 'Listening Section 2',
    link: '/listening',
  },
  {
    id: 'writing',
    label: 'AI Writing Examiner',
    title: 'Task 1 & Task 2 Rubric Scoring Engine',
    image: '/images/platform/writing-examiner.png',
    timer: '38:15',
    module: 'Writing Task 2',
    link: '/writing',
  },
  {
    id: 'speaking',
    label: 'AI Speaking Examiner',
    title: 'Whisper-Powered Audio Transcription & Grading',
    image: '/images/platform/speaking-examiner.png',
    timer: '14:30',
    module: 'Speaking Part 2 Cue Card',
    link: '/speaking',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    title: 'Comprehensive Progress & Analytics Studio',
    image: '/images/platform/dashboard.png',
    timer: 'Active',
    module: 'Student Analytics',
    link: '/dashboard',
  },
  {
    id: 'courses',
    label: 'Courses',
    title: 'Structured Self-Paced Video Curriculum',
    image: '/images/platform/courses.png',
    timer: 'On-Demand',
    module: 'Strategy Video Lessons',
    link: '/resources/self-paced-courses',
  },
];

export function HomeInsidePlatformSection() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <section className={styles.sectionSpace} style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className={styles.container}>
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 12px' }}>
          <span
            className="badge badge-purple"
            style={{ borderRadius: 0, padding: '4px 10px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 10, display: 'inline-flex' }}
          >
            Inside the Platform
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, margin: '8px 0 14px', lineHeight: 1.2 }}>
            Built to feel like <span style={{ color: 'var(--accent-purple)' }}>the real exam</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every screen is designed to mirror the real IELTS interface so test day feels familiar, not frightening.
          </p>
        </div>

        {/* Interactive Platform Tabs */}
        <div className={homeStyles.platformTabsRow}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`${homeStyles.platformTabBtn} ${activeTab.id === tab.id ? homeStyles.platformTabBtnActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Genuine Product Screenshot Frame (matching Screenshot 03) */}
        <div className={homeStyles.platformMockupChrome}>
          {/* Header Bar */}
          <div className={homeStyles.mockupHeaderBar}>
            <div className={homeStyles.mockupHeaderTitle}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                <ChevronLeft size={16} /> Simulation
              </span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span>IELTS WIST COMPLETE ACADEMIC TEST 4</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: 'var(--accent-purple)' }}>{activeTab.module}</span>
            </div>

            <div className={homeStyles.mockupHeaderRight}>
              <span className={homeStyles.mockupTimerBadge}>
                <Clock size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: -1 }} />
                {activeTab.timer}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 0, padding: '4px 10px', fontSize: '0.78rem' }}
              >
                <HelpCircle size={13} /> Help
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 0, padding: '4px 10px', fontSize: '0.78rem' }}
              >
                <Flag size={13} /> Report
              </button>
              <Link
                href={activeTab.link}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 0, padding: '4px 14px', fontSize: '0.78rem', backgroundColor: 'var(--accent-purple)' }}
              >
                <span>Launch Tool</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Real Application Screenshot */}
          <div className={homeStyles.mockupImgWrap}>
            <Image
              src={activeTab.image}
              alt={activeTab.title}
              width={1440}
              height={900}
              quality={90}
              className={homeStyles.mockupImg}
            />
          </div>

          {/* Test Footer Bar with Status and Item Numbers */}
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: '#FAF9F5',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 0, backgroundColor: '#39966B', display: 'inline-block' }} />
              <span>All changes saved &amp; synchronized</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                <span
                  key={num}
                  style={{
                    width: 22,
                    height: 22,
                    border: '1px solid var(--border)',
                    borderRadius: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: num === 1 ? 700 : 500,
                    backgroundColor: num === 1 ? 'var(--accent-purple-soft)' : 'var(--surface)',
                    color: num === 1 ? 'var(--accent-purple)' : 'var(--text-secondary)',
                  }}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

