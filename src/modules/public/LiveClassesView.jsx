'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  Video,
  CheckCircle2,
  Play,
  Mail,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { Badge } from '@/components/common/UiPrimitives';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import { Modal } from '@/components/common/Modal';
import {
  PublicSectionHeader,
  PublicCtaBanner,
} from '@/components/public/PublicPrimitives';
import { LiveClassHeroVisual } from '@/components/public/HeroVisuals';
import liveClassesData from '@/data/public/live-classes.json';
import styles from '@/components/public/PublicLayout.module.css';

const REG_STORAGE_KEY = 'ielts_ultimate_live_registrations_v1';

export function LiveClassesView() {
  const { showToast } = useApp();
  const rootRef = useGsapEntrance('live-classes');

  const [category, setCategory] = useState('All');
  const [registeredIds, setRegisteredIds] = useState([]);
  const [registerModalClass, setRegisterModalClass] = useState(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const [alertEmail, setAlertEmail] = useState('');
  const [alertSaved, setAlertSaved] = useState(false);

  const [replayModal, setReplayModal] = useState(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(REG_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setRegisteredIds(parsed);
        }
      } catch {}
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const persistRegistrations = (nextIds) => {
    setRegisteredIds(nextIds);
    try {
      window.localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(nextIds));
    } catch {}
  };

  const handleConfirmRegistration = (e) => {
    e.preventDefault();
    if (!registerModalClass || !regName.trim() || !regEmail.trim()) return;
    if (!registeredIds.includes(registerModalClass.id)) {
      persistRegistrations([...registeredIds, registerModalClass.id]);
    }
    showToast(`Seat reserved for "${registerModalClass.title}"`, 'success');
    setRegisterModalClass(null);
    setRegName('');
    setRegEmail('');
  };

  const handleCancelSeat = (id) => {
    persistRegistrations(registeredIds.filter((r) => r !== id));
    showToast('Free class registration cancelled', 'info');
  };

  const handleAlertSubmit = (e) => {
    e.preventDefault();
    if (!alertEmail.trim()) return;
    setAlertSaved(true);
    setAlertEmail('');
    showToast('Subscribed to upcoming free live class schedules', 'success');
  };

  const filters = ['All', 'Writing', 'Speaking', 'Reading', 'Listening'];
  const filteredUpcoming = liveClassesData.upcomingClasses.filter(
    (c) => category === 'All' || c.category === category
  );

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className={styles.sectionSpace} style={{ paddingTop: 32, paddingBottom: 36 }}>
        <div className={styles.container}>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Live Free Class</span>
          </nav>

          <div className={styles.publicHeroTransparent} data-animate="card" style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge variant="yellow">Free Open Webinars</Badge>
                <Badge variant="success">Live Q&amp;A + Strategy Clinics</Badge>
              </div>
              <h1 className="hero-heading">
                Join free live IELTS workshops with certified mentors—no fee required.
              </h1>
              <p className="hero-desc">
                Attend interactive live clinics covering Essay Cohesion, Cue Card Narration, Reading TFNG Speed, and Listening Academic Distractors, or watch recorded replays anytime below.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="#upcoming-schedule" className="btn btn-primary btn-lg">
                  Browse Upcoming Schedule
                </a>
                <a href="#recorded-replays" className="btn btn-secondary btn-lg">
                  Watch Past Session Previews
                </a>
              </div>
            </div>

            <LiveClassHeroVisual />
          </div>
        </div>
      </section>

      {/* Upcoming Schedule */}
      <section id="upcoming-schedule" className={styles.sectionWarmBand}>
        <div className={styles.container}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, marginBottom: 22 }}>
            <PublicSectionHeader
              eyebrow="Upcoming Schedule"
              title="Reserve your free live seat"
              subtitle="Classes run interactively online with limited seats so every attendee can participate in live Q&A."
            />
            <div className="filter-pills">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCategory(f)}
                  className={`filter-pill ${category === f ? 'active' : ''}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2" style={{ gap: 18 }}>
            {filteredUpcoming.map((cls) => {
              const isRegistered = registeredIds.includes(cls.id);
              return (
                <div
                  key={cls.id}
                  data-animate="reveal"
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <Badge variant="purple">{cls.category}</Badge>
                        <Badge variant="neutral">{cls.level}</Badge>
                      </div>
                      <Badge variant={isRegistered ? 'success' : 'yellow'}>
                        {isRegistered ? 'Seat Reserved' : `${cls.seatsRemaining} seats left`}
                      </Badge>
                    </div>

                    <h3 className="h3">{cls.title}</h3>
                    <p className="text-sm text-muted" style={{ lineHeight: 1.55 }}>{cls.description}</p>

                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Calendar size={13} /> {cls.dateLabel}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={13} /> {cls.timeLabel}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Video size={13} /> {cls.platform}
                      </span>
                    </div>

                    <div className="card-warm card-compact">
                      <div className="field-label" style={{ marginBottom: 6 }}>Session Takeaways</div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {cls.takeaways.map((tk) => (
                          <li key={tk} className="text-xs" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                            <span>{tk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      flexWrap: 'wrap',
                      paddingTop: 10,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <SafeAvatar src={cls.instructor.avatar} name={cls.instructor.name} size={36} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{cls.instructor.name}</div>
                        <div className="text-xs text-muted">{cls.instructor.role}</div>
                      </div>
                    </div>

                    {isRegistered ? (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleCancelSeat(cls.id)}
                      >
                        Cancel Seat
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setRegisterModalClass(cls)}
                      >
                        Register Free →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Schedule Notification Opt-in */}
          <div className="card" style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ maxWidth: 520, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>Get notified when next week&apos;s free clinics open</div>
              <p className="text-xs text-muted" style={{ marginTop: 3 }}>
                Receive weekly live schedule reminders and handout sheets directly to your inbox.
              </p>
            </div>
            {alertSaved ? (
              <Badge variant="success"><CheckCircle2 size={13} /> Schedule alerts enabled</Badge>
            ) : (
              <form onSubmit={handleAlertSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: '1 1 280px', maxWidth: 420 }}>
                <input
                  type="email"
                  required
                  className="input"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  style={{ flex: '1 1 180px', minWidth: 0 }}
                />
                <button type="submit" className="btn btn-accent btn-sm">
                  <Mail size={14} /> Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Recorded Replays */}
      <section id="recorded-replays" className={styles.sectionSpace}>
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <PublicSectionHeader
            eyebrow="Previous Class Replays"
            title="Watch highlights from recent free clinics"
            subtitle="Explore recorded session outlines and practical breakdowns while waiting for the next live broadcast."
          />

          <div className="grid-2" style={{ gap: 18 }}>
            {liveClassesData.recordedReplays.map((rep) => (
              <div key={rep.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div
                    className="card-dark card-compact"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <span
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 999,
                          backgroundColor: 'var(--accent-yellow)',
                          color: '#202020',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Play size={16} fill="#202020" />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <Badge variant="yellow">{rep.category}</Badge>
                        <div className="text-xs" style={{ color: '#C9C6BC', marginTop: 4 }}>
                          {rep.duration} • <Users size={11} style={{ display: 'inline' }} /> {rep.views}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-accent btn-sm"
                      onClick={() => setReplayModal(rep)}
                    >
                      Watch Preview
                    </button>
                  </div>

                  <h3 className="h3">{rep.title}</h3>
                  <p className="text-xs text-muted" style={{ lineHeight: 1.55 }}>{rep.summary}</p>
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Led by {rep.instructor}
                </div>
              </div>
            ))}
          </div>

          <PublicCtaBanner
            badge="Keep Practicing Between Sessions"
            title="Reinforce today&apos;s class with interactive simulations and drills"
            description="Open your personal Study Plan and Question-Type playbooks anytime inside IELTS Ultimate."
            primaryLabel="Open Study Planner"
            primaryHref="/study-plan"
            secondaryLabel="Explore 1-on-1 Classes"
            secondaryHref="/services/online-classes"
          />
        </div>
      </section>

      {/* Seat Registration Modal */}
      <Modal
        open={Boolean(registerModalClass)}
        onClose={() => setRegisterModalClass(null)}
        title="Reserve Your Free Live Seat"
        subtitle={registerModalClass?.title}
      >
        {registerModalClass && (
          <form onSubmit={handleConfirmRegistration} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card-warm card-compact text-xs">
              <strong>Schedule:</strong> {registerModalClass.dateLabel} • {registerModalClass.timeLabel}
              <br />
              <strong>Mentor:</strong> {registerModalClass.instructor.name}
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="live-reg-name">Full Name</label>
              <input
                id="live-reg-name"
                required
                className="input"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g., Emily Johnson"
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="live-reg-email">Email Address</label>
              <input
                id="live-reg-email"
                type="email"
                required
                className="input"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setRegisterModalClass(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm Free Registration
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Replay Outline Preview Modal */}
      <Modal
        open={Boolean(replayModal)}
        onClose={() => setReplayModal(null)}
        title={replayModal?.title}
        subtitle={`${replayModal?.category} • Led by ${replayModal?.instructor} (${replayModal?.duration})`}
      >
        {replayModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>{replayModal.summary}</p>
            <div className="card-warm card-compact">
              <div className="field-label" style={{ marginBottom: 6 }}>Key Clinic Takeaways</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {replayModal.highlights.map((h) => (
                  <li key={h} className="text-xs" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setReplayModal(null)}>
                Close
              </button>
              <Link href="/mock-test" className="btn btn-primary">
                Practise Inside Platform →
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

