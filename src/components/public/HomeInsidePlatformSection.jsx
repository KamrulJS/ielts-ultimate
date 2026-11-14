'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  HelpCircle,
  Flag,
  Pause,
  ArrowRight,
} from 'lucide-react';
import styles from './PublicLayout.module.css';

const TABS = [
  { id: 'simulation', label: 'Simulation Test' },
  { id: 'writing', label: 'AI Writing Examiner' },
  { id: 'speaking', label: 'AI Speaking Examiner' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'courses', label: 'Courses' },
];

export function HomeInsidePlatformSection() {
  const [activeTab, setActiveTab] = useState('speaking');
  const [notes, setNotes] = useState('');

  return (
    <section className={styles.sectionSpace} style={{ padding: '70px 0 80px', backgroundColor: '#FAF9F5' }}>
      <div className={styles.container}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 36px' }}>
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
            Every screen is designed to mirror the real IELTS interface so test day feels familiar, not frightening.
          </p>
        </div>

        {/* 5 Filter Tabs (Pill Buttons Matching Screenshot 4) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 36,
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  borderRadius: '9999px',
                  padding: '10px 22px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #8867B8' : '1px solid #E2DDD1',
                  backgroundColor: isActive ? '#8867B8' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#4A4A4A',
                  boxShadow: isActive ? '0 4px 14px rgba(136, 103, 184, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Exam Screen Showcase Container */}
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2DDD1',
            borderRadius: 16,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.07)',
            overflow: 'hidden',
          }}
        >
          {activeTab === 'speaking' ? (
            /* Authentic Speaking Screen matching Screenshot 4 */
            <div>
              {/* Screen Top Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 24px',
                  borderBottom: '1px solid #EDE8DF',
                  backgroundColor: '#FAF9F5',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#5F5E5B', fontWeight: 600 }}>
                  <ChevronLeft size={16} />
                  <span>Simulation</span>
                  <span style={{ color: '#202020', fontWeight: 700 }}>IELTS WIST COMPLETE ACADEMIC TEST 4</span>
                  <span style={{ color: '#888' }}>/</span>
                  <span style={{ color: '#8867B8' }}>Speaking</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      border: '1px solid #E2DDD1',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#202020',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    29:51
                  </div>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#5F5E5B',
                      cursor: 'pointer',
                    }}
                  >
                    Help
                  </button>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#5F5E5B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <Flag size={13} />
                    <span>Report</span>
                  </button>
                  <button
                    type="button"
                    style={{
                      backgroundColor: '#8867B8',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 18px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Submit test
                  </button>
                </div>
              </div>

              {/* Sub-bar: Part 1, Part 2, Part 3 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  padding: '10px 32px',
                  borderBottom: '1px solid #EDE8DF',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  backgroundColor: '#FFFFFF',
                }}
              >
                <span style={{ color: '#707070', cursor: 'pointer' }}>Part 1</span>
                <span
                  style={{
                    color: '#8867B8',
                    borderBottom: '2px solid #8867B8',
                    paddingBottom: 4,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Part 2
                </span>
                <span style={{ color: '#707070', cursor: 'pointer' }}>Part 3</span>
              </div>

              {/* Exam Content Area */}
              <div style={{ padding: '32px 36px', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  {/* Yellow Circle Number */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#FEF3C7',
                      border: '2px solid #F59E0B',
                      color: '#B45309',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    1
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Prompt Box */}
                    <div
                      style={{
                        border: '1px solid #E5E7EB',
                        borderRadius: 12,
                        padding: '24px 28px',
                        backgroundColor: '#FFFFFF',
                        marginBottom: 24,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800, color: '#1F2937' }}>
                          Describe a person you like.
                        </h3>
                        <div
                          style={{
                            backgroundColor: '#8867B8',
                            color: '#FFFFFF',
                            borderRadius: '9999px',
                            padding: '4px 12px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            cursor: 'pointer',
                          }}
                        >
                          <Pause size={12} fill="#FFFFFF" />
                          <span>Pause</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.92rem', color: '#4B5563', margin: '0 0 8px', fontWeight: 600 }}>
                        You should say:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 20, color: '#4B5563', fontSize: '0.88rem', lineHeight: 1.8 }}>
                        <li>who this person is</li>
                        <li>how you know them</li>
                        <li>what they are like</li>
                        <li>and explain why you like this person</li>
                      </ul>
                    </div>

                    {/* Preparation Notes Box */}
                    <div
                      style={{
                        border: '1px solid #E5E7EB',
                        borderRadius: 12,
                        padding: '18px 22px',
                        backgroundColor: '#F9FAFB',
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                        Notes (preparation)
                      </div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Jot down a few ideas before you start speaking..."
                        rows={3}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          resize: 'none',
                          fontSize: '0.86rem',
                          color: '#1F2937',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    <div style={{ marginTop: 12, fontSize: '0.78rem', color: '#9CA3AF' }}>
                      Preparation time: 01:00 · Speaking time: up to 02:00
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Examination Footer Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 24px',
                  borderTop: '1px solid #EDE8DF',
                  backgroundColor: '#FAF9F5',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                  <span>All changes saved</span>
                </div>

                {/* 13 Question Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (
                    <div
                      key={num}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        border: num === 1 ? '1.5px solid #8867B8' : '1px solid #D1D5DB',
                        backgroundColor: num === 1 ? '#FAF5FF' : '#FFFFFF',
                        color: num === 1 ? '#8867B8' : '#4B5563',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Previews for other tabs */
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ maxWidth: 900, margin: '0 auto', overflow: 'hidden', borderRadius: 8, border: '1px solid #E2DDD1' }}>
                <Image
                  src={
                    activeTab === 'simulation'
                      ? '/images/platform/full-simulation.png'
                      : activeTab === 'writing'
                      ? '/images/platform/writing-examiner.png'
                      : activeTab === 'dashboard'
                      ? '/images/platform/dashboard.png'
                      : '/images/platform/courses.png'
                  }
                  alt={`IELTS WIST ${activeTab} preview`}
                  width={900}
                  height={500}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
