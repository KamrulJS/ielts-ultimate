'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  HelpCircle,
  Flag,
  Clock,
  ArrowRight,
} from 'lucide-react';
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
    id: 'reading',
    label: 'Reading Practice',
    title: 'Academic 3-Passage Reading Exam Interface',
    image: '/images/platform/reading-simulation.png',
    timer: '59:45',
    module: 'Reading Passage 1',
    link: '/practice/reading',
  },
  {
    id: 'listening',
    label: 'Listening Practice',
    title: 'Authentic 4-Section IELTS Listening Audio Interface',
    image: '/images/platform/listening-simulation.png',
    timer: '32:10',
    module: 'Listening Section 1',
    link: '/practice/listening',
  },
  {
    id: 'ai-examiner',
    label: 'AI Examiner',
    title: 'Official Rubric Evaluation Studio',
    image: '/images/platform/writing-examiner.png',
    timer: 'Instant',
    module: 'Rubric Evaluator',
    link: '/resources/ai-examiner',
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
    <section
      className={styles.sectionSpace}
      style={{
        backgroundColor: '#FAF9F5',
        padding: '64px 0 76px',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 28px' }}>
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
            Inside the Platform
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
            Built to feel like <span style={{ color: '#8867B8' }}>the real exam</span>
          </h2>
          <p style={{ color: 'var(--text-secondary, #5F5E5B)', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
            Every screen is designed to mirror the real IELTS computer-delivered interface so test day feels familiar, not frightening.
          </p>
        </div>

        {/* Square Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 28,
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab.id === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  borderRadius: 0,
                  padding: '9px 18px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #8867B8' : '1px solid var(--border, #E2DDD1)',
                  backgroundColor: isActive ? '#FEF6DD' : '#FFFFFF',
                  color: isActive ? '#202020' : '#4A4A4A',
                  boxShadow: isActive ? '0 2px 8px rgba(136, 103, 184, 0.15)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Large Platform Preview Container (~90% container width, no excess padding) */}
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border, #E2DDD1)',
            borderRadius: 0,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: '#FAF9F5',
              borderBottom: '1px solid var(--border, #E2DDD1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: 'var(--text-secondary, #5F5E5B)',
              fontWeight: 600,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                <ChevronLeft size={16} /> Simulation
              </span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: '#202020', fontWeight: 700 }}>IELTS COMPLETE ACADEMIC TEST</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: '#8867B8', fontWeight: 700 }}>{activeTab.module}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  border: '1px solid var(--border, #E2DDD1)',
                  borderRadius: 0,
                  padding: '4px 10px',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#202020',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Clock size={13} color="#8867B8" />
                <span>{activeTab.timer}</span>
              </span>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 0, padding: '5px 12px', fontSize: '0.78rem' }}
              >
                <HelpCircle size={13} /> Help
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 0, padding: '5px 12px', fontSize: '0.78rem' }}
              >
                <Flag size={13} /> Report
              </button>

              <Link
                href={activeTab.link}
                className="btn btn-primary btn-sm"
                style={{
                  borderRadius: 0,
                  padding: '5px 14px',
                  fontSize: '0.78rem',
                  backgroundColor: '#8867B8',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>Launch Tool</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Genuine 1440x900 Screenshot (Full Width with Native Aspect Ratio) */}
          <div style={{ position: 'relative', width: '100%', backgroundColor: '#FFFFFF', lineHeight: 0 }}>
            <Image
              src={activeTab.image}
              alt={activeTab.title}
              width={1440}
              height={900}
              quality={95}
              priority
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Footer Bar with Status and Item Numbers */}
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: '#FAF9F5',
              borderTop: '1px solid var(--border, #E2DDD1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--text-secondary, #5F5E5B)',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 0, backgroundColor: '#10B981', display: 'inline-block' }} />
              <span style={{ fontWeight: 600 }}>All changes saved &amp; synchronized</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                <span
                  key={num}
                  style={{
                    width: 24,
                    height: 24,
                    border: '1px solid var(--border, #E2DDD1)',
                    borderRadius: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: num === 1 ? 700 : 500,
                    backgroundColor: num === 1 ? '#FEF6DD' : '#FFFFFF',
                    color: num === 1 ? '#202020' : 'var(--text-secondary, #5F5E5B)',
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
