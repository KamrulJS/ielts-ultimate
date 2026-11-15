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
      className={`${styles.sectionSpace} ${styles.home_section_1}`}
      
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.home_div_2}>
          <span
            className={styles.home_span_3}
          >
            Inside the Platform
          </span>
          <h2
            className={styles.home_h2_4}
          >
            Built to feel like <span className={styles.home_span_5}>the real exam</span>
          </h2>
          <p className={styles.home_p_6}>
            Every screen is designed to mirror the real IELTS computer-delivered interface so test day feels familiar, not frightening.
          </p>
        </div>

        {/* Square Filter Tabs */}
        <div
          className={styles.home_div_7}
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
                  border: isActive ? '1px solid #E5AC1A' : '1px solid var(--border, #E2DDD1)',
                  backgroundColor: isActive ? '#F6BD28' : '#FFFFFF',
                  color: '#202020',
                  boxShadow: isActive ? '0 2px 10px rgba(246, 189, 40, 0.28)' : 'none',
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
          className={styles.home_div_8}
        >
          {/* Header Bar */}
          <div
            className={styles.home_div_9}
          >
            <div className={styles.home_div_10}>
              <span className={styles.home_span_11}>
                <ChevronLeft size={16} /> Simulation
              </span>
              <span className={styles.home_span_12}>/</span>
              <span className={styles.home_span_13}>IELTS COMPLETE ACADEMIC TEST</span>
              <span className={styles.home_span_12}>/</span>
              <span className={styles.home_span_14}>{activeTab.module}</span>
            </div>

            <div className={styles.home_div_15}>
              <span
                className={styles.home_span_16}
              >
                <Clock size={13} color="#8867B8" />
                <span>{activeTab.timer}</span>
              </span>

              <button
                type="button"
                className={`btn btn-secondary btn-sm ${styles.home_button_17}`}
                
              >
                <HelpCircle size={13} /> Help
              </button>

              <button
                type="button"
                className={`btn btn-secondary btn-sm ${styles.home_button_17}`}
                
              >
                <Flag size={13} /> Report
              </button>

              <Link
                href={activeTab.link}
                className={`btn btn-accent btn-sm ${styles.home_link_18}`}
                
              >
                <span>Launch Tool</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Genuine 1440x900 Screenshot (Full Width with Native Aspect Ratio) */}
          <div className={styles.home_div_19}>
            <Image
              src={activeTab.image}
              alt={activeTab.title}
              width={1440}
              height={900}
              quality={95}
              priority
              className={styles.home_image_20}
            />
          </div>

          {/* Footer Bar with Status and Item Numbers */}
          <div
            className={styles.home_div_21}
          >
            <div className={styles.home_div_22}>
              <span className={styles.home_span_23} />
              <span className={styles.home_span_24}>All changes saved &amp; synchronized</span>
            </div>

            <div className={styles.home_div_25}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                <span
                  key={num}
                  style={{
                    width: 24,
                    height: 24,
                    border: num === 1 ? '1px solid #E5AC1A' : '1px solid var(--border, #E2DDD1)',
                    borderRadius: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: num === 1 ? 700 : 500,
                    backgroundColor: num === 1 ? '#F6BD28' : '#FFFFFF',
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
