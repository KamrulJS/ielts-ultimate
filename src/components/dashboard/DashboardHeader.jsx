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

  const displayName = auth?.isAuthenticated && auth?.name ? auth.name : profile.name;
  const displayEmail = auth?.isAuthenticated && auth?.email ? auth.email : profile.email;
  const displayAvatar = auth?.isAuthenticated ? (auth.avatar || null) : profile.avatar;

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
          className={`${styles.topbarSearchBtn} ${styles.dash_button_1}`}
          
        >
          <Search size={15} className={styles.dash_search_2} />
          <span
            className={`${styles.topbarSearchText} ${styles.dash_span_3}`}
            
          >
            Search courses, tests, cue cards, vocabulary...
          </span>
          <span
            className={`text-xs ${styles.topbarKbd} ${styles.dash_span_4}`}
            
          >
            ⌘K
          </span>
        </button>
      </div>

      {/* Right Status Pills + Notifications + Avatar */}
      <div className={styles.topbarRight}>
        <Link
          href="/achievements"
          className={`badge badge-neutral ${styles.topbarPill} ${styles.dash_link_5}`}
          
          title="Total XP earned"
        >
          <Zap size={14} className={styles.dash_zap_6} />
          <span>{profile.xp.toLocaleString()}<span className={styles.topbarUnitLabel}> XP</span></span>
        </Link>

        <Link
          href="/study-plan"
          className={`badge badge-neutral ${styles.topbarPill} ${styles.dash_link_5}`}
          
          title="Current study streak"
        >
          <Flame size={14} className={styles.dash_flame_7} />
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
            className={`btn btn-secondary btn-icon ${styles.dash_button_8}`}
            
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
                className={styles.dash_div_9}
              >
                <div className={styles.dash_div_10}>
                  <span className={styles.dash_span_11}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className={`badge badge-purple ${styles.dash_span_12}`} >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className={`text-xs ${styles.dash_button_13}`}
                    
                    onClick={markAllNotificationsRead}
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div
                  className={styles.dash_div_14}
                >
                  <span
                    className={styles.dash_span_15}
                  >
                    <BellOff size={18} />
                  </span>
                  <div className={styles.dash_div_16}>You&apos;re all caught up</div>
                  <p className="text-xs text-muted">
                    Feedback alerts, mock test scores, and live session reminders will appear here.
                  </p>
                </div>
              ) : (
                <div className={styles.dash_div_17}>
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
                        <div className={styles.dash_div_18}>
                          <div className={styles.dash_div_19}>
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
                                className={styles.dash_span_20}
                                aria-label="Unread"
                              />
                            )}
                          </div>
                          <p
                            className={`text-xs text-muted ${styles.dash_p_21}`}
                            
                          >
                            {n.message}
                          </p>
                          <div className={`text-xs ${styles.dash_div_22}`} >
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
                className={`btn btn-secondary btn-sm ${styles.dash_link_23}`}
                
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* Administrator Exclusive Portal Button */}
        {isAdminAuthorized && (
          <Link
            href="/admin"
            className="btn btn-secondary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              fontWeight: 700,
              fontSize: '0.8rem',
              backgroundColor: '#FEF6DD',
              borderColor: '#E5AC1A',
              color: '#202020',
              borderRadius: 0,
            }}
            title="Open Administrator Console"
          >
            <ShieldCheck size={14} color="#B45309" />
            <span>Admin Portal</span>
          </Link>
        )}

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
            <SafeAvatar src={displayAvatar} name={displayName} size={36} radius="10px" />
          </button>

          {userMenuOpen && (
            <div className={styles.popoverPanel} role="menu" aria-label="Account navigation">
              {/* Profile Header */}
              <div
                className={styles.dash_div_24}
              >
                <SafeAvatar src={displayAvatar} name={displayName} size={38} radius="10px" />
                <div className={styles.dash_div_25}>
                  <div
                    className={styles.dash_div_26}
                  >
                    {displayName}
                  </div>
                  <div
                    className={`text-xs text-muted ${styles.dash_div_27}`}
                    
                  >
                    {displayEmail}
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className={styles.dash_div_28}>
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
                      <span className={styles.dash_span_29}>
                        <Icon size={15} className={styles.dash_icon_30} />
                        <span>{link.label}</span>
                      </span>
                      {link.badge && (
                        <span className={`badge badge-yellow ${styles.dash_span_31}`} >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Sign Out Action */}
              <div className={styles.dash_div_32}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                    router.replace('/login');
                  }}
                  className={`${styles.popoverItem} ${styles.dash_button_33}`}
                  
                >
                  <span className={styles.dash_span_34}>
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
