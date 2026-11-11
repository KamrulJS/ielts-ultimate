'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Play,
  Users,
  Clock,
} from 'lucide-react';
import { SERVICE_NAV_ITEMS } from '@/lib/public-navigation';
import { useGsapEntrance } from '@/hooks/useGsapEntrance';
import { Badge } from '@/components/common/UiPrimitives';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import { Modal } from '@/components/common/Modal';
import {
  PublicIcon,
  PublicSectionHeader,
  PublicCtaBanner,
} from '@/components/public/PublicPrimitives';
import { ServiceHeroVisual } from '@/components/public/HeroVisuals';
import servicesData from '@/data/public/services-pages.json';
import styles from '@/components/public/PublicLayout.module.css';

export function ServiceDetailView({ slug }) {
  const rootRef = useGsapEntrance(`service-${slug}`);
  const data = servicesData[slug];
  const [classFilter, setClassFilter] = useState('All');
  const [videoModalClass, setVideoModalClass] = useState(null);

  if (!data) return null;

  const related = SERVICE_NAV_ITEMS.filter((s) => s.slug !== slug);
  const categories = ['All', 'Full Prep', 'Writing', 'Speaking', '1-on-1'];
  const filteredClasses =
    slug === 'online-classes'
      ? (data.classes || []).filter((c) => classFilter === 'All' || c.category === classFilter)
      : [];

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className={styles.sectionSpace} style={{ paddingTop: 32, paddingBottom: 36 }}>
        <div className={styles.container}>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Services</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{data.title}</span>
          </nav>

          <div className={`card-warm ${styles.publicHeroGrid}`} data-animate="card" style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Badge variant="yellow" style={{ alignSelf: 'flex-start' }}>{data.badge}</Badge>
              <h1 className="hero-heading">{data.headline}</h1>
              <p className="hero-desc">{data.subheadline}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                <Link href={data.dashboardHref} className="btn btn-primary btn-lg">
                  {data.ctaLabel} <ArrowRight size={16} />
                </Link>
                {data.secondaryCtaLabel && (
                  <a href={data.secondaryHref} className="btn btn-secondary btn-lg">
                    {data.secondaryCtaLabel}
                  </a>
                )}
              </div>
            </div>

            <ServiceHeroVisual slug={slug} />
          </div>
        </div>
      </section>

      {/* Service Overview + Audience */}
      <section className={styles.sectionWarmBand}>
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <PublicSectionHeader
            eyebrow="Service Scope"
            title={data.overviewTitle}
            subtitle={data.overviewBody}
          />

          <div>
            <h3 className="subheading" style={{ marginBottom: 16 }}>Who Should Use This Service</h3>
            <div className="grid-2" style={{ gap: 16 }}>
              {data.whoShouldUse.map((who) => (
                <div key={who.title} className="card card-compact" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="card-heading">{who.title}</div>
                    <p className="body-text" style={{ marginTop: 4 }}>{who.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service-Specific Visual Demonstrations / Packages / Classes / Table */}
      <section className={styles.sectionSpace}>
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {slug === 'prediction-test' && (
            <div id="prediction-packages">
              <PublicSectionHeader
                eyebrow="Prediction Options"
                title="Choose automated platform scoring or certified examiner review"
                subtitle="Sit full 4-skill IELTS exam predictions calmly at home before paying official registration fees."
              />
              <div className="grid-3">
                {data.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={tier.highlight ? 'card-dark' : 'card'}
                    style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.96rem', color: tier.highlight ? '#FFFFFF' : 'var(--text-primary)' }}>
                        {tier.name}
                      </span>
                      <Badge variant={tier.highlight ? 'yellow' : 'neutral'}>{tier.badge}</Badge>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 800, color: tier.highlight ? 'var(--accent-yellow)' : 'var(--text-primary)' }}>
                      {tier.price}
                    </div>
                    <p className="text-xs" style={{ color: tier.highlight ? '#C9C6BC' : 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {tier.desc}
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
                      {tier.items.map((item) => (
                        <li key={item} className="text-xs" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <CheckCircle2 size={14} style={{ color: tier.highlight ? 'var(--accent-yellow)' : 'var(--success)', flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={tier.ctaHref}
                      className={`btn ${tier.highlight ? 'btn-accent' : 'btn-primary'}`}
                      style={{ marginTop: 'auto' }}
                    >
                      {tier.ctaLabel} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slug === 'online-classes' && (
            <div id="class-catalog">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
                <PublicSectionHeader
                  eyebrow="Sample Cohorts & Lesson Previews"
                  title="Explore live cohorts, instructors, and schedules"
                  subtitle="Click any video preview thumbnail to inspect a live session teardown outline."
                />
                <div className="filter-pills">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setClassFilter(cat)}
                      className={`filter-pill ${classFilter === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid-2" style={{ gap: 18 }}>
                {filteredClasses.map((cls) => (
                  <div key={cls.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <Badge variant="purple">{cls.category}</Badge>
                          <Badge variant="yellow">{cls.seats}</Badge>
                        </div>
                        <strong style={{ fontSize: '0.96rem' }}>{cls.price}</strong>
                      </div>
                      <h3 className="h3">{cls.title}</h3>
                      <div className="text-xs text-muted" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Users size={13} /> {cls.format}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Calendar size={13} /> {cls.schedule}</span>
                      </div>

                      {/* Video Thumbnail Preview Button */}
                      <button
                        type="button"
                        onClick={() => setVideoModalClass(cls)}
                        className="card-dark card-compact"
                        style={{
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <span
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 999,
                              backgroundColor: 'var(--accent-yellow)',
                              color: '#202020',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Play size={15} fill="#202020" />
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#FFFFFF' }}>{cls.previewVideoTitle}</div>
                            <div className="text-xs" style={{ color: '#B7B5AD' }}>{cls.previewDuration}</div>
                          </div>
                        </div>
                        <Badge variant="yellow">Preview</Badge>
                      </button>

                      {/* Instructor + Syllabus */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                        <SafeAvatar src={cls.instructorAvatar} name={cls.instructor} size={36} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{cls.instructor}</div>
                          <div className="text-xs text-muted">{cls.instructorRole}</div>
                        </div>
                      </div>

                      <div className="card-warm card-compact">
                        <div className="text-xs text-muted" style={{ fontWeight: 700, marginBottom: 6 }}>{cls.duration}</div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {cls.syllabus.map((s) => (
                            <li key={s} className="text-xs" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <CheckCircle2 size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Link href="/people" className="btn btn-primary btn-sm">Book Cohort Slot →</Link>
                      <Link href="/live-classes" className="btn btn-secondary btn-sm">Try Free Live Class First</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slug === 'proofreading-translation' && (
            <div id="document-rates" style={{ minWidth: 0, width: '100%' }}>
              <PublicSectionHeader
                eyebrow="Editorial & Certified Translation Rates"
                title="Transparent document packages with 48-hour delivery"
                subtitle="Polished academic language tailored for university selection panels and migration documentation."
              />
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Document Service</th>
                      <th>Editorial Scope</th>
                      <th>Turnaround</th>
                      <th>Indicative Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.documentsTable.map((doc) => (
                      <tr key={doc.id}>
                        <td style={{ fontWeight: 700 }}>{doc.service}</td>
                        <td className="text-muted">{doc.scope}</td>
                        <td><Badge variant="neutral"><Clock size={11} /> {doc.turnaround}</Badge></td>
                        <td><Badge variant="dark">{doc.rate}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {slug === 'study-abroad-preparation' && (
            <div id="mentoring-pillars">
              <PublicSectionHeader
                eyebrow="Measurable Mentoring Outcomes"
                title="How structured admissions guidance transforms scholarship applications"
              />
              <div className="grid-2" style={{ gap: 18 }}>
                {data.outcomesComparison.map((block, idx) => (
                  <div
                    key={block.stage}
                    className={idx === 1 ? 'card-dark' : 'card-warm'}
                    style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                  >
                    <Badge variant={idx === 1 ? 'yellow' : 'neutral'} style={{ alignSelf: 'flex-start' }}>
                      {block.stage}
                    </Badge>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {block.points.map((pt) => (
                        <li key={pt} className="text-sm" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: idx === 1 ? '#EAE8E1' : 'var(--text-primary)' }}>
                          <CheckCircle2
                            size={16}
                            style={{
                              color: idx === 1 ? 'var(--accent-yellow)' : 'var(--text-muted)',
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits & Workflow */}
          <div>
            <PublicSectionHeader eyebrow="Key Benefits" title={`Why learners choose ${data.title}`} />
            <div className="grid-4">
              {data.benefits.map((b) => (
                <div key={b.title} className="card card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="card-heading">{b.title}</div>
                  <p className="supporting-text">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <PublicSectionHeader eyebrow="Process" title="How this service works" />
            <div className="grid-4">
              {data.howItWorks.map((st) => (
                <div key={st.step} className="card-warm card-compact" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Badge variant="dark" style={{ alignSelf: 'flex-start' }}>Step {st.step}</Badge>
                  <div className="card-heading" style={{ marginTop: 2 }}>{st.title}</div>
                  <p className="supporting-text">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services + CTA */}
      <section className={styles.sectionWarmBand}>
        <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <PublicSectionHeader eyebrow="Other Services" title="Additional preparation & admissions support" />
            <div className="grid-3">
              {related.map((item) => (
                <Link key={item.slug} href={item.href} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <PublicIcon name={item.icon} size={18} style={{ color: 'var(--accent-purple)' }} />
                      <Badge variant="neutral">{item.badge}</Badge>
                    </div>
                    <h3 className="h3">{item.title}</h3>
                    <p className="text-xs text-muted" style={{ marginTop: 4 }}>{item.shortDesc}</p>
                  </div>
                  <span className="text-xs" style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>
                    View Details <ArrowUpRight size={13} style={{ display: 'inline' }} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <PublicCtaBanner
            badge="Take Your Next Step"
            title={`Get started with ${data.title}`}
            description="Access connected practice sets, instructor schedules, or tailored document review support seamlessly inside IELTS Ultimate."
            primaryLabel={data.ctaLabel}
            primaryHref={data.dashboardHref}
            secondaryLabel="Contact Our Advisors"
            secondaryHref="/contact"
          />
        </div>
      </section>

      {/* Video Class Preview Modal (for Online Classes) */}
      <Modal
        open={Boolean(videoModalClass)}
        onClose={() => setVideoModalClass(null)}
        title={videoModalClass?.title}
        subtitle={`${videoModalClass?.instructor} • ${videoModalClass?.previewDuration}`}
      >
        {videoModalClass && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              className="card-dark"
              style={{
                padding: '28px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  backgroundColor: 'var(--accent-yellow)',
                  color: '#202020',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play size={22} fill="#202020" />
              </span>
              <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{videoModalClass.previewVideoTitle}</div>
              <p className="text-xs" style={{ color: '#B7B5AD', maxWidth: 400 }}>
                Sample workshop walkthrough demonstrating how our instructor audits real student responses line-by-line during live sessions.
              </p>
            </div>
            <div className="card-warm card-compact">
              <div className="field-label" style={{ marginBottom: 6 }}>Covered In This Sample Session:</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {videoModalClass.syllabus.map((s) => (
                  <li key={s} className="text-xs" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setVideoModalClass(null)}>
                Close Preview
              </button>
              <Link href="/people" className="btn btn-primary">
                Book Session Inside Portal →
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

