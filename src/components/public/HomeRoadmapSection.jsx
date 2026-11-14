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
} from 'lucide-react';
import styles from './PublicLayout.module.css';

const ROADMAP_STEPS = [
  {
    step: '01',
    label: 'STEP 01',
    title: 'Prepare for IELTS',
    desc: 'Learn with 115 courses, AI feedback, and a Smart Study Planner built around your target band.',
    icon: Smartphone,
    pinPos: { x: 140, y: 240 },
    position: 'below', // text below the road
    connector: { x1: 140, y1: 260, x2: 140, y2: 375 },
    cardPos: { left: 40, top: 385 },
    href: '/login?mode=signup',
  },
  {
    step: '02',
    label: 'STEP 02',
    title: 'Take an IELTS Prediction',
    desc: 'Sit a full prediction test to see exactly where you stand and what still needs work.',
    icon: TrendingUp,
    pinPos: { x: 410, y: 370 },
    position: 'above', // text above the road
    connector: { x1: 410, y1: 350, x2: 410, y2: 245 },
    cardPos: { left: 310, top: 25 },
    href: '/services/prediction-test',
  },
  {
    step: '03',
    label: 'STEP 03',
    title: 'Take the Real Test & Score',
    desc: 'Walk into exam day confident and earn the IELTS band score you have been aiming for.',
    icon: Award,
    pinPos: { x: 680, y: 240 },
    position: 'below', // text below the road
    connector: { x1: 680, y1: 260, x2: 680, y2: 375 },
    cardPos: { left: 580, top: 385 },
    href: '/mock-test',
  },
  {
    step: '04',
    label: 'STEP 04',
    title: 'Prepare Your Documents',
    desc: 'Scholarship, university, immigration, or Working Holiday Visa — we help you get every document right.',
    icon: FileText,
    pinPos: { x: 950, y: 370 },
    position: 'above', // text above the road
    connector: { x1: 950, y1: 350, x2: 950, y2: 245 },
    cardPos: { left: 850, top: 25 },
    href: '/resources/study-planner',
  },
  {
    step: '05',
    label: 'STEP 05',
    title: 'Reach Your Goal',
    desc: 'Study abroad, migrate, or land the opportunity you dreamed of. You made it — and we cheered you on.',
    icon: Trophy,
    pinPos: { x: 1200, y: 240 },
    position: 'below', // text below the road
    connector: { x1: 1200, y1: 260, x2: 1200, y2: 375 },
    cardPos: { left: 1070, top: 385 },
    href: '/about',
    isGoal: true,
  },
];

export function HomeRoadmapSection() {
  const [activeStep, setActiveStep] = useState('02');

  return (
    <section className={styles.sectionSpace} style={{ backgroundColor: '#FAF9F5', padding: '60px 0 80px' }}>
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
              marginBottom: 14,
              letterSpacing: '0.02em',
            }}
          >
            Your Journey
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
            Your Roadmap to <span style={{ color: '#8867B8' }}>Reach Your Goal</span>
          </h2>
          <p
            style={{
              color: 'var(--text-secondary, #5F5E5B)',
              fontSize: '1.02rem',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Five clear steps, from your first practice test to the day you achieve your dream.
            <br />
            We walk the whole road with you.
          </p>
        </div>

        {/* Desktop Infographic SVG Flow */}
        <div className="roadmap-desktop-wrap" style={{ position: 'relative', width: '100%', maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ position: 'relative', width: '100%', height: 600 }}>
            {/* SVG Wavy Road & Dotted Connectors */}
            <svg
              viewBox="0 0 1320 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            >
              {/* Dotted Vertical Connector Lines */}
              {ROADMAP_STEPS.map((s) => (
                <line
                  key={`line-${s.step}`}
                  x1={s.connector.x1}
                  y1={s.connector.y1}
                  x2={s.connector.x2}
                  y2={s.connector.y2}
                  stroke="#C4B5FD"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Thick Purple Highway Track */}
              <path
                d="M 140 240 C 240 240, 300 370, 410 370 C 520 370, 570 240, 680 240 C 790 240, 840 370, 950 370 C 1060 370, 1100 240, 1200 240"
                stroke="#8867B8"
                strokeWidth="26"
                strokeLinecap="round"
                fill="none"
              />

              {/* Inner White Dashed Track */}
              <path
                d="M 140 240 C 240 240, 300 370, 410 370 C 520 370, 570 240, 680 240 C 790 240, 840 370, 950 370 C 1060 370, 1100 240, 1200 240"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeDasharray="8 10"
                strokeLinecap="round"
                fill="none"
              />

              {/* Step Pins on Road */}
              {ROADMAP_STEPS.map((s) => {
                const isSelected = activeStep === s.step;
                if (s.isGoal) {
                  // Final Yellow Destination Pin
                  return (
                    <g
                      key={s.step}
                      transform={`translate(${s.pinPos.x}, ${s.pinPos.y - 12})`}
                      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                      onClick={() => setActiveStep(s.step)}
                    >
                      <circle cx="0" cy="0" r="20" fill="#F6BD28" stroke="#FFFFFF" strokeWidth="3" />
                      {/* Trophy icon inside yellow pin */}
                      <path
                        d="M -7 -6 L 7 -6 L 5 1 C 4 4 1 5 -0 5 C -1 5 -4 4 -5 1 Z"
                        fill="#202020"
                      />
                      <path
                        d="M -2 5 L 2 5 L 3 8 L -3 8 Z"
                        fill="#202020"
                      />
                      <line x1="-5" y1="9" x2="5" y2="9" stroke="#202020" strokeWidth="1.5" />
                    </g>
                  );
                }

                return (
                  <g
                    key={s.step}
                    transform={`translate(${s.pinPos.x}, ${s.pinPos.y})`}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    onClick={() => setActiveStep(s.step)}
                  >
                    {isSelected && (
                      <circle
                        r="22"
                        fill="none"
                        stroke="#8867B8"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        opacity="0.8"
                      />
                    )}
                    <circle
                      r="16"
                      fill="#8867B8"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                    />
                    <text
                      textAnchor="middle"
                      dy="4.5"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="800"
                      fontFamily="var(--font-sans, system-ui)"
                    >
                      {s.step}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Step Infographics: Open Icon + Text Units (Matching Screenshot 2) */}
            {ROADMAP_STEPS.map((s) => {
              const Icon = s.icon;
              const isSelected = activeStep === s.step;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  style={{
                    position: 'absolute',
                    left: `${(s.cardPos.left / 1320) * 100}%`,
                    top: s.cardPos.top,
                    width: 210,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  {/* Purple Rounded Square Icon Box */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      backgroundColor: '#8867B8',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(136, 103, 184, 0.25)',
                      marginBottom: 10,
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Step Label */}
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#8867B8',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {s.label}
                  </div>

                  {/* Step Title */}
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#202020',
                      lineHeight: 1.3,
                      marginBottom: 6,
                    }}
                  >
                    {s.title}
                  </div>

                  {/* Step Description */}
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary, #5F5E5B)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Flowing Sequence */}
        <div className="roadmap-mobile-wrap" style={{ display: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', paddingLeft: 24 }}>
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: 14,
                bottom: 14,
                width: 2,
                background: 'repeating-linear-gradient(to bottom, #8867B8, #8867B8 6px, transparent 6px, transparent 12px)',
              }}
            />
            {ROADMAP_STEPS.map((s) => {
              const Icon = s.icon;
              const isSelected = activeStep === s.step;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  style={{
                    position: 'relative',
                    background: '#FFFFFF',
                    border: `1px solid ${isSelected ? '#8867B8' : 'var(--border, #E2DDD1)'}`,
                    borderRadius: 12,
                    padding: '16px 18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: -24,
                      top: 16,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: s.isGoal ? '#F6BD28' : '#8867B8',
                      color: s.isGoal ? '#202020' : '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #FFFFFF',
                    }}
                  >
                    {s.step}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8867B8' }}>{s.label}</span>
                    <Icon size={16} color="#8867B8" />
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#202020', marginBottom: 4 }}>{s.title}</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #5F5E5B)', margin: 0, lineHeight: 1.45 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 980px) {
          .roadmap-desktop-wrap {
            display: none !important;
          }
          .roadmap-mobile-wrap {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
