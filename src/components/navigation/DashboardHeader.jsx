'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Flame,
  Zap,
  CheckCheck,
  Settings,
  Bookmark,
  Trophy,
  ShieldCheck,
  User,
  Globe,
  LogOut,
  Calendar,
  PenTool,
  Video,
  Swords,
  MessageSquare,
  Headphones,
  Gift,
  Award,
  BellOff,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useIsMounted } from '@/hooks/useIsMounted';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import styles from './Sidebar.module.css';

const NOTIF_CATEGORY_ICONS = {
  Evaluation: PenTool,
  Session: Video,
  Streak: Flame,
  Battle: Swords,
  Community: MessageSquare,
  'Test Result': Headphones,
  'Study Plan': Calendar,
  Referral: Gift,
  'Mock Test': Award,
};

export function DashboardHeader() {
  const router = useRouter();
  const mounted = useIsMounted();
  const {
    auth,
    profile,
    bookings,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    setMobileNavOpen,
    setSearchOpen,
    logout,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const closeOnClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    const closeOnEsc = (e) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnClickOutside);
    window.addEventListener('keydown', closeOnEsc);
    return () => {
      document.removeEventListener('mousedown', closeOnClickOutside);
      window.removeEventListener('keydown', closeOnEsc);
    };
  }, []);

  const isAdminAuthorized = mounted && auth?.role === 'admin';
  const accountLinks = [
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/settings', label: 'Account Settings', icon: Settings },
    {
      href: '/people?tab=sessions',
      label: 'My Bookings',
      icon: Calendar,
      badge: bookings?.length > 0 ? String(bookings.length) : null,
    },
    { href: '/bookmarks', label: 'My Bookmarks', icon: Bookmark },
    { href: '/achievements', label: 'Achievements', icon: Trophy },
    ...(isAdminAuthorized
      ? [{ href: '/admin', label: 'Admin Console', icon: ShieldCheck }]
      : []),
    { href: '/', label: 'Public Website', icon: Globe },
  ];

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button
          type="button"
          className={`btn btn-secondary btn-icon ${styles.mobileMenuBtn}`}
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Global Search Bar Trigger */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search platform"
          className={styles.topbarSearchBtn}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            minWidth: 0,
            maxWidth: 420,
            overflow: 'hidden',
            padding: '8px 14px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            textAlign: 'left',
          }}
        >
          <Search size={15} style={{ flexShrink: 0 }} />
          <span
            className={styles.topbarSearchText}
            style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            Search courses, tests, cue cards, vocabulary...
          </span>
          <span
            className={`text-xs ${styles.topbarKbd}`}
            style={{
              padding: '2px 7px',
              borderRadius: 6,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            ⌘K
          </span>
        </button>
      </div>

      {/* Right Status Pills + Notifications + Avatar */}
      <div className={styles.topbarRight}>
        <Link
          href="/achievements"
          className={`badge badge-neutral ${styles.topbarPill}`}
          style={{
            backgroundColor: 'var(--surface)',
            padding: '6px 12px',
            fontSize: '0.8125rem',
          }}
          title="Total XP earned"
        >
          <Zap size={14} style={{ color: 'var(--error)' }} />
          <span>{profile.xp.toLocaleString()}<span className={styles.topbarUnitLabel}> XP</span></span>
        </Link>

        <Link
          href="/study-plan"
          className={`badge badge-neutral ${styles.topbarPill}`}
          style={{
            backgroundColor: 'var(--surface)',
            padding: '6px 12px',
            fontSize: '0.8125rem',
          }}
          title="Current study streak"
        >
          <Flame size={14} style={{ color: 'var(--accent-yellow)' }} />
          <span>{profile.streakDays}<span className={styles.topbarUnitLabel}> days</span></span>
        </Link>

        {/* Notifications Popover */}
        <div ref={notifRef} className={styles.popoverAnchor}>
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(false);
              setNotifOpen((v) => !v);
            }}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative' }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            aria-haspopup="dialog"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  padding: '0 4px',
                  borderRadius: 999,
                  backgroundColor: 'var(--accent-purple)',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  lineHeight: '16px',
                  textAlign: 'center',
                  border: '2px solid var(--bg-primary)',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className={styles.popoverNotifications}
              role="dialog"
              aria-label="Notifications panel"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 12,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="badge badge-purple" style={{ padding: '2px 8px', fontSize: '0.72rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="text-xs"
                    style={{
                      color: 'var(--accent-purple)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                    onClick={markAllNotificationsRead}
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: '28px 16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 999,
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BellOff size={18} />
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>You&apos;re all caught up</div>
                  <p className="text-xs text-muted">
                    Feedback alerts, mock test scores, and live session reminders will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
                  {notifications.slice(0, 6).map((n) => {
                    const CategoryIcon = NOTIF_CATEGORY_ICONS[n.category] || Bell;
                    return (
                      <Link
                        key={n.id}
                        href={n.href || '/notifications'}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setNotifOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          gap: 10,
                          padding: 10,
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: n.read ? 'var(--bg-primary)' : 'var(--accent-purple-soft)',
                          border: n.read ? '1px solid var(--border)' : '1px solid rgba(136, 103, 184, 0.3)',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            backgroundColor: n.read ? 'var(--bg-secondary)' : 'var(--surface)',
                            color: n.read ? 'var(--text-secondary)' : 'var(--accent-purple)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          <CategoryIcon size={14} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                fontWeight: n.read ? 600 : 700,
                                fontSize: '0.84rem',
                                color: 'var(--text-primary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {n.title}
                            </span>
                            {!n.read && (
                              <span
                                style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: 999,
                                  backgroundColor: 'var(--accent-purple)',
                                  flexShrink: 0,
                                }}
                                aria-label="Unread"
                              />
                            )}
                          </div>
                          <p
                            className="text-xs text-muted"
                            style={{
                              marginTop: 3,
                              lineHeight: 1.45,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {n.message}
                          </p>
                          <div className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: '0.73rem' }}>
                            {n.time}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              <Link
                href="/notifications"
                onClick={() => setNotifOpen(false)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: 12 }}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* User Avatar Dropdown */}
        <div ref={userRef} className={styles.popoverAnchor}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen(false);
              setUserMenuOpen((v) => !v);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 12,
              padding: 2,
              border: userMenuOpen ? '2px solid var(--dark-section)' : '2px solid transparent',
              transition: 'border-color 0.16s ease',
            }}
            aria-label="Account menu"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
          >
            <SafeAvatar src={profile.avatar} name={profile.name} size={36} radius="10px" />
          </button>

          {userMenuOpen && (
            <div className={styles.popoverPanel} role="menu" aria-label="Account navigation">
              {/* Profile Header */}
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-primary)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <SafeAvatar src={profile.avatar} name={profile.name} size={38} radius="10px" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {profile.name}
                  </div>
                  <div
                    className="text-xs text-muted"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {profile.email}
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {accountLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className={styles.popoverItem}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <Icon size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                        <span>{link.label}</span>
                      </span>
                      {link.badge && (
                        <span className="badge badge-yellow" style={{ padding: '2px 7px', fontSize: '0.7rem' }}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Sign Out Action */}
              <div style={{ borderTop: '1px solid var(--border)', padding: 8 }}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                    router.replace('/login');
                  }}
                  className={styles.popoverItem}
                  style={{ color: 'var(--error)', fontWeight: 600 }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
