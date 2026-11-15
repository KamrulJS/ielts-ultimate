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
import secStyles from './HomeInsidePlatformSection.module.css';

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
    <section className={secStyles.sectionWrapper}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={secStyles.headerContainer}>
          <span className={secStyles.eyebrowBadge}>
            Inside the Platform
          </span>
          <h2 className={secStyles.sectionHeading}>
            Built to feel like <span className={secStyles.headingHighlight}>the real exam</span>
          </h2>
          <p className={secStyles.sectionDesc}>
            Every screen is designed to mirror the real IELTS computer-delivered interface so test day feels familiar, not frightening.
          </p>
        </div>

        {/* Square Filter Tabs */}
        <div className={secStyles.filterTabs}>
          {TABS.map((tab) => {
            const isActive = activeTab.id === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`${secStyles.tabButton} ${isActive ? secStyles.tabButtonActive : ''}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Large Platform Preview Container (~90% container width, no excess padding) */}
        <div className={secStyles.previewContainer}>
          {/* Header Bar */}
          <div className={secStyles.topBar}>
            <div className={secStyles.breadcrumbWrap}>
              <span className={secStyles.crumbSimulation}>
                <ChevronLeft size={16} /> Simulation
              </span>
              <span className={secStyles.crumbDivider}>/</span>
              <span className={secStyles.crumbTestName}>IELTS COMPLETE ACADEMIC TEST</span>
              <span className={secStyles.crumbDivider}>/</span>
              <span className={secStyles.crumbModuleName}>{activeTab.module}</span>
            </div>

            <div className={secStyles.actionsWrap}>
              <span className={secStyles.timerBox}>
                <Clock size={13} color="#8867B8" />
                <span>{activeTab.timer}</span>
              </span>

              <button
                type="button"
                className={`btn btn-secondary btn-sm ${secStyles.headerButton}`}
              >
                <HelpCircle size={13} /> Help
              </button>

              <button
                type="button"
                className={`btn btn-secondary btn-sm ${secStyles.headerButton}`}
              >
                <Flag size={13} /> Report
              </button>

              <Link
                href={activeTab.link}
                className={`btn btn-accent btn-sm ${secStyles.launchLink}`}
              >
                <span>Launch Tool</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Genuine 1440x900 Screenshot (Full Width with Native Aspect Ratio) */}
          <div className={secStyles.screenshotWrap}>
            <Image
              src={activeTab.image}
              alt={activeTab.title}
              width={1440}
              height={900}
              quality={95}
              priority
              className={secStyles.screenshotImage}
            />
          </div>

          {/* Footer Bar with Status and Item Numbers */}
          <div className={secStyles.footerBar}>
            <div className={secStyles.syncStatus}>
              <span className={secStyles.syncIndicator} />
              <span className={secStyles.syncText}>All changes saved &amp; synchronized</span>
            </div>

            <div className={secStyles.questionTabs}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                <span
                  key={num}
                  className={`${secStyles.questionTile} ${num === 1 ? secStyles.questionTileActive : secStyles.questionTileInactive}`}
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
