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
import { PRODUCT_NAV_ITEMS, PRACTICE_NAV_ITEMS } from '@/lib/public-navigation';
import { useApp } from '@/context/AppContext';
import { useIsMounted } from '@/hooks/useIsMounted';
import { PublicIcon } from './PublicPrimitives';
import styles from './PublicLayout.module.css';

export function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const app = useApp?.() || {};
  const auth = app.auth || { isAuthenticated: false };
  const logout = app.logout || (() => {});
  const mounted = useIsMounted();

  const [openMenu, setOpenMenu] = useState(null); // 'products' | 'practice' | null
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState('products');

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

  const isProductsActive =
    pathname.startsWith('/products') ||
    pathname.startsWith('/resources') ||
    pathname.startsWith('/services') ||
    pathname === '/live-classes';

  const isPracticeActive =
    pathname === '/reading' ||
    pathname === '/writing' ||
    pathname === '/listening' ||
    pathname === '/speaking' ||
    pathname === '/mock-test' ||
    pathname.startsWith('/practice');

  return (
    <>
      <header className={styles.publicHeader} ref={navRef}>
        <div className={styles.headerInner}>
          {/* Brand Logo */}
          <Link href="/" className={styles.brandLink} onClick={() => setOpenMenu(null)}>
            <span className={styles.brandMark} aria-hidden="true">
              <Sparkles size={16} strokeWidth={2.4} />
            </span>
            <span>IELTS WIST</span>
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

            {/* Products Dropdown (7 Items) */}
            <div
              className={styles.dropdownWrap}
              onMouseEnter={() => openOnHover('products')}
              onMouseLeave={() => closeOnLeave('products')}
            >
              <button
                type="button"
                className={`${styles.navLink} ${isProductsActive ? styles.navLinkActive : ''}`}
                aria-expanded={openMenu === 'products'}
                onClick={() => toggleMenuClick('products')}
              >
                <span>Products</span>
                <ChevronDown
                  size={15}
                  style={{
                    transform: openMenu === 'products' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.16s ease',
                  }}
                />
              </button>

              {openMenu === 'products' && (
                <div className={`${styles.dropdownMenu} ${styles.dropdownMenuWide}`} role="menu">
                  {PRODUCT_NAV_ITEMS.map((item) => (
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
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {item.title}
                        </div>
                        <div className="text-xs text-muted" style={{ fontSize: '0.74rem', marginTop: 2 }}>
                          {item.shortDesc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Practice Dropdown (5 Items) */}
            <div
              className={styles.dropdownWrap}
              onMouseEnter={() => openOnHover('practice')}
              onMouseLeave={() => closeOnLeave('practice')}
            >
              <button
                type="button"
                className={`${styles.navLink} ${isPracticeActive ? styles.navLinkActive : ''}`}
                aria-expanded={openMenu === 'practice'}
                onClick={() => toggleMenuClick('practice')}
              >
                <span>Practice</span>
                <ChevronDown
                  size={15}
                  style={{
                    transform: openMenu === 'practice' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.16s ease',
                  }}
                />
              </button>

              {openMenu === 'practice' && (
                <div className={styles.dropdownMenu} role="menu">
                  {PRACTICE_NAV_ITEMS.map((item) => (
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
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {item.title}
                        </div>
                        <div className="text-xs text-muted" style={{ fontSize: '0.74rem', marginTop: 2 }}>
                          {item.shortDesc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className={`${styles.navLink} ${pathname === '/pricing' ? styles.navLinkActive : ''}`}
              onClick={() => setOpenMenu(null)}
            >
              Pricing
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
                    href={auth?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="btn btn-primary btn-sm"
                  >
                    <LayoutDashboard size={14} />
                    <span>{auth?.role === 'admin' ? 'Admin Console' : 'Dashboard'}</span>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 800 }}>
                <span className={styles.brandMark}>
                  <Sparkles size={16} />
                </span>
                <span>IELTS WIST</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto' }}>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
              >
                Home
              </Link>

              {/* Mobile Products Accordion (7 items) */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 0, padding: 6 }}>
                <button
                  type="button"
                  onClick={() => setMobileAccordion((a) => (a === 'products' ? '' : 'products'))}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>Products (7)</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: mobileAccordion === 'products' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.16s ease',
                    }}
                  />
                </button>
                {mobileAccordion === 'products' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
                    {PRODUCT_NAV_ITEMS.map((item) => (
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

              {/* Mobile Practice Accordion (5 items) */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 0, padding: 6 }}>
                <button
                  type="button"
                  onClick={() => setMobileAccordion((a) => (a === 'practice' ? '' : 'practice'))}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>Practice (5)</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: mobileAccordion === 'practice' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.16s ease',
                    }}
                  />
                </button>
                {mobileAccordion === 'practice' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
                    {PRACTICE_NAV_ITEMS.map((item) => (
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
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className={`${styles.navLink} ${pathname === '/pricing' ? styles.navLinkActive : ''}`}
              >
                Pricing
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
                    href={auth?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="btn btn-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={15} /> Open {auth?.role === 'admin' ? 'Admin Console' : 'Dashboard'}
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
