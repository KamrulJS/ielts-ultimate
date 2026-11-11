'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';

export function NotificationsView() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Unread', 'Evaluation', 'Session', 'Streak', 'Battle', 'Community'];

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'All') return true;
      if (filter === 'Unread') return !n.read;
      return n.category === filter;
    });
  }, [notifications, filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread updates across evaluations, live sessions, streaks, and Band Battles.`}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]}
        actions={
          <button type="button" className="btn btn-secondary btn-sm" onClick={markAllNotificationsRead}>
            <CheckCheck size={14} /> Mark All Read
          </button>
        }
      />

      <div className="filter-pills">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`filter-pill ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((n) => (
          <div
            key={n.id}
            className="card card-compact"
            style={{
              backgroundColor: n.read ? 'var(--surface)' : 'var(--accent-purple-soft)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bell size={15} />
              </span>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{n.title}</span>
                  <Badge variant="neutral">{n.category}</Badge>
                  {!n.read && <Badge variant="purple">Unread</Badge>}
                </div>
                <p className="text-xs text-muted" style={{ marginTop: 4 }}>{n.message} • {n.time}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {!n.read && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => markNotificationRead(n.id)}>
                  Mark read
                </button>
              )}
              <Link href={n.href} onClick={() => markNotificationRead(n.id)} className="btn btn-primary btn-sm">
                Open <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

