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
} from '@/components/frontend/PublicPrimitives';
import { ServiceHeroVisual } from '@/components/frontend/HeroVisuals';
import servicesData from '@/data/public/services-pages.json';
import styles from '@/components/frontend/PublicLayout.module.css';

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
      <section className={`${styles.sectionSpace} ${styles.serv_section_1}`} >
        <div className={styles.container}>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Services</span>
            <span>/</span>
            <span className={styles.serv_span_2}>{data.title}</span>
          </nav>

          <div className={`card-warm ${styles.publicHeroGrid} ${styles.serv_div_3}`} data-animate="card" >
            <div className={styles.serv_div_4}>
              <Badge variant="yellow" className={styles.serv_badge_5}>{data.badge}</Badge>
              <h1 className="hero-heading">{data.headline}</h1>
              <p className="hero-desc">{data.subheadline}</p>
              <div className={styles.serv_div_6}>
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
        <div className={`${styles.container} ${styles.serv_div_7}`} >
          <PublicSectionHeader
            eyebrow="Service Scope"
            title={data.overviewTitle}
            subtitle={data.overviewBody}
          />

          <div>
            <h3 className={`subheading ${styles.serv_h3_8}`} >Who Should Use This Service</h3>
            <div className={`grid-2 ${styles.serv_div_9}`} >
              {data.whoShouldUse.map((who) => (
                <div key={who.title} className={`card card-compact ${styles.serv_div_10}`} >
                  <CheckCircle2 size={20} className={styles.serv_checkcircle2_11} />
                  <div>
                    <div className="card-heading">{who.title}</div>
                    <p className={`body-text ${styles.serv_p_12}`} >{who.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service-Specific Visual Demonstrations / Packages / Classes / Table */}
      <section className={styles.sectionSpace}>
        <div className={`${styles.container} ${styles.serv_div_13}`} >
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
                    className={`${tier.highlight ? 'card-dark' : 'card'} ${styles.serv_div_14}`}
                    
                  >
                    <div className={styles.serv_div_15}>
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
                    <ul className={styles.serv_ul_16}>
                      {tier.items.map((item) => (
                        <li key={item} className={`text-xs ${styles.serv_li_17}`} >
                          <CheckCircle2 size={14} style={{ color: tier.highlight ? 'var(--accent-yellow)' : 'var(--success)', flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={tier.ctaHref}
                      className={`btn ${tier.highlight ? 'btn-accent' : 'btn-primary'} ${styles.serv_link_18}`}
                      
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
              <div className={styles.serv_div_19}>
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

              <div className={`grid-2 ${styles.serv_div_20}`} >
                {filteredClasses.map((cls) => (
                  <div key={cls.id} className={`card ${styles.serv_div_21}`} >
                    <div className={styles.serv_div_22}>
                      <div className={styles.serv_div_23}>
                        <div className={styles.serv_div_24}>
                          <Badge variant="purple">{cls.category}</Badge>
                          <Badge variant="yellow">{cls.seats}</Badge>
                        </div>
                        <strong className={styles.serv_strong_25}>{cls.price}</strong>
                      </div>
                      <h3 className="h3">{cls.title}</h3>
                      <div className={`text-xs text-muted ${styles.serv_div_26}`} >
                        <span className={styles.serv_span_27}><Users size={13} /> {cls.format}</span>
                        <span className={styles.serv_span_27}><Calendar size={13} /> {cls.schedule}</span>
                      </div>

                      {/* Video Thumbnail Preview Button */}
                      <button
                        type="button"
                        onClick={() => setVideoModalClass(cls)}
                        className={`card-dark card-compact ${styles.serv_button_28}`}
                        
                      >
                        <div className={styles.serv_div_29}>
                          <span
                            className={styles.serv_span_30}
                          >
                            <Play size={15} fill="#202020" />
                          </span>
                          <div className={styles.serv_div_31}>
                            <div className={styles.serv_div_32}>{cls.previewVideoTitle}</div>
                            <div className={`text-xs ${styles.serv_div_33}`} >{cls.previewDuration}</div>
                          </div>
                        </div>
                        <Badge variant="yellow">Preview</Badge>
                      </button>

                      {/* Instructor + Syllabus */}
                      <div className={styles.serv_div_34}>
                        <SafeAvatar src={cls.instructorAvatar} name={cls.instructor} size={36} />
                        <div>
                          <div className={styles.serv_div_35}>{cls.instructor}</div>
                          <div className="text-xs text-muted">{cls.instructorRole}</div>
                        </div>
                      </div>

                      <div className="card-warm card-compact">
                        <div className={`text-xs text-muted ${styles.serv_div_36}`} >{cls.duration}</div>
                        <ul className={styles.serv_ul_37}>
                          {cls.syllabus.map((s) => (
                            <li key={s} className={`text-xs ${styles.serv_li_38}`} >
                              <CheckCircle2 size={12} className={styles.serv_checkcircle2_39} />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className={styles.serv_div_40}>
                      <Link href="/people" className="btn btn-primary btn-sm">Book Cohort Slot →</Link>
                      <Link href="/live-classes" className="btn btn-secondary btn-sm">Try Free Live Class First</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slug === 'proofreading-translation' && (
            <div id="document-rates" className={styles.serv_div_41}>
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
                        <td className={styles.serv_td_42}>{doc.service}</td>
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
              <div className={`grid-2 ${styles.serv_div_20}`} >
                {data.outcomesComparison.map((block, idx) => (
                  <div
                    key={block.stage}
                    className={`${idx === 1 ? 'card-dark' : 'card-warm'} ${styles.serv_div_14}`}
                    
                  >
                    <Badge variant={idx === 1 ? 'yellow' : 'neutral'} className={styles.serv_badge_5}>
                      {block.stage}
                    </Badge>
                    <ul className={styles.serv_ul_43}>
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
                <div key={b.title} className={`card card-compact ${styles.serv_div_44}`} >
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
                <div key={st.step} className={`card-warm card-compact ${styles.serv_div_44}`} >
                  <Badge variant="dark" className={styles.serv_badge_5}>Step {st.step}</Badge>
                  <div className={`card-heading ${styles.serv_div_45}`} >{st.title}</div>
                  <p className="supporting-text">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services + CTA */}
      <section className={styles.sectionWarmBand}>
        <div className={`${styles.container} ${styles.serv_div_7}`} >
          <div>
            <PublicSectionHeader eyebrow="Other Services" title="Additional preparation & admissions support" />
            <div className="grid-3">
              {related.map((item) => (
                <Link key={item.slug} href={item.href} className={`card card-interactive ${styles.serv_link_46}`} >
                  <div>
                    <div className={styles.serv_div_47}>
                      <PublicIcon name={item.icon} size={18} className={styles.serv_publicicon_48} />
                      <Badge variant="neutral">{item.badge}</Badge>
                    </div>
                    <h3 className="h3">{item.title}</h3>
                    <p className={`text-xs text-muted ${styles.serv_p_12}`} >{item.shortDesc}</p>
                  </div>
                  <span className={`text-xs ${styles.serv_span_49}`} >
                    View Details <ArrowUpRight size={13} className={styles.serv_arrowupright_50} />
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
          <div className={styles.serv_div_51}>
            <div
              className={`card-dark ${styles.serv_div_52}`}
              
            >
              <span
                className={styles.serv_span_53}
              >
                <Play size={22} fill="#202020" />
              </span>
              <div className={styles.serv_div_54}>{videoModalClass.previewVideoTitle}</div>
              <p className={`text-xs ${styles.serv_p_55}`} >
                Sample workshop walkthrough demonstrating how our instructor audits real student responses line-by-line during live sessions.
              </p>
            </div>
            <div className="card-warm card-compact">
              <div className={`field-label ${styles.serv_div_56}`} >Covered In This Sample Session:</div>
              <ul className={styles.serv_ul_57}>
                {videoModalClass.syllabus.map((s) => (
                  <li key={s} className={`text-xs ${styles.serv_li_38}`} >
                    <CheckCircle2 size={13} className={styles.serv_checkcircle2_58} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.serv_div_59}>
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

