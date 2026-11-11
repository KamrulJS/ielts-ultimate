'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { Badge } from '@/components/common/UiPrimitives';
import {
  PublicSectionHeader,
  PublicFaqAccordion,
} from '@/components/public/PublicPrimitives';
import { ContactHeroVisual } from '@/components/public/HeroVisuals';
import aboutContactData from '@/data/public/about-contact.json';
import styles from '@/components/public/PublicLayout.module.css';

const INQUIRY_KEY = 'ielts_ultimate_contact_tickets_v1';

export function ContactView() {
  const { showToast } = useApp();
  const searchParams = useSearchParams();
  const rootRef = useGsapEntrance('contact');
  const { contact } = aboutContactData;

  const initialTopic = searchParams?.get('topic');
  const matchedSubject =
    contact.subjects.find((s) => s.toLowerCase().includes((initialTopic || '').toLowerCase())) ||
    contact.subjects[0];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const subject = selectedSubject || matchedSubject;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || message.trim().length < 10) {
      showToast('Please complete all fields with a short message (10+ characters).', 'error');
      return;
    }

    const ticket = {
      id: `TKT-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim(),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    try {
      const prev = JSON.parse(window.localStorage.getItem(INQUIRY_KEY) || '[]');
      window.localStorage.setItem(INQUIRY_KEY, JSON.stringify([ticket, ...prev]));
    } catch {}

    setSubmittedTicket(ticket);
    setMessage('');
    showToast('Inquiry received! Reference ' + ticket.id, 'success');
  };

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className={styles.sectionSpace} style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className={styles.container}>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Contact</span>
          </nav>

          <div className={`card-warm ${styles.publicHeroGrid}`} data-animate="card" style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Badge variant="yellow" style={{ alignSelf: 'flex-start' }}>{contact.eyebrow}</Badge>
              <h1 className="hero-heading">{contact.headline}</h1>
              <p className="hero-desc">{contact.intro}</p>
            </div>

            <ContactHeroVisual />
          </div>
        </div>
      </section>

      {/* Main Contact Form + Info Cards */}
      <section className={styles.sectionWarmBand}>
        <div className={styles.container}>
          <div className="grid-2" style={{ gap: 22, alignItems: 'start' }}>
            {/* Left: Contact Form */}
            <div className="card">
              <h2 className="h2" style={{ marginBottom: 6 }}>Send Us a Message</h2>
              <p className="text-xs text-muted" style={{ marginBottom: 18 }}>
                Share your question or preferred service and an advisor will reply shortly.
              </p>

              {submittedTicket ? (
                <div className="card-warm" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Badge variant="success" style={{ alignSelf: 'flex-start' }}>
                    <CheckCircle2 size={13} /> Message Saved ({submittedTicket.id})
                  </Badge>
                  <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>
                    Thanks, {submittedTicket.name} — we received your note on &ldquo;{submittedTicket.subject}&rdquo;.
                  </div>
                  <p className="text-xs text-muted">
                    Replies are typically sent to <strong>{submittedTicket.email}</strong> within 24 hours on business days.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => setSubmittedTicket(null)}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="grid-2" style={{ gap: 12 }}>
                    <div className="field-group">
                      <label className="field-label" htmlFor="contact-name">Your Name</label>
                      <input
                        id="contact-name"
                        required
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label" htmlFor="contact-email">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="contact-subject">Subject</label>
                    <select
                      id="contact-subject"
                      className="select"
                      value={subject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      {contact.subjects.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="contact-msg">Message</label>
                    <textarea
                      id="contact-msg"
                      required
                      className="textarea"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us your target IELTS band, exam date, or which service you are exploring..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    <Send size={15} /> Submit Message
                  </button>
                </form>
              )}
            </div>

            {/* Right: Channels, Support Hours & Social Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h2 className="h3">Direct Email Channels</h2>
                {contact.channels.map((ch) => (
                  <div
                    key={ch.value}
                    className="card-warm card-compact"
                    style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <div className="text-xs text-muted" style={{ fontWeight: 600 }}>{ch.label}</div>
                    <a href={`mailto:${ch.value}`} style={{ fontWeight: 700, fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Mail size={14} style={{ color: 'var(--accent-purple)' }} />
                      <span>{ch.value}</span>
                    </a>
                    <div className="text-xs text-muted">{ch.note}</div>
                  </div>
                ))}
              </div>

              <div className="card card-compact" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: 'var(--accent-yellow-soft)',
                    color: '#9A6900',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={18} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Advisor Support Hours</div>
                  <div className="text-xs text-muted">{contact.officeHours}</div>
                </div>
              </div>

              <div className="card card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Share2 size={15} style={{ color: 'var(--accent-purple)' }} /> Community &amp; Channels
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {contact.socials.map((soc) => (
                    <Link
                      key={soc.name}
                      href={soc.href}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        fontSize: '0.84rem',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{soc.name}</span>
                      <span className="text-xs" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{soc.handle}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support FAQs */}
      <section className={styles.sectionSpace}>
        <div className={styles.container} style={{ maxWidth: 860 }}>
          <PublicSectionHeader
            eyebrow="Support FAQ"
            title="Frequently asked questions about getting support"
          />
          <PublicFaqAccordion items={contact.faqs} />
        </div>
      </section>
    </div>
  );
}

