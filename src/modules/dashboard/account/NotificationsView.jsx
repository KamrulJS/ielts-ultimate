'use client';
import styles from './NotificationsView.module.css';

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
    <div className={styles.noti_div_1}>
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

      <div className={styles.noti_div_2}>
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
            <div className={styles.noti_div_3}>
              <span
                className={styles.noti_span_4}
              >
                <Bell size={15} />
              </span>
              <div>
                <div className={styles.noti_div_5}>
                  <span className={styles.noti_span_6}>{n.title}</span>
                  <Badge variant="neutral">{n.category}</Badge>
                  {!n.read && <Badge variant="purple">Unread</Badge>}
                </div>
                <p className={`text-xs text-muted ${styles.noti_p_7}`} >{n.message} • {n.time}</p>
              </div>
            </div>

            <div className={styles.noti_div_8}>
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

