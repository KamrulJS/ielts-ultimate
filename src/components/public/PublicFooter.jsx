import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { RESOURCE_NAV_ITEMS, SERVICE_NAV_ITEMS } from '@/lib/public-navigation';
import styles from './PublicLayout.module.css';

export function PublicFooter() {
  return (
    <footer className={styles.publicFooter}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Column 1: Brand Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#FFFFFF',
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--dark-border)',
                  color: 'var(--accent-yellow)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={16} strokeWidth={2.4} />
              </span>
              <span>IELTS Ultimate</span>
            </Link>
            <p className="text-xs" style={{ color: '#B7B5AD', lineHeight: 1.65, maxWidth: 280 }}>
              Complete IELTS preparation combining realistic 4-skill mock simulations, rubric-calibrated Writing &amp; Speaking feedback, curated lexical studios, and certified online instruction.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              <span className="badge badge-yellow">Academic</span>
              <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#EAE8E1', borderColor: 'var(--dark-border)' }}>
                General Training
              </span>
            </div>
          </div>

          {/* Column 2: Resources */}
          <div>
            <div className={styles.footerHeading}>Resources</div>
            <nav className={styles.footerLinks} aria-label="Resources footer links">
              {RESOURCE_NAV_ITEMS.map((item) => (
                <Link key={item.slug} href={item.href} className={styles.footerLink}>
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Services */}
          <div>
            <div className={styles.footerHeading}>Services</div>
            <nav className={styles.footerLinks} aria-label="Services footer links">
              {SERVICE_NAV_ITEMS.map((item) => (
                <Link key={item.slug} href={item.href} className={styles.footerLink}>
                  {item.title}
                </Link>
              ))}
              <Link href="/live-classes" className={styles.footerLink}>
                Live Free Class
              </Link>
            </nav>
          </div>

          {/* Column 4: Platform & Access */}
          <div>
            <div className={styles.footerHeading}>Platform &amp; Access</div>
            <nav className={styles.footerLinks} aria-label="Platform footer links">
              <Link href="/about" className={styles.footerLink}>
                About IELTS Ultimate
              </Link>
              <Link href="/contact" className={styles.footerLink}>
                Contact &amp; Support
              </Link>
              <Link href="/login" className={styles.footerLink}>
                Student Sign In
              </Link>
              <Link href="/login?mode=signup" className={styles.footerLink}>
                Create Free Account
              </Link>
              <Link href="/dashboard" className={styles.footerLink}>
                Student Dashboard
              </Link>
              <Link href="/login?role=admin&next=/admin" className={styles.footerLink}>
                Admin Portal
              </Link>
            </nav>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© 2026 IELTS Ultimate. All rights reserved.</span>
          <span>Support: support@ieltsultimate.edu</span>
        </div>
      </div>
    </footer>
  );
}

