'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { RESOURCE_NAV_ITEMS, SERVICE_NAV_ITEMS } from '@/lib/public-navigation';
import { useApp } from '@/context/AppContext';
import { useIsMounted } from '@/hooks/useIsMounted';
import { PublicIcon } from './PublicPrimitives';
import styles from './PublicLayout.module.css';

export function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, logout } = useApp();
  const mounted = useIsMounted();

  const [openMenu, setOpenMenu] = useState(null); // 'resources' | 'services' | null
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState('resources');

  const navRef = useRef(null);
  const closeTimerRef = useRef(null);
  const hoverOpenedRef = useRef({ menu: null, ts: 0 });

  const openOnHover = (menu) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (openMenu !== menu) {
      hoverOpenedRef.current = { menu, ts: Date.now() };
      setOpenMenu(menu);
    }
  };

  const closeOnLeave = (menu) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu((cur) => (cur === menu ? null : cur));
    }, 120);
  };

  const toggleMenuClick = (menu) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (openMenu === menu) {
      const elapsed = Date.now() - hoverOpenedRef.current.ts;
      if (hoverOpenedRef.current.menu === menu && elapsed < 400) {
        hoverOpenedRef.current = { menu: null, ts: 0 };
        return;
      }
      setOpenMenu(null);
      return;
    }
    hoverOpenedRef.current = { menu: null, ts: 0 };
    setOpenMenu(menu);
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const isLoggedIn = mounted && auth?.isAuthenticated;

  return (
    <>
      <header className={styles.publicHeader} ref={navRef}>
        <div className={styles.headerInner}>
          {/* Brand Logo */}
          <Link href="/" className={styles.brandLink} onClick={() => setOpenMenu(null)}>
            <span className={styles.brandMark} aria-hidden="true">
              <Sparkles size={16} strokeWidth={2.4} />
            </span>
            <span>IELTS Ultimate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Main Navigation">
            <Link
              href="/"
              className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
              onClick={() => setOpenMenu(null)}
            >
              Home
            </Link>

            {/* Resources Dropdown */}
            <div
              className={styles.dropdownWrap}
              onMouseEnter={() => openOnHover('resources')}
              onMouseLeave={() => closeOnLeave('resources')}
            >
              <button
                type="button"
                className={`${styles.navLink} ${pathname.startsWith('/resources') ? styles.navLinkActive : ''}`}
                aria-expanded={openMenu === 'resources'}
                onClick={() => toggleMenuClick('resources')}
              >
                <span>Resources</span>
                <ChevronDown
                  size={15}
                  style={{
                    transform: openMenu === 'resources' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.16s ease',
                  }}
                />
              </button>

              {openMenu === 'resources' && (
                <div className={`${styles.dropdownMenu} ${styles.dropdownMenuWide}`} role="menu">
                  {RESOURCE_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.slug}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setOpenMenu(null)}
                      className={styles.dropdownItem}
                    >
                      <span className={styles.dropdownIconBox}>
                        <PublicIcon name={item.icon} size={15} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                          {item.title}
                        </div>
                        <div className="text-xs text-muted" style={{ lineHeight: 1.35, marginTop: 2 }}>
                          {item.shortDesc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className={styles.dropdownWrap}
              onMouseEnter={() => openOnHover('services')}
              onMouseLeave={() => closeOnLeave('services')}
            >
              <button
                type="button"
                className={`${styles.navLink} ${pathname.startsWith('/services') ? styles.navLinkActive : ''}`}
                aria-expanded={openMenu === 'services'}
                onClick={() => toggleMenuClick('services')}
              >
                <span>Services</span>
                <ChevronDown
                  size={15}
                  style={{
                    transform: openMenu === 'services' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.16s ease',
                  }}
                />
              </button>

              {openMenu === 'services' && (
                <div className={styles.dropdownMenu} role="menu">
                  {SERVICE_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.slug}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setOpenMenu(null)}
                      className={styles.dropdownItem}
                    >
                      <span className={styles.dropdownIconBox}>
                        <PublicIcon name={item.icon} size={15} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                          {item.title}
                        </div>
                        <div className="text-xs text-muted" style={{ lineHeight: 1.35, marginTop: 2 }}>
                          {item.shortDesc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/live-classes"
              className={`${styles.navLink} ${pathname === '/live-classes' ? styles.navLinkActive : ''}`}
              onClick={() => setOpenMenu(null)}
            >
              <span>Live Free Class</span>
              <span className="badge badge-yellow" style={{ padding: '2px 7px', fontSize: '0.68rem' }}>
                Free
              </span>
            </Link>

            <Link
              href="/about"
              className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}
              onClick={() => setOpenMenu(null)}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`${styles.navLink} ${pathname === '/contact' ? styles.navLinkActive : ''}`}
              onClick={() => setOpenMenu(null)}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className={styles.headerActions}>
            <div className={`${styles.headerActions} ${styles.desktopAuthActions}`}>
              {isLoggedIn ? (
                <>
                  <Link
                    href={auth.role === 'admin' ? '/admin' : '/dashboard'}
                    className="btn btn-primary btn-sm"
                  >
                    <LayoutDashboard size={14} />
                    <span>{auth.role === 'admin' ? 'Admin Console' : 'Dashboard'}</span>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      logout();
                      router.refresh();
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary btn-sm">
                    Log In
                  </Link>
                  <Link href="/login?mode=signup" className="btn btn-primary btn-sm">
                    <span>Start Free</span>
                    <ArrowRight size={14} />
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className={`btn btn-secondary btn-icon ${styles.mobileMenuBtn}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open public navigation menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Drawer */}
      {mobileOpen && (
        <div className={styles.drawerBackdrop} role="dialog" aria-modal="true" aria-label="Public Navigation">
          <div className={styles.drawerScrim} onClick={() => setMobileOpen(false)} />
          <div className={styles.drawerPanel}>
            <div
              style={{
                height: 64,
                padding: '0 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Link href="/" className={styles.brandLink} onClick={() => setMobileOpen(false)}>
                <span className={styles.brandMark} aria-hidden="true">
                  <Sparkles size={16} strokeWidth={2.4} />
                </span>
                <span>IELTS Ultimate</span>
              </Link>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close public navigation menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
              >
                Home
              </Link>

              {/* Mobile Resources Accordion */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 6 }}>
                <button
                  type="button"
                  onClick={() => setMobileAccordion((a) => (a === 'resources' ? '' : 'resources'))}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  <span>Resources</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: mobileAccordion === 'resources' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.16s ease',
                    }}
                  />
                </button>
                {mobileAccordion === 'resources' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
                    {RESOURCE_NAV_ITEMS.map((item) => (
                      <Link
                        key={item.slug}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
                        style={{ padding: '7px 10px', fontSize: '0.83rem' }}
                      >
                        <PublicIcon name={item.icon} size={14} />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Services Accordion */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 6 }}>
                <button
                  type="button"
                  onClick={() => setMobileAccordion((a) => (a === 'services' ? '' : 'services'))}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  <span>Services</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: mobileAccordion === 'services' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.16s ease',
                    }}
                  />
                </button>
                {mobileAccordion === 'services' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
                    {SERVICE_NAV_ITEMS.map((item) => (
                      <Link
                        key={item.slug}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
                        style={{ padding: '7px 10px', fontSize: '0.83rem' }}
                      >
                        <PublicIcon name={item.icon} size={14} />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/live-classes"
                onClick={() => setMobileOpen(false)}
                className={`${styles.navLink} ${pathname === '/live-classes' ? styles.navLinkActive : ''}`}
              >
                <span>Live Free Class</span>
                <span className="badge badge-yellow" style={{ padding: '2px 7px', fontSize: '0.68rem' }}>
                  Free
                </span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className={`${styles.navLink} ${pathname === '/contact' ? styles.navLinkActive : ''}`}
              >
                Contact
              </Link>
            </div>

            <div
              style={{
                padding: 16,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {isLoggedIn ? (
                <>
                  <Link
                    href={auth.role === 'admin' ? '/admin' : '/dashboard'}
                    className="btn btn-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={15} /> Open {auth.role === 'admin' ? 'Admin Console' : 'Dashboard'}
                  </Link>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login?mode=signup" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                    Start Learning Free <ArrowRight size={15} />
                  </Link>
                  <Link href="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>
                    Student / Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

