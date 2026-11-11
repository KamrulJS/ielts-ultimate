'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SafeAvatar } from '@/components/common/SafeAvatar';
import styles from './Sidebar.module.css';

export function DashboardHeader() {
  const {
    profile,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    setMobileNavOpen,
    setSearchOpen,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const closeOnClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnClick);
    return () => document.removeEventListener('mousedown', closeOnClick);
  }, []);

  return (
    <header className={styles.topbar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        <button
          type="button"
          className={`btn btn-secondary btn-icon ${styles.mobileMenuBtn}`}
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Global Search Bar Trigger (Filko topbar style) */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            maxWidth: 400,
            padding: '8px 14px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            textAlign: 'left',
          }}
        >
          <Search size={15} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Search courses, tests, cue cards, vocabulary...
          </span>
          <span
            className="text-xs"
            style={{
              padding: '2px 7px',
              borderRadius: 6,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            ⌘K
          </span>
        </button>
      </div>

      {/* Right Status Pills + Notifications + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link
          href="/achievements"
          className="badge badge-neutral"
          style={{
            backgroundColor: 'var(--surface)',
            padding: '6px 12px',
            fontSize: '0.8rem',
          }}
          title="Total XP earned"
        >
          <Zap size={14} style={{ color: 'var(--error)' }} />
          <span>{profile.xp.toLocaleString()} XP</span>
        </Link>

        <Link
          href="/study-plan"
          className="badge badge-neutral"
          style={{
            backgroundColor: 'var(--surface)',
            padding: '6px 12px',
            fontSize: '0.8rem',
          }}
          title="Current study streak"
        >
          <Flame size={14} style={{ color: 'var(--accent-yellow)' }} />
          <span>{profile.streakDays} days</span>
        </Link>

        {/* Notifications Popover */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative' }}
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 7,
                  width: 8,
                  height: 8,
                  borderRadius: '999px',
                  backgroundColor: 'var(--accent-purple)',
                  border: '1.5px solid var(--surface)',
                }}
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: 340,
                maxWidth: '90vw',
                padding: 16,
                zIndex: 70,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Notifications ({unreadCount} unread)
                </span>
                <button
                  type="button"
                  className="text-xs"
                  style={{ color: 'var(--accent-purple)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  onClick={markAllNotificationsRead}
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                {notifications.slice(0, 5).map((n) => (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setNotifOpen(false);
                    }}
                    style={{
                      padding: 10,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: n.read ? 'var(--bg-primary)' : 'var(--accent-purple-soft)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{n.title}</span>
                      <span className="text-xs text-muted">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted" style={{ marginTop: 3 }}>
                      {n.message}
                    </p>
                  </Link>
                ))}
              </div>
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
        <div ref={userRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            aria-label="Account menu"
          >
            <SafeAvatar src={profile.avatar} name={profile.name} size={36} radius="10px" />
          </button>

          {userMenuOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: 230,
                padding: 8,
                zIndex: 70,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{profile.name}</div>
                <div className="text-xs text-muted">{profile.email}</div>
              </div>
              {[
                { href: '/profile', label: 'My Profile', icon: User },
                { href: '/settings', label: 'Account Settings', icon: Settings },
                { href: '/bookmarks', label: 'My Bookmarks', icon: Bookmark },
                { href: '/achievements', label: 'Achievements', icon: Trophy },
                { href: '/admin', label: 'Admin Console', icon: ShieldCheck },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      borderRadius: 8,
                      fontSize: '0.84rem',
                      fontWeight: 500,
                    }}
                    className="btn-ghost"
                  >
                    <Icon size={15} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

