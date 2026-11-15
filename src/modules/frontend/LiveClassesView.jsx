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
} from '@/components/frontend/PublicPrimitives';
import { LiveClassHeroVisual } from '@/components/frontend/HeroVisuals';
import liveClassesData from '@/data/public/live-classes.json';
import styles from '@/components/frontend/PublicLayout.module.css';

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
      <section className={`${styles.sectionSpace} ${styles.live_section_1}`} >
        <div className={styles.container}>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span className={styles.live_span_2}>Live Free Class</span>
          </nav>

          <div className={`${styles.publicHeroTransparent} ${styles.live_div_3}`} data-animate="card" >
            <div className={styles.live_div_4}>
              <div className={styles.live_div_5}>
                <Badge variant="yellow">Free Open Webinars</Badge>
                <Badge variant="success">Live Q&amp;A + Strategy Clinics</Badge>
              </div>
              <h1 className="hero-heading">
                Join free live IELTS workshops with certified mentors—no fee required.
              </h1>
              <p className="hero-desc">
                Attend interactive live clinics covering Essay Cohesion, Cue Card Narration, Reading TFNG Speed, and Listening Academic Distractors, or watch recorded replays anytime below.
              </p>
              <div className={styles.live_div_6}>
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
          <div className={styles.live_div_7}>
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

          <div className={`grid-2 ${styles.live_div_8}`} >
            {filteredUpcoming.map((cls) => {
              const isRegistered = registeredIds.includes(cls.id);
              return (
                <div
                  key={cls.id}
                  data-animate="reveal"
                  className={`card ${styles.live_div_9}`}
                  
                >
                  <div className={styles.live_div_10}>
                    <div className={styles.live_div_11}>
                      <div className={styles.live_div_12}>
                        <Badge variant="purple">{cls.category}</Badge>
                        <Badge variant="neutral">{cls.level}</Badge>
                      </div>
                      <Badge variant={isRegistered ? 'success' : 'yellow'}>
                        {isRegistered ? 'Seat Reserved' : `${cls.seatsRemaining} seats left`}
                      </Badge>
                    </div>

                    <h3 className="h3">{cls.title}</h3>
                    <p className={`text-sm text-muted ${styles.live_p_13}`} >{cls.description}</p>

                    <div className={styles.live_div_14}>
                      <span className={styles.live_span_15}>
                        <Calendar size={13} /> {cls.dateLabel}
                      </span>
                      <span className={styles.live_span_15}>
                        <Clock size={13} /> {cls.timeLabel}
                      </span>
                      <span className={styles.live_span_15}>
                        <Video size={13} /> {cls.platform}
                      </span>
                    </div>

                    <div className="card-warm card-compact">
                      <div className={`field-label ${styles.live_div_16}`} >Session Takeaways</div>
                      <ul className={styles.live_ul_17}>
                        {cls.takeaways.map((tk) => (
                          <li key={tk} className={`text-xs ${styles.live_li_18}`} >
                            <CheckCircle2 size={12} className={styles.live_checkcircle2_19} />
                            <span>{tk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    className={styles.live_div_20}
                  >
                    <div className={styles.live_div_21}>
                      <SafeAvatar src={cls.instructor.avatar} name={cls.instructor.name} size={36} />
                      <div>
                        <div className={styles.live_div_22}>{cls.instructor.name}</div>
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
          <div className={`card ${styles.live_div_23}`} >
            <div className={styles.live_div_24}>
              <div className={styles.live_div_25}>Get notified when next week&apos;s free clinics open</div>
              <p className={`text-xs text-muted ${styles.live_p_26}`} >
                Receive weekly live schedule reminders and handout sheets directly to your inbox.
              </p>
            </div>
            {alertSaved ? (
              <Badge variant="success"><CheckCircle2 size={13} /> Schedule alerts enabled</Badge>
            ) : (
              <form onSubmit={handleAlertSubmit} className={styles.live_form_27}>
                <input
                  type="email"
                  required
                  className={`input ${styles.live_input_28}`}
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  
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
        <div className={`${styles.container} ${styles.live_div_29}`} >
          <PublicSectionHeader
            eyebrow="Previous Class Replays"
            title="Watch highlights from recent free clinics"
            subtitle="Explore recorded session outlines and practical breakdowns while waiting for the next live broadcast."
          />

          <div className={`grid-2 ${styles.live_div_8}`} >
            {liveClassesData.recordedReplays.map((rep) => (
              <div key={rep.id} className={`card ${styles.live_div_9}`} >
                <div className={styles.live_div_10}>
                  <div
                    className={`card-dark card-compact ${styles.live_div_30}`}
                    
                  >
                    <div className={styles.live_div_31}>
                      <span
                        className={styles.live_span_32}
                      >
                        <Play size={16} fill="#202020" />
                      </span>
                      <div className={styles.live_div_33}>
                        <Badge variant="yellow">{rep.category}</Badge>
                        <div className={`text-xs ${styles.live_div_34}`} >
                          {rep.duration} • <Users size={11} className={styles.live_users_35} /> {rep.views}
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
                  <p className={`text-xs text-muted ${styles.live_p_13}`} >{rep.summary}</p>
                </div>

                <div className={styles.live_div_36}>
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
          <form onSubmit={handleConfirmRegistration} className={styles.live_form_37}>
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
            <div className={styles.live_div_38}>
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
          <div className={styles.live_form_37}>
            <p className={`text-sm text-muted ${styles.live_p_39}`} >{replayModal.summary}</p>
            <div className="card-warm card-compact">
              <div className={`field-label ${styles.live_div_16}`} >Key Clinic Takeaways</div>
              <ul className={styles.live_ul_40}>
                {replayModal.highlights.map((h) => (
                  <li key={h} className={`text-xs ${styles.live_li_41}`} >
                    <CheckCircle2 size={13} className={styles.live_checkcircle2_42} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.live_div_43}>
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

