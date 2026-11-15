'use client';
import styles from './GroupDetailView.module.css';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Calendar, Check, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader, Badge } from '@/components/common/UiPrimitives';

export function GroupDetailView({ groupId }) {
  const { groups, toggleJoinGroup, profile, showToast } = useApp();
  const group = groups.find((g) => g.id === groupId) || groups[0];
  const [notes, setNotes] = useState([
    { id: 1, author: 'Arjun Mehta', text: 'Saturday mock review session starts at 10:00 AM EST — bring your Task 2 outlines!' },
    { id: 2, author: 'Nadia Rahman', text: 'Uploaded my TFNG scanning notes in today’s cohort thread.' },
  ]);
  const [msg, setMsg] = useState('');

  const postNote = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setNotes((prev) => [{ id: Date.now(), author: profile.name, text: msg.trim() }, ...prev]);
    setMsg('');
    showToast('Posted to group board', 'success');
  };

  return (
    <div className={styles.grou_div_1}>
      <PageHeader
        title={group.name}
        description={group.focus}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Community', href: '/community' },
          { label: group.name },
        ]}
        actions={
          <div className={styles.grou_div_2}>
            <Link href="/community" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} /> Community
            </Link>
            <button
              type="button"
              onClick={() => toggleJoinGroup(group.id)}
              className={`btn btn-sm ${group.joined ? 'btn-secondary' : 'btn-primary'}`}
            >
              {group.joined ? <><Check size={14} /> Joined</> : 'Join Study Group'}
            </button>
          </div>
        }
      />

      <div className={`card ${styles.grou_div_3}`} >
        <div
          style={{
            height: 150,
            backgroundColor: 'var(--bg-secondary)',
            backgroundImage: `url(${group.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className={styles.grou_div_4}>
          <div className={styles.grou_div_5}>
            <Badge variant="purple"><Users size={13} /> {group.members} Members</Badge>
            <Badge variant="yellow"><Calendar size={13} /> {group.schedule}</Badge>
          </div>
          <span className="text-xs text-muted">Active IELTS Ultimate Cohort</span>
        </div>
      </div>

      <div className={`card ${styles.grou_div_6}`} >
        <h2 className="h3">Group Study Board</h2>
        <form onSubmit={postNote} className={styles.grou_div_2}>
          <input
            className="input"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Share an update or schedule check-in with this group..."
          />
          <button type="submit" className="btn btn-primary">
            <Send size={14} /> Post
          </button>
        </form>
        {notes.map((n) => (
          <div key={n.id} className="card-warm card-compact">
            <div className={styles.grou_div_7}>{n.author}</div>
            <p className={`text-sm ${styles.grou_p_8}`} >{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

