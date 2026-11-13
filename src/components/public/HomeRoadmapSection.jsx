'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  TrendingUp,
  Award,
  FileText,
  Trophy,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import homeStyles from '@/modules/public/PublicHome.module.css';
import styles from './PublicLayout.module.css';

const ROADMAP_STEPS = [
  {
    step: '01',
    label: 'STEP 01',
    title: 'Prepare for IELTS',
    desc: 'Learn with 115+ courses, AI feedback, and a Smart Study Planner built around your target band.',
    icon: Smartphone,
    pinPos: { x: 120, y: 190 },
    cardPos: { left: 40, top: 270 },
    href: '/login?mode=signup',
  },
  {
    step: '02',
    label: 'STEP 02',
    title: 'Take an IELTS Prediction',
    desc: 'Sit a full prediction test to see exactly where you stand and what still needs work.',
    icon: TrendingUp,
    pinPos: { x: 380, y: 310 },
    cardPos: { left: 290, top: 40 },
    href: '/services/prediction-test',
  },
  {
    step: '03',
    label: 'STEP 03',
    title: 'Take the Real Test & Score',
    desc: 'Walk into exam day confident and earn the IELTS band score you have been aiming for.',
    icon: Award,
    pinPos: { x: 650, y: 190 },
    cardPos: { left: 560, top: 270 },
    href: '/mock-test',
  },
  {
    step: '04',
    label: 'STEP 04',
    title: 'Prepare Your Documents',
    desc: 'Scholarship, university, immigration, or Working Holiday Visa — we help you get every document right.',
    icon: FileText,
    pinPos: { x: 920, y: 310 },
    cardPos: { left: 830, top: 40 },
    href: '/resources/study-planner',
  },
  {
    step: '05',
    label: 'STEP 05',
    title: 'Reach Your Goal',
    desc: 'Study abroad, migrate, or land the opportunity you dreamed of. You made it — and we cheered you on.',
    icon: Trophy,
    pinPos: { x: 1180, y: 190 },
    cardPos: { left: 1060, top: 270 },
    href: '/about',
    isGoal: true,
  },
];

export function HomeRoadmapSection() {
  const [activeStep, setActiveStep] = useState('02');

  return (
    <section className={styles.sectionSpace} style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className={styles.container}>
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 36px' }}>
          <span
            className="badge badge-purple"
            style={{ borderRadius: 0, padding: '4px 10px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 10, display: 'inline-flex' }}
          >
            Your Journey
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, margin: '8px 0 14px', lineHeight: 1.2 }}>
            Your Roadmap to <span style={{ color: 'var(--accent-purple)' }}>Reach Your Goal</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Five clear steps, from your first practice test to the day you achieve your dream. We walk the whole road with you.
          </p>
        </div>

        {/* Desktop Interactive SVG Journey Path */}
        <div className={homeStyles.roadmapDesktopView}>
          <div style={{ position: 'relative', width: '100%', height: 490 }}>
            {/* SVG Wavy Road */}
            <svg
              viewBox="0 0 1300 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            >
              {/* Outer Purple Road Glow & Stroke */}
              <path
                d="M 120 200 C 220 200, 260 320, 380 320 C 500 320, 530 200, 650 200 C 770 200, 800 320, 920 320 C 1040 320, 1070 200, 1180 200"
                stroke="#8867B8"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
              />
              {/* Inner White Dashed Track */}
              <path
                d="M 120 200 C 220 200, 260 320, 380 320 C 500 320, 530 200, 650 200 C 770 200, 800 320, 920 320 C 1040 320, 1070 200, 1180 200"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeDasharray="8 10"
                strokeLinecap="round"
                fill="none"
              />

              {/* Connected Milestone Pin Markers */}
              {ROADMAP_STEPS.map((s) => {
                const isSelected = activeStep === s.step;
                const pinColor = s.isGoal ? '#F6BD28' : '#8867B8';
                return (
                  <g
                    key={s.step}
                    transform={`translate(${s.pinPos.x}, ${s.pinPos.y})`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveStep(s.step)}
                  >
                    {/* Pulsing ring on active */}
                    {isSelected && (
                      <circle
                        r="24"
                        fill="none"
                        stroke={pinColor}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        opacity="0.8"
                      />
                    )}
                    {/* Pin shape */}
                    <circle
                      r="17"
                      fill={pinColor}
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                    />
                    <text
                      textAnchor="middle"
                      dy="5"
                      fill={s.isGoal ? '#202020' : '#FFFFFF'}
                      fontSize="11"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                    >
                      {s.step}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Alternating Step Info Cards (2 Above, 3 Below) */}
            {ROADMAP_STEPS.map((s) => {
              const Icon = s.icon;
              const isSelected = activeStep === s.step;
              return (
                <div
                  key={s.step}
                  className={`${homeStyles.roadmapStepItem} ${isSelected ? homeStyles.roadmapStepItemActive : ''}`}
                  style={{
                    left: `${(s.cardPos.left / 1300) * 100}%`,
                    top: s.cardPos.top,
                  }}
                  onClick={() => setActiveStep(s.step)}
                >
                  <div className={homeStyles.roadmapCardBox}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className={homeStyles.roadmapStepNumber}>{s.label}</span>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 0,
                          backgroundColor: s.isGoal ? 'var(--accent-yellow-soft)' : 'var(--accent-purple-soft)',
                          color: s.isGoal ? 'var(--accent-yellow-hover)' : 'var(--accent-purple)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${s.isGoal ? 'rgba(246, 189, 40, 0.4)' : 'rgba(136, 103, 184, 0.3)'}`,
                        }}
                      >
                        <Icon size={14} />
                      </span>
                    </div>
                    <div className={homeStyles.roadmapStepTitle}>{s.title}</div>
                    <p className={homeStyles.roadmapStepDesc}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Flowing Sequence */}
        <div className={homeStyles.roadmapMobileView}>
          <div className={homeStyles.roadmapMobileTimelineLine} />
          {ROADMAP_STEPS.map((s) => {
            const Icon = s.icon;
            const isSelected = activeStep === s.step;
            return (
              <div
                key={s.step}
                className={homeStyles.roadmapMobileStep}
                style={{
                  borderColor: isSelected ? 'var(--accent-purple)' : 'var(--border)',
                }}
                onClick={() => setActiveStep(s.step)}
              >
                <div
                  className={homeStyles.roadmapMobilePin}
                  style={{
                    backgroundColor: s.isGoal ? 'var(--accent-yellow)' : 'var(--accent-purple)',
                    color: s.isGoal ? '#202020' : '#FFFFFF',
                  }}
                >
                  {s.step}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={homeStyles.roadmapStepNumber}>{s.label}</span>
                  <Icon size={16} style={{ color: 'var(--accent-purple)' }} />
                </div>
                <div className={homeStyles.roadmapStepTitle}>{s.title}</div>
                <p className={homeStyles.roadmapStepDesc}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

